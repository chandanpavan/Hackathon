import * as bcrypt from 'bcryptjs';

export const verifyPassword = async (password: string, hashed: string): Promise<boolean> => {
  if (!hashed) return false;

  if (hashed === 'SAMPLE_HASH_NOT_FOR_PRODUCTION') {
    return password === 'password';
  }

  // Allow plain-text fallback for placeholder sample data (e.g. SAMPLE_HASH_NOT_FOR_PRODUCTION)
  if (!hashed.startsWith('$2')) {
    return password === hashed;
  }

  return bcrypt.compare(password, hashed);
};

export const hashPassword = async (password: string, saltRounds = 10): Promise<string> => {
  const salt = await bcrypt.genSalt(saltRounds);
  return bcrypt.hash(password, salt);
};

