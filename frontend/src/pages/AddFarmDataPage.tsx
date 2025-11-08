import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Card from "../components/Card";
import InputField from "../components/InputField";
import Spinner from "../components/Spinner";
import { generateHash } from "../services/blockchainAuth";
import { User } from "../types"; // ✅ Import User type

// ✅ Props interface
interface AddFarmDataPageProps {
  user: User;
}

const API_URL = "http://localhost:5000/api/records";

const AddFarmDataPage: React.FC<AddFarmDataPageProps> = ({ user }) => {
  const [landId, setLandId] = useState("");
  const [cropType, setCropType] = useState("");
  const [soilMoisture, setSoilMoisture] = useState("");
  const [temperature, setTemperature] = useState("");
  const [phLevel, setPhLevel] = useState("");
  const [humidity, setHumidity] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [generatedHash, setGeneratedHash] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      console.log("🟡 Form submitted by:", user?.name);

      // ✅ Prepare data for hashing
      const dataToHash = {
        landId,
        cropType,
        soilMoisture: parseFloat(soilMoisture),
        temperature: parseFloat(temperature),
        phLevel: parseFloat(phLevel),
        humidity: parseFloat(humidity),
        timestamp: new Date().toISOString(),
        producerId: user.id, // ✅ add user ID to backend
      };

      // ✅ Generate hash
      const hash = await generateHash(dataToHash);
      console.log("✅ Generated hash:", hash);
      setGeneratedHash(hash);

      // ✅ Create payload for backend
      const payload = {
        ...dataToHash,
        cid: `bafybei_${hash.substring(2, 10)}_${Date.now()}`,
        hash,
      };

      console.log("📤 Sending payload to backend:", payload);

      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      console.log("📥 Response status:", response.status);

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Backend error: ${text}`);
      }

      const result = await response.json();
      console.log("✅ Record stored successfully:", result);

      setSuccessMessage(`Data successfully secured! Hash: ${hash}`);
      navigator.clipboard.writeText(hash);

      // ✅ Reset form
      setLandId("");
      setCropType("");
      setSoilMoisture("");
      setTemperature("");
      setPhLevel("");
      setHumidity("");
    } catch (err) {
      console.error("❌ Error submitting data:", err);
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Add Farm Data</h1>
          <Button onClick={() => navigate("/farmer")} variant="secondary">
            Back to Dashboard
          </Button>
        </div>

        <Card className="p-6 max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <InputField
              id="landId"
              label="Land ID"
              value={landId}
              onChange={(e) => setLandId(e.target.value)}
              required
            />
            <InputField
              id="cropType"
              label="Crop Type"
              value={cropType}
              onChange={(e) => setCropType(e.target.value)}
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                id="soilMoisture"
                label="Soil Moisture (%)"
                type="number"
                value={soilMoisture}
                onChange={(e) => setSoilMoisture(e.target.value)}
                required
              />
              <InputField
                id="temperature"
                label="Temperature (°C)"
                type="number"
                value={temperature}
                onChange={(e) => setTemperature(e.target.value)}
                required
              />
              <InputField
                id="phLevel"
                label="pH Level"
                type="number"
                step="0.1"
                value={phLevel}
                onChange={(e) => setPhLevel(e.target.value)}
                required
              />
              <InputField
                id="humidity"
                label="Humidity (%)"
                type="number"
                value={humidity}
                onChange={(e) => setHumidity(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              isLoading={loading}
              className="bg-green-600 hover:bg-green-700 w-full"
            >
              Generate Hash & Secure Data
            </Button>
          </form>

          {successMessage && generatedHash && (
            <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="font-medium text-green-800">{successMessage}</p>
              <p className="text-xs mt-2 text-green-600">
                Hash copied to clipboard
              </p>
            </div>
          )}

          {error && (
            <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-200 text-red-800">
              {error}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default AddFarmDataPage;
