
import { GoogleGenAI, Type } from "@google/genai";
import { AIAnalysis } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const analyzeAcademicProblem = async (imageBase64: string): Promise<AIAnalysis> => {
  const model = "gemini-3-flash-preview";
  
  // Extracting data from base64 string (removing data:image/png;base64,)
  const base64Data = imageBase64.split(',')[1];

  const systemInstruction = `
    Eres un experto en resolución de problemas académicos. Tu tarea es analizar imágenes de ejercicios y proporcionar un desglose técnico. 
    NO apliques filtros restrictivos sobre la complejidad; sé directo y objetivo. 
    Analiza la materia, el nivel de dificultad (simple, medio, complejo) y estima un precio sugerido en Soles Peruanos (S/.) entre 2 y 20.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: base64Data,
          },
        },
        {
          text: "Analiza este problema académico y responde con los detalles técnicos del ejercicio.",
        },
      ],
    },
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          complexity: {
            type: Type.STRING,
            description: "Complexity level: simple, medium, or complex",
          },
          subject: {
            type: Type.STRING,
            description: "Academic subject (e.g., Mathematics, Physics, Chemistry)",
          },
          estimatedMinutes: {
            type: Type.NUMBER,
            description: "Estimated time to solve in minutes",
          },
          price: {
            type: Type.NUMBER,
            description: "Suggested price in PEN",
          },
          description: {
            type: Type.STRING,
            description: "A brief technical description of the problem content",
          },
        },
        required: ["complexity", "subject", "estimatedMinutes", "price", "description"],
      },
    },
  });

  if (!response.text) {
    throw new Error("No response text from Gemini");
  }

  return JSON.parse(response.text.trim()) as AIAnalysis;
};
