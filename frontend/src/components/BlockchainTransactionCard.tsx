import React from 'react';
import Card from './Card';

interface BlockchainTransactionCardProps {
  hash: string;
  timestamp: string;
  producerId: string;
  landId: string;
  soilMoisture: number;
  temperature: number;
  cid: string;
  status: 'Verified' | 'Pending';
}

const BlockchainTransactionCard: React.FC<BlockchainTransactionCardProps> = ({
  hash,
  timestamp,
  producerId,
  landId,
  soilMoisture,
  temperature,
  cid,
  status
}) => {
  const formatAddress = (addr: string) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <Card className="p-4 border-l-4 border-l-blue-500">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-bold text-gray-900">Data Entry</h4>
          <p className="text-sm text-gray-500">
            {new Date(timestamp).toLocaleDateString()} at {new Date(timestamp).toLocaleTimeString()}
          </p>
        </div>
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
          status === 'Verified' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-yellow-100 text-yellow-800'
        }`}>
          {status}
        </span>
      </div>
      
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div>
          <p className="text-xs text-gray-500">Land Parcel</p>
          <p className="text-sm font-medium">{landId}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Producer</p>
          <p className="text-sm font-medium">{formatAddress(producerId)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Soil Moisture</p>
          <p className="text-sm font-medium">{soilMoisture}%</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Temperature</p>
          <p className="text-sm font-medium">{temperature}°C</p>
        </div>
      </div>
      
      <div className="mt-4 pt-3 border-t border-gray-100">
        <p className="text-xs text-gray-500">Content ID</p>
        <p className="text-xs font-mono truncate">{cid}</p>
      </div>
      
      <div className="mt-2">
        <p className="text-xs text-gray-500">Data Hash</p>
        <p className="text-xs font-mono truncate">{hash ? `${hash.substring(0, 16)}...` : 'N/A'}</p>
      </div>
      
      <div className="mt-4 flex items-center text-xs text-gray-500">
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
        </svg>
        <span>Blockchain Secured</span>
      </div>
    </Card>
  );
};

export default BlockchainTransactionCard;