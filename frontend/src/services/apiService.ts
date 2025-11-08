import { User, UserRole, LandData, TrustRecord } from '../types';
// Import Vite client types for correct typing of import.meta.env
/// <reference types="vite/client" >

// Vite provides types for import.meta.env via the reference directive above

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000/api';

const buildUrl = (path: string, params?: Record<string, string | number | undefined | null>): string => {
  const url = new URL(path, API_BASE_URL.endsWith('/') ? API_BASE_URL : `${API_BASE_URL}/`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.append(key, String(value));
      }
    });
  }
  return url.toString();
};

const handleResponse = async <T>(response: Response): Promise<T> => {
  const contentType = response.headers.get('content-type');
  const isJson = contentType && contentType.includes('application/json');
  const payload = isJson ? await response.json() : null;

  if (!response.ok) {
    const message = payload?.message || response.statusText;
    const error = new Error(message);
    (error as any).details = payload?.details;
    throw error;
  }

  return payload as T;
};

export interface LoginRequest {
  email: string;
  password: string;
  role: UserRole;
}

export interface LoginResponse {
  user: User;
}

export const login = async (payload: LoginRequest): Promise<User> => {
  const response = await fetch(buildUrl('auth/login'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await handleResponse<LoginResponse>(response);
  return data.user;
};

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  mnemonic?: string; // For 12-word authentication
}

export const signup = async (payload: SignupRequest): Promise<User> => {
  const response = await fetch(buildUrl('auth/signup'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  const data = await handleResponse<LoginResponse>(response);
  return data.user;
};

export interface GetLandParams {
  ownerId?: string;
  role?: UserRole;
}

interface LandApiRecord {
  id: string;
  name: string;
  crop: string;
  lastUpdated: string | null;
  lastCid: string | null;
  blockchainAddress?: string;
}

interface LandResponse {
  land: LandApiRecord[];
}

export const getLandData = async (params: GetLandParams = {}): Promise<LandData[]> => {
  // Convert camelCase params to snake_case for the API
  const apiParams: Record<string, string | number> = {};
  if (params.ownerId !== undefined && params.ownerId !== null && params.ownerId !== '') {
    apiParams.owner_id = params.ownerId;
  }
  if (params.role !== undefined && params.role !== null) {
    apiParams.role = params.role;
  }
  
  console.log('getLandData called with params:', params);
  console.log('Converted API params:', apiParams);
  
  const response = await fetch(buildUrl('land', apiParams));
  const data = await handleResponse<LandResponse>(response);
  return data.land.map((item) => ({
    id: item.id,
    name: item.name,
    crop: item.crop,
    lastUpdated: item.lastUpdated,
    lastCid: item.lastCid,
    blockchainAddress: item.blockchainAddress,
  }));
};

// Trust-layer APIs (blockchain-inspired, no wallet required)

export interface CreateRecordRequest {
  landId: string;
  cropType: string;
  soilMoisture: number;
  temperature: number;
  cid: string;
  producerId: string;
  hash?: string; // Cryptographic hash of the data
  signature?: string; // Digital signature
}

export const createRecord = async (payload: CreateRecordRequest): Promise<{ hash: string; signature: string; canonical: string; }> => {
  const res = await fetch(buildUrl('records'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
};

export const listRecords = async (landId?: string): Promise<TrustRecord[]> => {
  const res = await fetch(buildUrl('records', { landId }));
  const data = await handleResponse<{ records: any[] }>(res);
  return data.records.map(r => ({
    id: r.id ?? r.hash,
    cid: r.cid,
    timestamp: r.timestamp,
    producerId: r.producerId,
    status: 'Verified',
    landId: r.landId,
    soilMoisture: Number(r.soilMoisture),
    temperature: Number(r.temperature),
    hash: r.hash,
    signature: r.signature,
  } as TrustRecord));
};

export const verifyRecordByCid = async (cid: string): Promise<{ ok: boolean; record?: TrustRecord; hash?: string; recomputedHash?: string; signature?: string; canonical?: string; }> => {
  const res = await fetch(buildUrl('records/verify', { cid }));
  const data = await handleResponse<any>(res);
  if (!data.ok) return { ok: false };
  return {
    ok: true,
    record: {
      id: data.hash,
      cid,
      timestamp: new Date().toISOString(),
      producerId: 'unknown',
      status: 'Verified',
      landId: 'unknown',
      soilMoisture: NaN,
      temperature: NaN,
      hash: data.hash,
      signature: data.signature,
    }
  };
};

// Blockchain-inspired utilities
export const generateContentId = (data: any): string => {
  // In a real implementation, this would generate a content ID based on the data
  // For now, we'll simulate this with a mock CID
  return `bafybei_${Math.random().toString(36).substring(2, 15)}_${Date.now()}`;
};

export const verifyDataIntegrity = (data: any, hash: string): boolean => {
  // In a real implementation, this would verify the data against the hash
  // For now, we'll simulate this
  return true;
};