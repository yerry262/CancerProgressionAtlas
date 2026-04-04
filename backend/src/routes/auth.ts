import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import jwt, { type SignOptions } from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import pool from '../db/pool';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET ?? 'change-me-in-production';
const JWT_EXPIRES = (process.env.JWT_EXPIRES ?? '7d') as SignOptions['expiresIn'];
const SALT_ROUNDS = 12;

// ============================================================
// POST /api/auth/register
// ============================================================
router.post(
  '/register',
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('password')
      .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
      .matches(/[A-Z]/).withMessage('Password must contain an uppercase letter')
      .matches(/[0-9]/).withMessage('Password must contain a number'),
    body('displayName').optional().trim().isLength({ max: 64 }),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    const { email, password, displayName } = req.body as {
      email: string; password: string; displayName?: string;
    };

    try {
      const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
      if (existing.rows.length > 0) {
        return res.status(409).json({ error: 'An account with this email already exists.' });
      }

      const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
      const { rows } = await pool.query(
        `INSERT INTO users (email, password_hash, display_name) VALUES ($1, $2, $3) RETURNING id, email, display_name, created_at`,
        [email, passwordHash, displayName ?? null]
      );

      const user = rows[0];
      const token = jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES });

      return res.status(201).json({
        token,
        user: { id: user.id, email: user.email, displayName: user.display_name, createdAt: user.created_at },
      });
    } catch (err) {
      console.error('Register error:', err);
      return res.status(500).json({ error: 'Registration failed. Please try again.' });
    }
  }
);

// ============================================================
// POST /api/auth/login
// ============================================================
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    const { email, password } = req.body as { email: string; password: string };

    try {
      const { rows } = await pool.query(
        'SELECT id, email, password_hash, display_name, created_at FROM users WHERE email = $1',
        [email]
      );

      if (rows.length === 0) {
        return res.status(401).json({ error: 'Invalid email or password.' });
      }

      const user = rows[0];
      const valid = await bcrypt.compare(password, user.password_hash);
      if (!valid) {
        return res.status(401).json({ error: 'Invalid email or password.' });
      }

      const token = jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES });

      return res.json({
        token,
        user: { id: user.id, email: user.email, displayName: user.display_name, createdAt: user.created_at },
      });
    } catch (err) {
      console.error('Login error:', err);
      return res.status(500).json({ error: 'Login failed. Please try again.' });
    }
  }
);

// ============================================================
// GET /api/auth/me — returns current user from JWT
// ============================================================
router.get('/me', async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Not authenticated.' });
  }

  try {
    const token = authHeader.slice(7);
    const payload = jwt.verify(token, JWT_SECRET) as { sub: string };
    const { rows } = await pool.query(
      'SELECT id, email, display_name, created_at FROM users WHERE id = $1',
      [payload.sub]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'User not found.' });
    const u = rows[0];
    return res.json({ id: u.id, email: u.email, displayName: u.display_name, createdAt: u.created_at });
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
});

// ============================================================
// POST /api/auth/anonymous-session
// ============================================================
router.post('/anonymous-session', (_req: Request, res: Response) => {
  const sessionToken = uuidv4();
  return res.json({ sessionToken });
});

export default router;
