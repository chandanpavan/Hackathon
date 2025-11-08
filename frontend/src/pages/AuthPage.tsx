import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, UserRole } from '../types';
import Button from '../components/Button';
import InputField from '../components/InputField';
import Card from '../components/Card';
import { login as apiLogin, signup as apiSignup } from '../services/apiService';
import { generateMnemonic, validateMnemonic } from '../services/blockchainAuth';

interface AuthPageProps {
  onLogin: (user: User) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
  const [activeTab, setActiveTab] = useState<UserRole>(UserRole.Farmer);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mnemonic, setMnemonic] = useState('');
  const [confirmMnemonic, setConfirmMnemonic] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [authMethod, setAuthMethod] = useState<'password' | 'mnemonic'>('password');
  const [showMnemonic, setShowMnemonic] = useState(false);
  const [generatedMnemonic, setGeneratedMnemonic] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      if (authMethod === 'password') {
        const user = mode === 'login'
          ? await apiLogin({ email, password, role: activeTab })
          : await apiSignup({ name, email, password, role: activeTab });
        onLogin(user);
        navigate(activeTab === UserRole.Farmer ? '/farmer' : '/consumer');
      } else {
        // Mnemonic authentication
        if (mode === 'login') {
          if (!validateMnemonic(mnemonic)) {
            throw new Error('Invalid mnemonic phrase');
          }
          // In a real implementation, we would authenticate using the mnemonic
          // For now, we'll simulate this with a mock user
          const mockUser: User = {
            id: 'mock-user-id',
            name: 'Decentralized User',
            email: 'decentralized@example.com',
            role: activeTab,
            ethereumAddress: '0x' + mnemonic.split(' ')[0].repeat(10).substring(0, 40)
          };
          onLogin(mockUser);
          navigate(activeTab === UserRole.Farmer ? '/farmer' : '/consumer');
        } else {
          // Signup with mnemonic
          if (!validateMnemonic(mnemonic) || mnemonic !== confirmMnemonic) {
            throw new Error('Mnemonic phrases do not match or are invalid');
          }
          // In a real implementation, we would create an account using the mnemonic
          // For now, we'll simulate this with a mock user
          const mockUser: User = {
            id: 'mock-user-id',
            name: name || 'Decentralized User',
            email: email || 'decentralized@example.com',
            role: activeTab,
            ethereumAddress: '0x' + mnemonic.split(' ')[0].repeat(10).substring(0, 40)
          };
          onLogin(mockUser);
          navigate(activeTab === UserRole.Farmer ? '/farmer' : '/consumer');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateMnemonic = () => {
    const newMnemonic = generateMnemonic();
    setGeneratedMnemonic(newMnemonic);
    setShowMnemonic(true);
  };

  const TabButton: React.FC<{ role: UserRole, label: string }> = ({ role, label }) => (
    <button
      onClick={() => setActiveTab(role)}
      className={`w-1/2 py-4 px-1 text-center font-medium text-sm leading-5 rounded-t-lg
        ${activeTab === role ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 border-transparent'}
        focus:outline-none transition-colors duration-300`}
    >
      {label}
    </button>
  );

  const AuthMethodToggle: React.FC = () => (
    <div className="flex border border-gray-300 rounded-lg mb-6">
      <button
        type="button"
        onClick={() => setAuthMethod('password')}
        className={`flex-1 py-2 px-4 text-center rounded-l-lg ${
          authMethod === 'password' 
            ? 'bg-primary text-white' 
            : 'bg-white text-gray-700 hover:bg-gray-100'
        }`}
      >
        Password
      </button>
      <button
        type="button"
        onClick={() => setAuthMethod('mnemonic')}
        className={`flex-1 py-2 px-4 text-center rounded-r-lg ${
          authMethod === 'mnemonic' 
            ? 'bg-primary text-white' 
            : 'bg-white text-gray-700 hover:bg-gray-100'
        }`}
      >
        12-Word Phrase
      </button>
    </div>
  );

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Decentralized Agricultural Data
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Secure your land data with blockchain-inspired technology
          </p>
        </div>
        <Card className="p-2 sm:p-6 shadow-xl">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-4" aria-label="Tabs">
              <TabButton role={UserRole.Farmer} label="Farmer" />
              <TabButton role={UserRole.Consumer} label="Researcher" />
            </nav>
          </div>
          
          <AuthMethodToggle />
          
          <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
            {authMethod === 'password' ? (
              <>
                {mode === 'signup' && (
                  <div className="pb-2">
                    <InputField
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      required
                      placeholder="Full name"
                      label="Full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                )}
                <InputField
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="Email address"
                  label="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <div className="pt-2">
                  <InputField
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      placeholder="Password"
                      label="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </>
            ) : (
              <>
                {mode === 'signup' && (
                  <div className="pb-2">
                    <InputField
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      required
                      placeholder="Full name"
                      label="Full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    <div className="mt-4">
                      <Button type="button" onClick={handleGenerateMnemonic} className="w-full">
                        Generate 12-Word Recovery Phrase
                      </Button>
                      {showMnemonic && (
                        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <p className="text-sm font-medium text-yellow-800 mb-2">Your Recovery Phrase:</p>
                          <p className="text-xs font-mono bg-white p-3 rounded border">{generatedMnemonic}</p>
                          <p className="mt-2 text-xs text-yellow-700">
                            Save this phrase securely. Anyone with this phrase can access your account.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="pt-2">
                  <label htmlFor="mnemonic" className="block text-sm font-medium text-gray-700 mb-1">
                    {mode === 'signup' ? 'Confirm Recovery Phrase' : 'Enter Recovery Phrase'}
                  </label>
                  <textarea
                    id="mnemonic"
                    rows={3}
                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                    placeholder="word1 word2 word3 ..."
                    value={mode === 'signup' ? confirmMnemonic : mnemonic}
                    onChange={(e) => mode === 'signup' ? setConfirmMnemonic(e.target.value) : setMnemonic(e.target.value)}
                    required
                  />
                </div>
              </>
            )}
            
            {error && <p className="text-red-500 text-sm">{error}</p>}
            
            <div className="flex gap-3 mt-6">
              <Button 
                type="button" 
                className="w-1/2" 
                isLoading={isLoading && mode==='login'} 
                onClick={(e) => { setMode('login'); handleSubmit(e as any); }}
              >
                Login
              </Button>
              <Button 
                type="button" 
                className="w-1/2" 
                isLoading={isLoading && mode==='signup'} 
                onClick={(e) => { setMode('signup'); handleSubmit(e as any); }}
              >
                Sign Up
              </Button>
            </div>
            
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                {authMethod === 'password' 
                  ? 'Traditional authentication with email and password' 
                  : 'Decentralized authentication with 12-word recovery phrase'}
              </p>
            </div>
          </form>
        </Card>
        
        <div className="text-center text-xs text-gray-500">
          <p>Blockchain-inspired security for agricultural data</p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;