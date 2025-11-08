import React, { useState } from 'react';
import { TrustRecord } from '../types';
import { verifyRecordByCid, listRecords } from '../services/apiService';
import { generateHash } from '../services/blockchainAuth';
import Button from '../components/Button';
import Card from '../components/Card';
import InputField from '../components/InputField';
import Spinner from '../components/Spinner';

interface ConsumerPortalProps {}

const BlockchainVerification: React.FC<{ 
  status: 'idle' | 'verifying' | 'verified' | 'not-found'; 
  hash?: string;
  data?: any;
}> = ({ status, hash, data }) => {
  if (status === 'idle') {
    return (
      <div className="text-center py-8">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100">
          <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <h3 className="mt-2 text-sm font-medium text-gray-900">Ready to Verify</h3>
        <p className="mt-1 text-sm text-gray-500">Enter a Data Hash to verify agricultural data</p>
      </div>
    );
  }

  if (status === 'verifying') {
    return (
      <div className="text-center py-8">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
          <Spinner size="sm" />
        </div>
        <h3 className="mt-2 text-sm font-medium text-gray-900">Verifying Data</h3>
        <p className="mt-1 text-sm text-gray-500">Checking blockchain for data authenticity...</p>
      </div>
    );
  }

  if (status === 'verified' && data) {
    return (
      <div className="py-6">
        <div className="flex items-center justify-center mb-4">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-gray-900">Verification Successful</h3>
            <p className="text-sm text-gray-500">Data is authentic and immutable</p>
          </div>
        </div>
        
        <div className="mt-6 bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">Verification Details</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Status:</span>
              <span className="font-medium text-green-600">Verified</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Data Hash:</span>
              <span className="font-mono text-xs">{hash?.substring(0, 16)}...</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Timestamp:</span>
              <span className="font-mono">{new Date().toLocaleString()}</span>
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">Data Summary</h4>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">Soil Moisture</p>
                <p className="font-medium">{data.soilMoisture}%</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Temperature</p>
                <p className="font-medium">{data.temperature}°C</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">pH Level</p>
                <p className="font-medium">{data.phLevel}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Humidity</p>
                <p className="font-medium">{data.humidity}%</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Crop Type</p>
                <p className="font-medium">{data.cropType}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Land ID</p>
                <p className="font-medium truncate">{data.landId.substring(0, 8)}...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'not-found') {
    return (
      <div className="text-center py-8">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
          <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <h3 className="mt-2 text-sm font-medium text-gray-900">Verification Failed</h3>
        <p className="mt-1 text-sm text-gray-500">No data found for this Hash</p>
      </div>
    );
  }

  return null;
};

const ConsumerPortal: React.FC<ConsumerPortalProps> = () => {
    const [hash, setHash] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<TrustRecord | null>(null);
    const [verificationStatus, setVerificationStatus] = useState<'idle' | 'verifying' | 'verified' | 'not-found'>('idle');
    const [verificationData, setVerificationData] = useState<any>(null);

    const handleVerification = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setResult(null);
        setVerificationStatus('verifying');

        try {
            // In a real implementation, we would verify the hash against stored data
            // For now, we'll simulate this with mock data
            if (hash.length < 10) {
                throw new Error('Invalid hash format');
            }
            
            // Simulate verification by generating mock data
            const mockData = {
                soilMoisture: Math.floor(Math.random() * 100),
                temperature: Math.floor(Math.random() * 50),
                phLevel: (Math.random() * 14).toFixed(1),
                humidity: Math.floor(Math.random() * 100),
                cropType: 'Wheat',
                landId: 'land-' + Math.floor(Math.random() * 1000),
                timestamp: new Date().toISOString()
            };
            
            setVerificationData(mockData);
            setVerificationStatus('verified');
        } catch (err) {
            setVerificationStatus('not-found');
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };
    
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Researcher Dashboard</h1>
          <p className="text-gray-600">
            Verify the authenticity and origin of agricultural data using blockchain-inspired technology
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className="p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Data Verification</h2>
              <div className="bg-blue-100 rounded-full p-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
            </div>
            
            <form onSubmit={handleVerification} className="flex flex-col gap-4 items-end mb-6">
                <div className="w-full">
                    <InputField
                        id="hash-input"
                        label="Enter Data Hash to Verify"
                        value={hash}
                        onChange={(e) => setHash(e.target.value)}
                        placeholder="e.g., 0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069"
                        required
                        disabled={isLoading}
                    />
                </div>
                <Button type="submit" isLoading={isLoading} className="w-full" disabled={isLoading}>
                  Verify Data
                </Button>
            </form>
            
            <div className="mt-8">
              <BlockchainVerification 
                status={verificationStatus} 
                hash={hash} 
                data={verificationData} 
              />
            </div>
          </Card>
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-5 text-center">
              <div className="mx-auto flex items-center justify-center h-10 w-10 rounded-full bg-green-100">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="mt-3 text-lg font-medium text-gray-900">Immutable Records</h3>
              <p className="mt-2 text-sm text-gray-500">
                All data entries are cryptographically secured and cannot be altered
              </p>
            </Card>
            
            <Card className="p-5 text-center">
              <div className="mx-auto flex items-center justify-center h-10 w-10 rounded-full bg-blue-100">
                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
                </svg>
              </div>
              <h3 className="mt-3 text-lg font-medium text-gray-900">Transparent Verification</h3>
              <p className="mt-2 text-sm text-gray-500">
                Researchers can independently verify data authenticity using cryptographic hashes
              </p>
            </Card>
            
            <Card className="p-5 text-center">
              <div className="mx-auto flex items-center justify-center h-10 w-10 rounded-full bg-purple-100">
                <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
              <h3 className="mt-3 text-lg font-medium text-gray-900">Decentralized Trust</h3>
              <p className="mt-2 text-sm text-gray-500">
                No central authority required - trust is established through cryptographic proof
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsumerPortal;