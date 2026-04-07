import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { requireAdmin } from '../middleware/adminAuth';
import pool from '../db/pool';

const router = Router();

// All admin routes require admin role
router.use(requireAdmin);

// ============================================================
// GET /api/admin/stats — queue summary counts
// ============================================================
router.get('/stats', async (_req: Request, res: Response) => {
  try {
    const { rows } = await pool.query(`
      SELECT status, COUNT(*)::int AS count
      FROM submissions
      GROUP BY status
    `);
    const counts = { pending: 0, approved: 0, rejected: 0 };
    for (const row of rows) {
      if (row.status in counts) counts[row.status as keyof typeof counts] = row.count;
    }
    return res.json(counts);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================================
// GET /api/admin/submissions — pending queue (oldest first)
// ============================================================
router.get('/submissions', async (req: Request, res: Response) => {
  const status = (req.query.status as string) ?? 'pending';
  const limit = Math.min(parseInt((req.query.limit as string) ?? '50'), 100);
  const offset = parseInt((req.query.offset as string) ?? '0');

  try {
    const { rows } = await pool.query(
      `SELECT
        s.id, s.cancer_type, s.cancer_stage, s.imaging_modality,
        s.imaging_date, s.body_region, s.treatment_context,
        s.patient_age, s.patient_sex, s.country_code,
        s.is_anonymous, s.notes, s.status, s.rejection_reason,
        s.created_at, s.reviewed_at, s.approved_at,
        COUNT(f.id)::int AS file_count
       FROM submissions s
       LEFT JOIN submission_files f ON f.submission_id = s.id
       WHERE s.status = $1
       GROUP BY s.id
       ORDER BY s.created_at ASC
       LIMIT $2 OFFSET $3`,
      [status, limit, offset]
    );

    const { rows: countRows } = await pool.query(
      'SELECT COUNT(*)::int AS total FROM submissions WHERE status = $1',
      [status]
    );

    return res.json({ submissions: rows, total: countRows[0].total });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================================
// GET /api/admin/submissions/:id — full submission detail
// ============================================================
router.get('/submissions/:id', async (req: Request, res: Response) => {
  try {
    const { rows } = await pool.query(
      `SELECT s.*,
        json_agg(json_build_object(
          'id', f.id,
          'original_name', f.original_name,
          'mime_type', f.mime_type,
          'file_size_bytes', f.file_size_bytes,
          'is_dicom', f.is_dicom,
          'storage_backend', f.storage_backend
        )) FILTER (WHERE f.id IS NOT NULL) AS files
       FROM submissions s
       LEFT JOIN submission_files f ON f.submission_id = s.id
       WHERE s.id = $1
       GROUP BY s.id`,
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Submission not found.' });
    return res.json(rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================================
// POST /api/admin/submissions/:id/approve
// ============================================================
router.post('/submissions/:id/approve', async (req: Request, res: Response) => {
  try {
    const { rowCount } = await pool.query(
      `UPDATE submissions
       SET status = 'approved', approved_at = NOW(), reviewed_at = NOW(), rejection_reason = NULL
       WHERE id = $1 AND status = 'pending'`,
      [req.params.id]
    );
    if (rowCount === 0) {
      return res.status(404).json({ error: 'Submission not found or already reviewed.' });
    }
    return res.json({ success: true, status: 'approved' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================================
// POST /api/admin/submissions/:id/reject
// ============================================================
router.post(
  '/submissions/:id/reject',
  [body('reason').trim().notEmpty().withMessage('Rejection reason is required')],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    try {
      const { rowCount } = await pool.query(
        `UPDATE submissions
         SET status = 'rejected', reviewed_at = NOW(), rejection_reason = $2
         WHERE id = $1 AND status = 'pending'`,
        [req.params.id, req.body.reason]
      );
      if (rowCount === 0) {
        return res.status(404).json({ error: 'Submission not found or already reviewed.' });
      }
      return res.json({ success: true, status: 'rejected' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
);

export default router;
