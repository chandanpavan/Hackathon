import React, { useState, useCallback } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import AuthPage from './pages/AuthPage';
import FarmerPortal from './pages/FarmerPortal';
import ConsumerPortal from './pages/ConsumerPortal';
import AddFarmDataPage from './pages/AddFarmDataPage';
import { User, UserRole } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  

  const handleLogin = useCallback((loggedInUser: User) => {
    setUser(loggedInUser);
  }, []);

  const handleLogout = useCallback(() => {
    setUser(null);
  }, []);


  return (
    <HashRouter>
      <div className="bg-gradient-to-br from-blue-50 to-green-50 min-h-screen font-sans text-dark">
        <Header user={user} onLogout={handleLogout} />
        <main className="pt-20">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route 
              path="/auth" 
              element={user ? <Navigate to={user.role === UserRole.Farmer ? '/farmer' : '/consumer'} /> : <AuthPage onLogin={handleLogin} />} 
            />
            <Route 
              path="/farmer" 
              element={user && user.role === UserRole.Farmer ? <FarmerPortal user={user} /> : <Navigate to="/auth" />} 
            />
            <Route 
              path="/farmer/add-data" 
              element={user && user.role === UserRole.Farmer ? <AddFarmDataPage user={user} /> : <Navigate to="/auth" />} 
            />
            <Route 
              path="/consumer" 
              element={user && user.role === UserRole.Consumer ? <ConsumerPortal /> : <Navigate to="/auth" />} 
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-200 py-6 mt-12">
          <div className="container mx-auto px-4 text-center text-sm text-gray-600">
            <p>AgriTrust Decentralized Agricultural Data Platform</p>
            <p className="mt-1">Securing farm data with blockchain-inspired technology</p>
          </div>
        </footer>
      </div>
    </HashRouter>
  );
};

export default App;