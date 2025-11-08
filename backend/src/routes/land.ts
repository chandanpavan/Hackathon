import { Router } from 'express';
import { z } from 'zod';
import { getLandForOwner, getLandVisibleToRole, LandDoc } from '../database/mongoQueries';

const router = Router();

const landQuerySchema = z.object({
  ownerId: z.string().min(3).optional(),
  role: z.union([z.literal('farmer'), z.literal('consumer')]).optional(),
});

router.get('/', async (req, res, next) => {
  try {
    const query = landQuerySchema.parse(req.query);

    if (query.role === 'farmer') {
      if (!query.ownerId) {
        return res.status(400).json({ message: 'ownerId is required for farmer role' });
      }

      const land = await getLandForOwner(query.ownerId);
      return res.json({ land: land.map(formatLandRow) });
    }

    const land = await getLandVisibleToRole(query.role ?? 'consumer', query.ownerId);
    return res.json({ land: land.map(formatLandRow) });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid query parameters', details: error.issues });
    }
    return next(error);
  }
});

const formatLandRow = (row: LandDoc) => ({
  id: (row as any).id || (row as any)._id || row.id,
  name: row.name,
  crop: row.current_crop,
  lastUpdated: row.last_updated ? new Date(row.last_updated).toISOString() : null,
  lastCid: row.last_cid ?? null,
});

export default router;

