
export type Complexity = 'simple' | 'medium' | 'complex';
export type ProblemStatus = 'pending' | 'in-progress' | 'completed';

export interface AIAnalysis {
  complexity: Complexity;
  subject: string;
  estimatedMinutes: number;
  price: number;
  description: string;
}

export interface Problem {
  id: string;
  studentName: string;
  phone: string;
  image: string; // Base64
  packageQuantity: number;
  packageDiscount: number;
  analysis: AIAnalysis | null;
  status: ProblemStatus;
  timestamp: string;
  assignedTeacher?: string;
  meetingLink?: string;
  paymentMethod?: string;
  paid: boolean;
}

export interface Package {
  quantity: number;
  price: number;
  discount: number;
  name: string;
}

export enum AppMode {
  LOGIN = 'LOGIN',
  STUDENT = 'STUDENT',
  ADMIN = 'ADMIN'
}
