import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, UserRole } from '../types';
import Button from './Button';

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
}

const LeafIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const BlockchainIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
);

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
    const navigate = useNavigate();

    const handleLogoutClick = () => {
        onLogout();
        navigate('/');
    };
    
    const formatAddress = (addr: string) => {
        if (!addr) return '';
        return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
    };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md shadow-md z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center space-x-2">
            <div className="flex items-center">
              <LeafIcon />
              <span className="ml-2 text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                AgriTrust
              </span>
            </div>
            <span className="text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
              Decentralized
            </span>
          </Link>
          
          <div className="flex items-center space-x-6">
            {user ? (
                <>
                    <div className="hidden md:flex items-center space-x-4 text-sm">
                        <div className="flex items-center">
                            <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                            <span className="font-medium">
                                {user.role === UserRole.Farmer ? 'Farmer' : 'Researcher'}
                            </span>
                        </div>
                        <div className="flex items-center text-gray-600">
                            <BlockchainIcon />
                            <span className="ml-1 font-mono text-xs">
                                {formatAddress(user.ethereumAddress || user.id)}
                            </span>
                        </div>
                    </div>
                    <Button 
                        onClick={handleLogoutClick}
                        className="flex items-center"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                        </svg>
                        Logout
                    </Button>
                </>
            ) : (
                <Button 
                    onClick={() => navigate('/auth')}
                    className="flex items-center"
                >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
                    </svg>
                    Login / Sign Up
                </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;