import { Router } from 'express';
import { z } from 'zod';
import { findUserByEmail, createUser } from '../database/mongoQueries';
import { verifyPassword, hashPassword } from '../utils/password';

const router = Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, 'Password is required'),
  role: z.union([z.literal('farmer'), z.literal('consumer')]),
});

router.post('/login', async (req, res, next) => {
  try {
    const payload = loginSchema.parse(req.body);

    const user = await findUserByEmail(payload.email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (user.role !== payload.role) {
      return res.status(403).json({ message: 'Role mismatch for this account' });
    }

    const isValidPassword = await verifyPassword(payload.password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    return res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        ethereumAddress: user.ethereum_address,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid request body', details: error.issues });
    }
    return next(error);
  }
});

export default router;

// Signup
router.post('/signup', async (req, res, next) => {
  const schema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    role: z.union([z.literal('farmer'), z.literal('consumer')]),
  });
  try {
    const payload = schema.parse(req.body);
    const existing = await findUserByEmail(payload.email);
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' });
    }
    const passwordHash = await hashPassword(payload.password, 10);
    const id = await createUser({ name: payload.name, email: payload.email, passwordHash, role: payload.role });
    return res.status(201).json({
      user: {
        id,
        name: payload.name,
        email: payload.email,
        role: payload.role,
        ethereumAddress: null,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid request body', details: error.issues });
    }
    return next(error);
  }
});

