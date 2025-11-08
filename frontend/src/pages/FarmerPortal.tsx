import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, TrustRecord, LandData } from '../types';
import { getLandData as getLandParcels, createRecord, listRecords } from '../services/apiService';
import { generateHash } from '../services/blockchainAuth';
import Button from '../components/Button';
import Card from '../components/Card';
import InputField from '../components/InputField';
import Spinner from '../components/Spinner';
import LandDataCard from '../components/LandDataCard';
import BlockchainTransactionCard from '../components/BlockchainTransactionCard';
import { FarmerDataForm } from '../components/FarmerDataForm';

interface FarmerPortalProps {
  user: User;
}

const BlockchainIndicator: React.FC<{ status: 'mining' | 'verified' | 'pending' }> = ({ status }) => {
  const statusConfig = {
    mining: { color: 'bg-yellow-500', text: 'Mining' },
    verified: { color: 'bg-green-500', text: 'Verified' },
    pending: { color: 'bg-blue-500', text: 'Pending' }
  };
  
  const config = statusConfig[status];
  
  return (
    <div className="flex items-center">
      <div className={`w-3 h-3 rounded-full ${config.color} mr-2 animate-pulse`}></div>
      <span className="text-sm font-medium">{config.text}</span>
    </div>
  );
};

const AddDataForm: React.FC<{
    landData: LandData[],
    onAddData: (data: any) => Promise<void>
}> = ({ landData, onAddData }) => {
    const [selectedLand, setSelectedLand] = useState<string>(landData[0]?.id || '');
    const [soilMoisture, setSoilMoisture] = useState('');
    const [temperature, setTemperature] = useState('');
    const [phLevel, setPhLevel] = useState('');
    const [humidity, setHumidity] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [generatedHash, setGeneratedHash] = useState('');
    const [isHashVisible, setIsHashVisible] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (landData.length > 0) {
            setSelectedLand(landData[0].id);
        }
    }, [landData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setSuccessMessage('');
        setErrorMessage('');
        setGeneratedHash('');
        setIsHashVisible(false);
        
        const land = landData.find(l => l.id === selectedLand);
        if (!land) {
            setErrorMessage('Selected land not found.');
            setIsLoading(false);
            return;
        }

        // Generate hash for the data (blockchain-inspired)
        const dataToHash = {
            landId: selectedLand,
            soilMoisture: parseInt(soilMoisture),
            temperature: parseInt(temperature),
            phLevel: parseFloat(phLevel),
            humidity: parseInt(humidity),
            cropType: land.crop,
            timestamp: new Date().toISOString()
        };
        
        const hash = generateHash(dataToHash);
        setGeneratedHash(hash);

        const data = {
            landId: selectedLand,
            soilMoisture: parseInt(soilMoisture),
            temperature: parseInt(temperature),
            phLevel: parseFloat(phLevel),
            humidity: parseInt(humidity),
            cropType: land.crop,
            cid: `bafybei_${hash.substring(2, 10)}_${Date.now()}`,
            hash: hash
        };

        try {
            await onAddData({ ...data, hash });
            setSuccessMessage(`Data successfully secured on the decentralized network!`);
            setSoilMoisture('');
            setTemperature('');
            setPhLevel('');
            setHumidity('');
            setIsHashVisible(true);
            
            // Copy hash to clipboard
            navigator.clipboard.writeText(hash);
        } catch (error) {
            console.error("Transaction failed:", error);
            setErrorMessage('Transaction failed. Check browser console for details.');
        } finally {
            setIsLoading(false);
        }
    };

    if (landData.length === 0) {
        return (
            <Card className="p-6 border-l-4 border-l-blue-500">
                <div className="flex items-start">
                    <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                            </svg>
                        </div>
                    </div>
                    <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">Add Farm Data</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            No land parcels are associated with your account yet. Contact an administrator to add your farm details before submitting sensor data.
                        </p>
                    </div>
                </div>
            </Card>
        );
    }

    return (
        <Card className="p-6 border-l-4 border-l-green-500">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Secure Farm Data</h3>
                <div className="flex space-x-2">
                    <Link to="/farmer/add-data">
                        <button 
                            className="bg-gray-100 hover:bg-gray-200 rounded-full p-2"
                            title="Expand to full screen"
                        >
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 0h-4m4 0l-5-5"></path>
                            </svg>
                        </button>
                    </Link>
                    <div className="bg-gray-100 rounded-full p-2">
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                        </svg>
                    </div>
                </div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="land" className="block text-sm font-medium text-gray-700 mb-1">Select Land Parcel</label>
                    <select 
                        id="land" 
                        value={selectedLand} 
                        onChange={e => setSelectedLand(e.target.value)} 
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md bg-white text-gray-900"
                    >
                        {landData.map(land => (
                            <option key={land.id} value={land.id}>
                                {land.name} ({land.crop})
                            </option>
                        ))}
                    </select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <InputField 
                        id="soil-moisture" 
                        label="Soil Moisture (%)" 
                        type="number" 
                        value={soilMoisture} 
                        onChange={e => setSoilMoisture(e.target.value)} 
                        required 
                        min="0"
                        max="100"
                    />
                    <InputField 
                        id="temperature" 
                        label="Temperature (°C)" 
                        type="number" 
                        value={temperature} 
                        onChange={e => setTemperature(e.target.value)} 
                        required 
                        min="-50"
                        max="60"
                    />
                    <InputField 
                        id="ph-level" 
                        label="pH Level" 
                        type="number" 
                        value={phLevel} 
                        onChange={e => setPhLevel(e.target.value)} 
                        required 
                        min="0"
                        max="14"
                        step="0.1"
                    />
                    <InputField 
                        id="humidity" 
                        label="Humidity (%)" 
                        type="number" 
                        value={humidity} 
                        onChange={e => setHumidity(e.target.value)} 
                        required 
                        min="0"
                        max="100"
                    />
                </div>
                
                <Button type="submit" isLoading={isLoading} className="w-full mt-4">
                    <div className="flex items-center justify-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                        </svg>
                        Secure Data on Chain
                    </div>
                </Button>
                
                {successMessage && (
                    <div className="p-3 bg-green-50 rounded-lg">
                        <p className="text-green-700 text-sm">{successMessage}</p>
                        {isHashVisible && generatedHash && (
                            <div className="mt-2">
                                <p className="text-xs font-medium text-green-700 mb-1">Data Hash (copied to clipboard):</p>
                                <p className="text-xs font-mono bg-white p-2 rounded border truncate">
                                    {generatedHash.substring(0, 32)}...
                                </p>
                            </div>
                        )}
                    </div>
                )}
                
                {errorMessage && (
                    <p className="text-red-500 text-center mt-2 text-sm">{errorMessage}</p>
                )}
            </form>
        </Card>
    );
};

