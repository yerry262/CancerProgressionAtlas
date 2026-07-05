import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      user?: {
        id: string;
        email?: string;
      };
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET ?? 'change-me-in-production';

/**
 * Optional JWT authentication middleware
 * Extracts user ID from Bearer token if present, but does not require it
 * Call next() regardless so endpoints can work with or without auth
 */
export const optionalAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return next();
  }

  try {
    const token = authHeader.slice(7);
    const payload = jwt.verify(token, JWT_SECRET) as { sub: string; email?: string };
    req.userId = payload.sub;
    req.user = { id: payload.sub, email: payload.email };
  } catch (err) {
    // Token is invalid or expired, but we don't fail - just log and continue
    console.warn('Invalid token in optionalAuth:', (err as Error).message);
  }

  next();
};

/**
 * Required JWT authentication middleware
 * Returns 401 if user is not authenticated
 */
export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required.' });
  }

  try {
    const token = authHeader.slice(7);
    const payload = jwt.verify(token, JWT_SECRET) as { sub: string; email?: string };
    req.userId = payload.sub;
    req.user = { id: payload.sub, email: payload.email };
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ error: 'Token expired.' });
    }
    return res.status(401).json({ error: 'Invalid token.' });
  }
};
