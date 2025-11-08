import type { ErrorRequestHandler, Request, Response, NextFunction } from 'express';

interface HttpError extends Error {
  status?: number;
  details?: unknown;
}

export const notFound = (req: Request, res: Response) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
};

export const errorHandler: ErrorRequestHandler = (err: HttpError, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status ?? 500;
  const response = {
    message: err.message || 'Internal server error',
    ...(err.details ? { details: err.details } : {}),
  };
  res.status(status).json(response);
};

export default errorHandler;