const FarmerPortal: React.FC<FarmerPortalProps> = ({ user }) => {
  const [transactions, setTransactions] = useState<TrustRecord[]>([]);
  const [land, setLand] = useState<LandData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'data' | 'history'>('overview');
  const navigate = useNavigate();

  const formatAddress = (addr: string | undefined | null) => {
    if (!addr) return '0x0000...0000';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const fetchData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching land data for user:', user);
      console.log('User ID:', user.id);
      console.log('User role:', user.role);
      
      // Check if user.id is valid
      if (!user.id || user.id.trim() === '') {
        throw new Error('User ID is missing or empty');
      }
      
      // Check if user.role is valid
      if (!user.role) {
        throw new Error('User role is missing');
      }
      
      // Fetch land data from backend database
      const landData = await getLandParcels({ ownerId: user.id, role: user.role });
      setLand(landData);

      // Fetch recent trusted records
      const recs = await listRecords();
      setTransactions(recs);
    } catch (err) {
      console.error('Failed to load farmer data', err);
      setError(err instanceof Error ? err.message : 'Unable to load data');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddData = async (data: any) => {
      await createRecord({ ...data, producerId: user.id });
      await fetchData();
  };

  if (loading && !transactions.length) return <div className="mt-20"><Spinner size="lg" /></div>;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Farmer Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Securely manage and verify your agricultural data
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center space-x-4">
          <Button onClick={() => setShowForm(true)}>Add New Data</Button>
          <div className="bg-gray-100 rounded-lg px-4 py-2">
            <div className="flex items-center">
              <div className="bg-green-500 w-3 h-3 rounded-full mr-2"></div>
              <span className="text-sm font-medium">Connected</span>
            </div>
          </div>
        </div>
      </div>

      {/* Farmer Data Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <FarmerDataForm
              onSubmit={async (data) => {
                await handleAddData(data);
                setShowForm(false);
                // Show success message with hash key
                alert(`Data submitted successfully! Your hash key is: ${data.hashKey}`);
              }}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 bg-gradient-to-r from-green-500 to-green-600 text-white">
          <div className="flex items-center">
            <div className="rounded-full bg-white bg-opacity-20 p-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4 4 0 003 15z"></path>
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm opacity-80">Land Parcels</p>
              <p className="text-2xl font-bold">{land.length}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <div className="flex items-center">
            <div className="rounded-full bg-white bg-opacity-20 p-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm opacity-80">Data Entries</p>
              <p className="text-2xl font-bold">{transactions.length}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6 bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <div className="flex items-center">
            <div className="rounded-full bg-white bg-opacity-20 p-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm opacity-80">Security Status</p>
              <p className="text-2xl font-bold">Verified</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('data')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'data'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Add Data
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'history'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Data History
          </button>
        </nav>
      </div>

      {error && (
        <Card className="p-4 mb-6 bg-red-50 border border-red-200 text-red-700">
          {error}
        </Card>
      )}

      {activeTab === 'overview' && (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-2xl font-semibold mb-4">My Land Data</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {land.length > 0 ? (
                  land.map(item => <LandDataCard key={item.id} landItem={item} transactions={transactions} />)
                ) : (
                  <div className="col-span-full p-8 text-center text-gray-500 border border-dashed border-gray-300 rounded-lg bg-gray-50">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No land parcels</h3>
                    <p className="mt-1 text-sm text-gray-500">Contact an administrator to add your farm data.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Blockchain Security</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-5 h-5 rounded-full bg-green-500"></div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Data Immutability</p>
                    <p className="text-sm text-gray-500">All data entries are cryptographically secured</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-5 h-5 rounded-full bg-green-500"></div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Decentralized Storage</p>
                    <p className="text-sm text-gray-500">Data distributed across multiple nodes</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-5 h-5 rounded-full bg-green-500"></div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Transparent Verification</p>
                    <p className="text-sm text-gray-500">Researchers can verify data authenticity</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-200">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Your Wallet Address</h4>
                <p className="text-xs font-mono bg-gray-100 p-2 rounded">
                  {user?.ethereumAddress ? formatAddress(user.ethereumAddress) : formatAddress(user?.id)}
                </p>
              </div>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'data' && (
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Add Farm Data</h2>
            <Button 
              onClick={() => navigate('/farmer/add-data')}
              className="bg-green-600 hover:bg-green-700"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              Add Data Form
            </Button>
          </div>
          <AddDataForm landData={land} onAddData={handleAddData} />
        </div>
      )}

      {activeTab === 'history' && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Data History</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {transactions.length > 0 ? (
              [...transactions].reverse().slice(0, 10).map(tx => (
                <BlockchainTransactionCard
                  key={tx.id}
                  hash={tx.hash || ''}
                  timestamp={tx.timestamp}
                  producerId={tx.producerId}
                  landId={tx.landId}
                  soilMoisture={tx.soilMoisture}
                  temperature={tx.temperature}
                  cid={tx.cid}
                  status={tx.status}
                />
              ))
            ) : (
              <div className="col-span-full">
                <Card className="p-8 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No data history</h3>
                  <p className="mt-1 text-sm text-gray-500">Add your first data entry to get started.</p>
                </Card>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmerPortal;