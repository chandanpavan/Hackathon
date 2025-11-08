import * as crypto from 'crypto';

// Simple, user-friendly primitives to provide tamper-evidence and a server signature

export const canonicalize = (value: unknown): string => {
  // Stable JSON stringify (sort object keys)
  const seen = new WeakSet();
  const stringify = (val: any): any => {
    if (val && typeof val === 'object') {
      if (seen.has(val)) return null;
      seen.add(val);
      if (Array.isArray(val)) return val.map(stringify);
      const sorted: Record<string, any> = {};
      Object.keys(val).sort().forEach((k) => {
        sorted[k] = stringify(val[k]);
      });
      return sorted;
    }
    return val;
  };
  return JSON.stringify(stringify(value));
};

export const sha256Hex = (input: string): string => {
  return crypto.createHash('sha256').update(input).digest('hex');
};

// Server-side signature using HMAC. For a multi-party approach, replace with public/private signatures.
export const signServer = (payload: string, secret: string): string => {
  return crypto.createHmac('sha256', secret).update(payload).digest('hex');
};

export const verifyServer = (payload: string, signature: string, secret: string): boolean => {
  const expected = signServer(payload, secret);
  return crypto.timingSafeEqual(Buffer.from(signature, 'hex'), Buffer.from(expected, 'hex'));
};


