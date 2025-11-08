import { ethers } from "ethers";

/**
 * ✅ Generate a 12-word mnemonic phrase
 */
export const generateMnemonic = (): string => {
  const wallet = ethers.Wallet.createRandom();
  return wallet.mnemonic?.phrase || "";
};

/**
 * ✅ Derive a private key from mnemonic
 */
export const derivePrivateKey = (mnemonic: string): string => {
  const wallet = ethers.Wallet.fromPhrase(mnemonic.trim());
  return wallet.privateKey;
};

/**
 * ✅ Generate a public address from mnemonic
 */
export const generateAddress = (mnemonic: string): string => {
  const wallet = ethers.Wallet.fromPhrase(mnemonic.trim());
  return wallet.address;
};

/**
 * ✅ Validate a mnemonic phrase
 */
export const validateMnemonic = (mnemonic: string): boolean => {
  try {
    ethers.Wallet.fromPhrase(mnemonic.trim());
    return true;
  } catch {
    return false;
  }
};

/**
 * ✅ Generate a deterministic hash for any given data
 * Uses ethers.keccak256 → SHA3 / Ethereum hash standard
 */
export const generateHash = (data: any): string => {
  try {
    const canonicalData = JSON.stringify(data, Object.keys(data).sort());
    const bytes = ethers.toUtf8Bytes(canonicalData);
    const hash = ethers.keccak256(bytes);
    return hash;
  } catch (err) {
    console.error("Failed to generate hash:", err);
    return "";
  }
};

/**
 * ✅ Optional: Create wallet signer (for blockchain interaction)
 */
export const getWalletFromPrivateKey = (privateKey: string): ethers.Wallet => {
  return new ethers.Wallet(privateKey);
};
