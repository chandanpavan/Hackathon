export enum UserRole {
  Farmer = 'farmer',
  Consumer = 'consumer',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  ethereumAddress?: string | null;
  token?: string;
  mnemonic?: string; // For 12-word authentication
}

export interface TrustRecord {
  id: string;
  cid: string;
  timestamp: string;
  producerId: string;
  status: 'Verified' | 'Pending';
  landId: string;
  soilMoisture: number;
  temperature: number;
  hash?: string; // Cryptographic hash of the data
  signature?: string; // Digital signature
}

export interface LandData {
  id: string;
  name: string;
  crop: string;
  lastUpdated: string | null;
  lastCid: string | null;
  blockchainAddress?: string; // Address of the land parcel on blockchain
}

// No on-chain state required in the lightweight trust model