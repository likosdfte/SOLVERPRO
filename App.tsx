
import React, { useState, useEffect } from 'react';
import { AppMode, Problem } from './types';
import Login from './components/Login';
import StudentDashboard from './components/StudentDashboard';
import AdminDashboard from './components/AdminDashboard';
import { Layout } from './components/Layout';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.LOGIN);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [isAuth, setIsAuth] = useState(false);

  // Persistence
  useEffect(() => {
    const stored = localStorage.getItem('solverpro_problems');
    if (stored) {
      try {
        setProblems(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to load problems", e);
      }
    }
    
    const auth = sessionStorage.getItem('solverpro_auth');
    if (auth === 'true') {
      setIsAuth(true);
      setMode(AppMode.ADMIN);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('solverpro_problems', JSON.stringify(problems));
  }, [problems]);

  const handleLogout = () => {
    sessionStorage.removeItem('solverpro_auth');
    setIsAuth(false);
    setMode(AppMode.LOGIN);
  };

  const handleAddProblem = (problem: Problem) => {
    setProblems(prev => [problem, ...prev]);
  };

  const handleUpdateProblem = (updated: Problem) => {
    setProblems(prev => prev.map(p => p.id === updated.id ? updated : p));
  };

  const handleDeleteProblem = (id: string) => {
    setProblems(prev => prev.filter(p => p.id !== id));
  };

  const renderContent = () => {
    switch (mode) {
      case AppMode.LOGIN:
        return <Login 
          onAdminSuccess={() => { setIsAuth(true); setMode(AppMode.ADMIN); sessionStorage.setItem('solverpro_auth', 'true'); }} 
          onStudentEnter={() => setMode(AppMode.STUDENT)} 
        />;
      case AppMode.STUDENT:
        return <StudentDashboard onAddProblem={handleAddProblem} onBack={() => setMode(AppMode.LOGIN)} />;
      case AppMode.ADMIN:
        return isAuth ? (
          <AdminDashboard 
            problems={problems} 
            onUpdate={handleUpdateProblem} 
            onDelete={handleDeleteProblem} 
          />
        ) : (
          <Login 
            onAdminSuccess={() => { setIsAuth(true); setMode(AppMode.ADMIN); }} 
            onStudentEnter={() => setMode(AppMode.STUDENT)} 
          />
        );
      default:
        return null;
    }
  };

  return (
    <Layout 
      mode={mode} 
      onLogout={handleLogout} 
      onChangeMode={(m) => setMode(m)}
      isAuth={isAuth}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;
