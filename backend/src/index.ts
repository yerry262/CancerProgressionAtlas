import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import submissionsRouter from './routes/submissions';
import authRouter from './routes/auth';
import { runMigrations } from './db/migrate';
import pool from './db/pool';

const app = express();
const PORT = parseInt(process.env.PORT ?? '4000', 10);

// Security & logging
app.use(helmet());
app.use(morgan('combined'));

// CORS — allow frontend origin
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS ?? 'http://localhost:3000').split(',');
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || ALLOWED_ORIGINS.includes(origin)) {
      cb(null, true);
    } else {
      cb(new Error(`CORS blocked: ${origin}`));
    }
  },
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check — includes DB connectivity
app.get('/api/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', db: 'connected', timestamp: new Date().toISOString() });
  } catch {
    res.status(503).json({ status: 'degraded', db: 'unavailable', timestamp: new Date().toISOString() });
  }
});

// Stats endpoint
app.get('/api/stats', async (_req, res) => {
  try {
    const [subCount, typeCount] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM submissions WHERE status = $1', ['approved']),
      pool.query('SELECT COUNT(DISTINCT cancer_type) FROM submissions WHERE status = $1', ['approved']),
    ]);
    res.json({
      totalSubmissions: parseInt(subCount.rows[0].count),
      cancerTypes: parseInt(typeCount.rows[0].count),
    });
  } catch {
    res.json({ totalSubmissions: 0, cancerTypes: 0 });
  }
});

// Routes
app.use('/api/auth', authRouter);
app.use('/api/submissions', submissionsRouter);

// Global error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.message);
  res.status(500).json({ error: err.message ?? 'Internal server error' });
});

async function start() {
  try {
    await runMigrations();
  } catch (err) {
    console.error('[DB] Migration failed — server will start without schema guarantee:', err);
    // Don't crash: Railway may start the API before the DB is ready on first deploy.
    // The DB pool will retry on the first real request.
  }

  app.listen(PORT, () => {
    console.log(`[CancerProgressionAtlas API] Listening on port ${PORT}`);
    console.log(`  Environment: ${process.env.NODE_ENV ?? 'development'}`);
    console.log(`  DB: ${process.env.DATABASE_URL ? 'configured' : 'not configured (set DATABASE_URL)'}`);
  });
}

start().catch((err) => {
  console.error('Fatal startup error:', err);
  process.exit(1);
});

export default app;
