
import React, { useState } from 'react';
import { Problem, ProblemStatus } from '../types';

interface AdminDashboardProps {
  problems: Problem[];
  onUpdate: (problem: Problem) => void;
  onDelete: (id: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ problems, onUpdate, onDelete }) => {
  const [filter, setFilter] = useState<ProblemStatus | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const stats = {
    pending: problems.filter(p => p.status === 'pending').length,
    progress: problems.filter(p => p.status === 'in-progress').length,
    completed: problems.filter(p => p.status === 'completed').length,
    revenue: problems.filter(p => p.paid).reduce((acc, curr) => acc + (curr.analysis?.price || 0), 0)
  };

  const filteredProblems = problems.filter(p => {
    const matchesStatus = filter === 'all' || p.status === filter;
    const matchesSearch = p.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.phone.includes(searchTerm);
    return matchesStatus && matchesSearch;
  });

  const handleUpdateStatus = (problem: Problem, newStatus: ProblemStatus) => {
    onUpdate({ ...problem, status: newStatus });
  };

  const handleTogglePayment = (problem: Problem) => {
    onUpdate({ ...problem, paid: !problem.paid });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800">Panel de Control</h2>
          <p className="text-slate-500">Gestión de problemas y flujo de ingresos</p>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 min-w-[120px] text-center">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Pendientes</p>
            <p className="text-2xl font-black text-orange-500">{stats.pending}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 min-w-[120px] text-center">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">En Proceso</p>
            <p className="text-2xl font-black text-blue-500">{stats.progress}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 min-w-[120px] text-center">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Completados</p>
            <p className="text-2xl font-black text-green-500">{stats.completed}</p>
          </div>
          <div className="bg-indigo-600 p-4 rounded-2xl shadow-lg min-w-[150px] text-center text-white">
            <p className="text-xs font-bold text-indigo-200 uppercase tracking-widest">Ingresos Totales</p>
            <p className="text-2xl font-black">S/ {stats.revenue.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <input 
            type="text" 
            placeholder="🔍 Buscar por nombre o teléfono..." 
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select 
          className="px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all bg-white font-semibold text-slate-700"
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
        >
          <option value="all">Todos los Estados</option>
          <option value="pending">Pendientes</option>
          <option value="in-progress">En Proceso</option>
          <option value="completed">Completados</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProblems.length === 0 ? (
          <div className="col-span-full py-20 text-center">
            <span className="text-6xl block mb-4">📭</span>
            <p className="text-xl font-bold text-slate-400">No hay problemas que coincidan con los filtros.</p>
          </div>
        ) : (
          filteredProblems.map((problem) => (
            <div key={problem.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 flex flex-col group hover:shadow-xl transition-all duration-300">
              <div className="relative h-48 bg-slate-100">
                <img src={problem.image} className="w-full h-full object-contain cursor-pointer" alt="Problem" onClick={() => window.open(problem.image)} />
                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest ${
                  problem.status === 'pending' ? 'bg-orange-100 text-orange-600' :
                  problem.status === 'in-progress' ? 'bg-blue-100 text-blue-600' :
                  'bg-green-100 text-green-600'
                }`}>
                  {problem.status === 'pending' ? 'Pendiente' : problem.status === 'in-progress' ? 'En Proceso' : 'Completado'}
                </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <div className="mb-4">
                  <h3 className="font-black text-lg text-slate-800 uppercase tracking-tight truncate">{problem.studentName}</h3>
                  <p className="text-slate-500 font-medium text-sm">📱 {problem.phone}</p>
                </div>

                {problem.analysis && (
                  <div className="bg-slate-50 p-3 rounded-xl mb-4 text-xs space-y-1">
                    <p className="font-bold text-indigo-700">📚 {problem.analysis.subject}</p>
                    <p className="text-slate-600 line-clamp-2">{problem.analysis.description}</p>
                    <div className="flex justify-between items-center pt-2 mt-2 border-t border-slate-200">
                      <span className="font-black text-slate-700">S/ {problem.analysis.price.toFixed(2)}</span>
                      <button 
                        onClick={() => handleTogglePayment(problem)}
                        className={`px-2 py-0.5 rounded font-bold uppercase ${problem.paid ? 'bg-green-500 text-white' : 'bg-slate-200 text-slate-600'}`}
                      >
                        {problem.paid ? 'PAGADO' : 'COBRAR'}
                      </button>
                    </div>
                  </div>
                )}

                <div className="mt-auto space-y-2">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleUpdateStatus(problem, 'in-progress')}
                      className="flex-1 bg-blue-50 text-blue-600 py-2 rounded-xl text-xs font-black hover:bg-blue-100 transition-colors"
                    >
                      ASIGNAR
                    </button>
                    <button 
                      onClick={() => handleUpdateStatus(problem, 'completed')}
                      className="flex-1 bg-green-50 text-green-600 py-2 rounded-xl text-xs font-black hover:bg-green-100 transition-colors"
                    >
                      TERMINAR
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => window.open(`https://wa.me/${problem.phone.replace(/\D/g, '')}`, '_blank')}
                      className="flex-1 bg-green-600 text-white py-2 rounded-xl text-xs font-black hover:bg-green-700 transition-colors"
                    >
                      WHATSAPP
                    </button>
                    <button 
                      onClick={() => onDelete(problem.id)}
                      className="bg-red-50 text-red-600 px-4 py-2 rounded-xl text-xs font-black hover:bg-red-100 transition-colors"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
