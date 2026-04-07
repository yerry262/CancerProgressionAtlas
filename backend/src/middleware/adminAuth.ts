import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import pool from '../db/pool';

const JWT_SECRET = process.env.JWT_SECRET ?? 'change-me-in-production';

/**
 * The set of admin emails is configured via the ADMIN_EMAILS environment
 * variable (comma-separated). Example:
 *   ADMIN_EMAILS=you@gmail.com,colleague@example.com
 *
 * This keeps admin credentials out of the codebase entirely.
 */
function getAdminEmails(): Set<string> {
  return new Set(
    (process.env.ADMIN_EMAILS ?? '')
      .split(',')
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean)
  );
}

/**
 * Middleware that verifies the JWT and confirms the authenticated user's
 * email is in the ADMIN_EMAILS env list. Always re-fetches the email from
 * the DB so the env list change takes effect on the next request.
 */
export async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Authentication required.' });
    return;
  }

  const adminEmails = getAdminEmails();
  if (adminEmails.size === 0) {
    // Fail closed: if no admin emails are configured, deny all access.
    res.status(403).json({ error: 'Admin access is not configured on this server.' });
    return;
  }

  try {
    const token = authHeader.slice(7);
    const payload = jwt.verify(token, JWT_SECRET) as { sub: string };

    const { rows } = await pool.query(
      'SELECT id, email FROM users WHERE id = $1',
      [payload.sub]
    );

    if (rows.length === 0) {
      res.status(401).json({ error: 'User not found.' });
      return;
    }

    const userEmail = (rows[0].email as string).toLowerCase();
    if (!adminEmails.has(userEmail)) {
      res.status(403).json({ error: 'Admin access required.' });
      return;
    }

    (req as Request & { adminId: string }).adminId = rows[0].id;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token.' });
  }
}
