import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';
import { LandData, TrustRecord } from '../types';
import Card from './Card';

interface LandDataCardProps {
  landItem: LandData;
  transactions: TrustRecord[];
}

const BlockchainBadge: React.FC = () => (
  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
    <svg
      className="mr-1 h-3 w-3 text-green-500"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
      ></path>
    </svg>
    Secured
  </span>
);

const LandDataCard: React.FC<LandDataCardProps> = ({ landItem, transactions }) => {
  const landHistory = transactions
    .filter((tx) => tx.landId === landItem.id)
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    .slice(-5); // Show last 5 entries

  const chartData = landHistory.map((tx) => ({
    date: new Date(tx.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    moisture: tx.soilMoisture,
    temperature: tx.temperature,
  }));

  const latestTx = landHistory[landHistory.length - 1];
  const lastUpdated = latestTx
    ? new Date(latestTx.timestamp).toLocaleDateString()
    : landItem.lastUpdated
    ? new Date(landItem.lastUpdated).toLocaleDateString()
    : 'N/A';
  const lastCid = latestTx?.cid ?? landItem.lastCid ?? 'N/A';

  return (
    <Card className="p-5 flex flex-col h-full border border-gray-200 hover:border-green-300 transition-all duration-300 hover:shadow-lg">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-bold text-lg text-gray-900">{landItem.name}</h4>
          <p className="text-gray-600">Crop: {landItem.crop}</p>
        </div>
        <BlockchainBadge />
      </div>

      <div className="mt-3 flex items-center text-sm text-gray-500">
        <svg
          className="w-4 h-4 mr-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          ></path>
        </svg>
        <span>Last Update: {lastUpdated}</span>
      </div>

      <div className="mt-2 flex items-center text-sm text-gray-500">
        <svg
          className="w-4 h-4 mr-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 10V3L4 14h7v7l9-11h-7z"
          ></path>
        </svg>
        <span className="truncate">CID: {lastCid.substring(0, 16)}...</span>
      </div>

      <div className="mt-4 flex-grow">
        <div className="flex justify-between items-center mb-2">
          <h5 className="text-sm font-semibold text-gray-700">Recent Trends</h5>
          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
            {landHistory.length} entries
          </span>
        </div>

        {landHistory.length > 1 ? (
          <div className="w-full h-40">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 10 }} /> {/* ✅ fixed */}
                <YAxis
                  yAxisId="left"
                  unit="°C"
                  tick={{ fill: '#6b7280', fontSize: 10 }}
                  width={30}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  unit="%"
                  tick={{ fill: '#6b7280', fontSize: 10 }}
                  width={30}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    fontSize: '12px',
                  }}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="temperature"
                  stroke="#f97316"
                  strokeWidth={2}
                  name="Temp (°C)"
                  dot={{ r: 3, strokeWidth: 0 }}
                  activeDot={{ r: 5, strokeWidth: 0 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="moisture"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Moisture (%)"
                  dot={{ r: 3, strokeWidth: 0 }}
                  activeDot={{ r: 5, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-40 text-gray-500 text-sm bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <svg
              className="h-8 w-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              ></path>
            </svg>
            <p className="mt-2">Not enough data to display trends</p>
            <p className="text-xs mt-1">Add sensor data to see visualizations</p>
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-gray-100">
        <div className="flex justify-between text-xs text-gray-500">
          <span>Data Security</span>
          <span className="font-medium text-green-600">Blockchain Secured</span>
        </div>
      </div>
    </Card>
  );
};

export default LandDataCard;
