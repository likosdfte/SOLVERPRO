
import React, { useState } from 'react';

interface LoginProps {
  onAdminSuccess: () => void;
  onStudentEnter: () => void;
}

const Login: React.FC<LoginProps> = ({ onAdminSuccess, onStudentEnter }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // In a real app, use the hash logic. For this demo, simple check.
    if (username === 'admin' && password === 'admin123') {
      onAdminSuccess();
    } else {
      setError('Credenciales de administrador incorrectas.');
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-8 py-12">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-slate-900">Bienvenido a SolverPro</h2>
        <p className="mt-2 text-slate-600">Resuelve tus problemas académicos en tiempo real</p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
        <div className="space-y-6">
          <div 
            onClick={onStudentEnter}
            className="group relative cursor-pointer overflow-hidden rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 p-8 text-white transition-all hover:scale-[1.02] hover:shadow-2xl active:scale-95"
          >
            <div className="relative z-10 text-center">
              <span className="text-5xl mb-4 block">👨‍🎓</span>
              <h3 className="text-2xl font-bold mb-2 uppercase tracking-wide">¿Necesitas Ayuda?</h3>
              <p className="text-green-50 text-sm">Sube tu ejercicio y obtén una solución profesional ahora mismo.</p>
              <div className="mt-6 inline-block bg-white text-green-700 px-6 py-3 rounded-full font-bold shadow-lg">
                ENVIAR MI PROBLEMA
              </div>
            </div>
            <div className="absolute -right-8 -bottom-8 h-32 w-32 rounded-full bg-white/10 group-hover:scale-150 transition-transform duration-500"></div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-slate-400 font-medium">Panel Administrativo</span>
            </div>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4">
            {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">{error}</div>}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Usuario</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="admin"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Contraseña</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
            >
              Iniciar Sesión Admin
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
