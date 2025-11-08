import React, { useState } from 'react';
import Button from './Button';
import InputField from './InputField';

interface FarmerDataFormProps {
  onSubmit: (data: {
    cropType: string;
    quantity: string;
    harvestDate: string;
    location: string;
    hashKey: string;
  }) => void;
  onCancel: () => void;
}

export const FarmerDataForm: React.FC<FarmerDataFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    cropType: '',
    quantity: '',
    harvestDate: '',
    location: '',
  });

  const generateHashKey = async (data: typeof formData): Promise<string> => {
    const stringToHash = JSON.stringify(data) + Date.now();
    const encoder = new TextEncoder();
    const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(stringToHash));
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
    return hashHex.substring(0, 12);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const hashKey = await generateHashKey(formData);
    onSubmit({ ...formData, hashKey });
  };

  return (
    <div className="max-w-lg mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Add Farming Data</h2>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <InputField
            label="Crop Type"
            type="text"
            value={formData.cropType}
            onChange={(e) => setFormData({ ...formData, cropType: e.target.value })}
            required id={''}          />
          <InputField
            label="Quantity (in kg)"
            type="number"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            required id={''}          />
          <InputField
            label="Harvest Date"
            type="date"
            value={formData.harvestDate}
            onChange={(e) => setFormData({ ...formData, harvestDate: e.target.value })}
            required id={''}          />
          <InputField
            label="Location"
            type="text"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            required id={''}          />
        </div>
        <div className="mt-6 flex space-x-4">
          <Button type="submit">Submit</Button>
          <Button type="button" onClick={onCancel} variant="secondary">Cancel</Button>
        </div>
      </form>
    </div>
  );
};