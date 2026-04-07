import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';
import pool from '../db/pool';
import { uploadMiddleware } from '../middleware/upload';

/**
 * Normalizes a date value from HTML month inputs (YYYY-MM) to a full ISO date
 * (YYYY-MM-01) that PostgreSQL's DATE type accepts. Full dates are passed through.
 */
function normalizeDate(val: string | undefined | null): string | null {
  if (!val) return null;
  if (/^\d{4}-\d{2}$/.test(val)) return `${val}-01`;
  return val;
}

const router = Router();

// ============================================================
// POST /api/submissions — create a new submission
// ============================================================
router.post(
  '/',
  uploadMiddleware.array('files', 50),
  [
    body('cancerType').notEmpty().withMessage('Cancer type is required'),
    body('imagingModality').notEmpty().withMessage('Imaging modality is required'),
    body('imagingDate').isDate().withMessage('Valid imaging date is required'),
    body('bodyRegion').notEmpty().withMessage('Body region is required'),
    body('consentGiven').equals('true').withMessage('Consent is required'),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      cancerType, cancerStage, diagnosisDate,
      imagingModality, imagingDate, bodyRegion,
      treatmentContext, notes,
      patientAge, patientSex, countryCode,
      isAnonymous, consentGiven,
    } = req.body;

    const sessionToken = req.headers['x-session-token'] as string | undefined ?? uuidv4();

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const { rows } = await client.query(
        `INSERT INTO submissions (
          session_token, cancer_type, cancer_stage, diagnosis_date,
          imaging_modality, imaging_date, body_region, treatment_context,
          notes, patient_age, patient_sex, country_code,
          is_anonymous, consent_given
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
        RETURNING id`,
        [
          sessionToken,
          cancerType,
          cancerStage || null,
          normalizeDate(diagnosisDate),
          imagingModality,
          normalizeDate(imagingDate),
          bodyRegion,
          treatmentContext || null,
          notes || null,
          patientAge ? parseInt(patientAge) : null,
          patientSex || null,
          countryCode || null,
          isAnonymous === 'true' || isAnonymous === true,
          consentGiven === 'true' || consentGiven === true,
        ]
      );

      const submissionId = rows[0].id;
      const files = (req.files ?? []) as Express.Multer.File[];

      for (const file of files) {
        const ext = file.originalname.toLowerCase();
        const isDicom = ext.endsWith('.dcm') || ext.endsWith('.dicom') || file.mimetype === 'application/dicom';
        await client.query(
          `INSERT INTO submission_files (
            submission_id, original_name, stored_name, mime_type,
            file_size_bytes, storage_path, storage_backend, is_dicom
          ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
          [
            submissionId,
            file.originalname,
            file.filename,
            file.mimetype,
            file.size,
            file.path,
            'local',
            isDicom,
          ]
        );
      }

      await client.query('COMMIT');

      return res.status(201).json({
        id: submissionId,
        sessionToken,
        fileCount: files.length,
        message: 'Submission received. Under review.',
      });
    } catch (err) {
      await client.query('ROLLBACK');
      console.error('Submission error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    } finally {
      client.release();
    }
  }
);

// ============================================================
// GET /api/submissions — list submissions for session
// ============================================================
router.get('/', async (req: Request, res: Response) => {
  const sessionToken = req.headers['x-session-token'] as string | undefined;
  if (!sessionToken) {
    return res.json({ submissions: [] });
  }

  try {
    const { rows } = await pool.query(
      `SELECT s.id, s.cancer_type, s.imaging_modality, s.imaging_date,
              s.body_region, s.cancer_stage, s.status, s.created_at,
              COUNT(f.id)::int AS file_count
       FROM submissions s
       LEFT JOIN submission_files f ON f.submission_id = s.id
       WHERE s.session_token = $1
       GROUP BY s.id
       ORDER BY s.created_at DESC`,
      [sessionToken]
    );
    return res.json({ submissions: rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================================
// DELETE /api/submissions/:id — withdraw a pending or rejected submission
// ============================================================
router.delete('/:id', async (req: Request, res: Response) => {
  const sessionToken = req.headers['x-session-token'] as string | undefined;
  if (!sessionToken) {
    return res.status(401).json({ error: 'Session token required to withdraw a submission.' });
  }

  try {
    const { rowCount } = await pool.query(
      `UPDATE submissions
       SET status = 'withdrawn', reviewed_at = NOW()
       WHERE id = $1
         AND session_token = $2
         AND status IN ('pending', 'rejected')`,
      [req.params.id, sessionToken]
    );
    if (rowCount === 0) {
      return res.status(404).json({
        error: 'Submission not found, already approved, or session token does not match.',
      });
    }
    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================================
// GET /api/dataset — public approved dataset
// ============================================================
router.get('/dataset', async (req: Request, res: Response) => {
  const {
    limit = '50',
    offset = '0',
    cancerType,
    modality,
    stage,
    country,
    treatmentContext,
    search,
  } = req.query as Record<string, string>;

  const conditions: string[] = [];
  const params: unknown[] = [];
  let p = 1;

  if (cancerType) { conditions.push(`cancer_type = $${p++}`); params.push(cancerType); }
  if (modality) { conditions.push(`imaging_modality = $${p++}`); params.push(modality); }
  if (stage) { conditions.push(`cancer_stage = $${p++}`); params.push(stage); }
  if (country) { conditions.push(`country_code = $${p++}`); params.push(country); }
  if (treatmentContext) { conditions.push(`treatment_context = $${p++}`); params.push(treatmentContext); }
  if (search) {
    conditions.push(`(cancer_type ILIKE $${p} OR imaging_modality ILIKE $${p} OR body_region ILIKE $${p})`);
    params.push(`%${search}%`);
    p++;
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  try {
    const { rows } = await pool.query(
      `SELECT * FROM dataset ${where}
       ORDER BY approved_at DESC
       LIMIT $${p} OFFSET $${p + 1}`,
      [...params, parseInt(limit), parseInt(offset)]
    );
    const { rows: countRows } = await pool.query(
      `SELECT COUNT(*) FROM dataset ${where}`,
      params
    );
    return res.json({ entries: rows, total: parseInt(countRows[0].count) });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
