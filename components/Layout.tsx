
import React from 'react';
import { AppMode } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  mode: AppMode;
  onLogout: () => void;
  onChangeMode: (mode: AppMode) => void;
  isAuth: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, mode, onLogout, onChangeMode, isAuth }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => onChangeMode(AppMode.LOGIN)}>
            <span className="text-2xl">🎓</span>
            <h1 className="text-xl font-bold tracking-tight">SolverPro</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {mode !== AppMode.LOGIN && (
              <button 
                onClick={() => onChangeMode(AppMode.STUDENT)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${mode === AppMode.STUDENT ? 'bg-white text-indigo-700' : 'hover:bg-white/10'}`}
              >
                Estudiantes
              </button>
            )}
            
            {isAuth && (
              <button 
                onClick={() => onChangeMode(AppMode.ADMIN)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${mode === AppMode.ADMIN ? 'bg-white text-indigo-700' : 'hover:bg-white/10'}`}
              >
                Admin
              </button>
            )}

            {isAuth && (
              <button 
                onClick={onLogout}
                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-1"
              >
                <span>🚪</span>
                <span className="hidden sm:inline">Cerrar Sesión</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8">
        {children}
      </main>

      <footer className="bg-slate-800 text-slate-400 py-6 text-center text-sm">
        <p>&copy; 2024 SolverPro. Resolviendo el futuro, un ejercicio a la vez.</p>
      </footer>
    </div>
  );
};
