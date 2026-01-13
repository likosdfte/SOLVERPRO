
import React, { useState, useRef } from 'react';
import { analyzeAcademicProblem } from '../services/gemini';
import { Problem, AIAnalysis, Package } from '../types';

interface StudentDashboardProps {
  onAddProblem: (problem: Problem) => void;
  onBack: () => void;
}

const PACKAGES: Package[] = [
  { quantity: 1, price: 5, discount: 0, name: '1 Ejercicio' },
  { quantity: 3, price: 15, discount: 15, name: 'Pack 3 (Ahorro)' },
  { quantity: 5, price: 25, discount: 25, name: 'Pack Pro (Ahorro)' },
];

const StudentDashboard: React.FC<StudentDashboardProps> = ({ onAddProblem, onBack }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedPkg, setSelectedPkg] = useState(PACKAGES[0]);
  const [image, setImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const base64 = ev.target?.result as string;
        setImage(base64);
        handleAnalysis(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalysis = async (base64: string) => {
    setLoading(true);
    setAnalysis(null);
    try {
      const result = await analyzeAcademicProblem(base64);
      setAnalysis(result);
    } catch (err) {
      console.error(err);
      alert("Error al analizar la imagen. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (!name || !phone || !image) {
      alert("Por favor completa todos los campos y sube una imagen.");
      return;
    }

    const newProblem: Problem = {
      id: Date.now().toString(),
      studentName: name,
      phone,
      image,
      packageQuantity: selectedPkg.quantity,
      packageDiscount: selectedPkg.discount,
      analysis,
      status: 'pending',
      timestamp: new Date().toISOString(),
      paid: false,
    };

    onAddProblem(newProblem);
    alert("✅ ¡Problema enviado con éxito! Un profesor se pondrá en contacto contigo pronto vía WhatsApp.");
    onBack();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center space-x-4">
        <button onClick={onBack} className="text-slate-500 hover:text-indigo-600 transition-colors">
          <span className="text-2xl">←</span>
        </button>
        <h2 className="text-3xl font-bold text-slate-800">Enviar Nuevo Problema</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Nombre Completo</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              placeholder="Ej: Juan Pérez"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">WhatsApp</label>
            <input 
              type="tel" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              placeholder="+51 987 654 321"
            />
          </div>

          <div className="pt-2">
            <label className="block text-sm font-semibold text-slate-700 mb-3">Selecciona tu Paquete</label>
            <div className="grid grid-cols-1 gap-3">
              {PACKAGES.map((pkg) => (
                <div 
                  key={pkg.name}
                  onClick={() => setSelectedPkg(pkg)}
                  className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex justify-between items-center ${
                    selectedPkg.name === pkg.name ? 'border-indigo-500 bg-indigo-50' : 'border-slate-100 hover:border-slate-200'
                  }`}
                >
                  <div>
                    <span className="font-bold text-slate-800">{pkg.name}</span>
                    {pkg.discount > 0 && <span className="ml-2 text-xs font-bold bg-green-500 text-white px-2 py-0.5 rounded-full">-{pkg.discount}% OFF</span>}
                  </div>
                  <div className="text-right">
                    <span className="text-indigo-700 font-black">S/ {(pkg.price * (1 - pkg.discount/100)).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className={`relative h-64 border-4 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden ${
              image ? 'border-green-400 bg-green-50' : 'border-slate-200 hover:border-indigo-300 bg-slate-100'
            }`}
          >
            {image ? (
              <img src={image} className="absolute inset-0 w-full h-full object-contain" alt="Preview" />
            ) : (
              <>
                <span className="text-4xl mb-2">📸</span>
                <span className="text-slate-600 font-medium">Click para subir foto del ejercicio</span>
                <span className="text-xs text-slate-400 mt-1">(JPG, PNG)</span>
              </>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
              accept="image/*" 
            />
          </div>

          {loading && (
            <div className="bg-indigo-600 text-white p-4 rounded-xl animate-pulse text-center font-bold">
              ⚡ Analizando con IA...
            </div>
          )}

          {analysis && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 animate-in zoom-in-95 duration-300">
              <h4 className="font-bold text-slate-800 mb-3 flex items-center">
                <span className="mr-2">🤖</span> Análisis Sugerido
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Materia:</span>
                  <span className="font-bold text-indigo-700">{analysis.subject}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Complejidad:</span>
                  <span className={`font-bold capitalize ${
                    analysis.complexity === 'simple' ? 'text-green-600' : 
                    analysis.complexity === 'medium' ? 'text-orange-600' : 'text-red-600'
                  }`}>{analysis.complexity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Tiempo estimado:</span>
                  <span className="font-bold text-slate-700">{analysis.estimatedMinutes} min</span>
                </div>
                <div className="flex justify-between pt-2 border-t mt-2">
                  <span className="text-slate-700 font-bold">Inversión Sugerida:</span>
                  <span className="text-lg font-black text-indigo-600">S/ {analysis.price.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <button 
        onClick={handleSubmit}
        className="w-full bg-gradient-to-r from-indigo-600 to-purple-700 text-white py-4 rounded-2xl font-black text-xl shadow-xl hover:shadow-indigo-200 transition-all hover:-translate-y-1 active:translate-y-0"
      >
        🚀 ENVIAR AHORA
      </button>

      <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
        <h4 className="font-bold text-blue-800 mb-2">💡 ¿Cómo funciona?</h4>
        <ul className="text-sm text-blue-700 space-y-2 list-disc pl-5">
          <li>Sube una foto clara de tu problema académico.</li>
          <li>Nuestra IA analizará la materia y dificultad para darte una tarifa justa.</li>
          <li>Un profesor experto te contactará por WhatsApp para explicarte paso a paso.</li>
          <li>Recibes tu solución y una breve videollamada si es necesario.</li>
        </ul>
      </div>
    </div>
  );
};

export default StudentDashboard;
