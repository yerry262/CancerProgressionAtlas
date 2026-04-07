-- CancerProgressionAtlas Database Schema
-- PostgreSQL 15+

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- USERS
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email           TEXT UNIQUE NOT NULL,
  password_hash   TEXT NOT NULL,
  display_name    TEXT,
  role            TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  is_verified     BOOLEAN NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add role column to existing deployments that pre-date this migration
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'role'
  ) THEN
    ALTER TABLE users ADD COLUMN role TEXT NOT NULL DEFAULT 'user'
      CHECK (role IN ('user', 'admin'));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- ============================================================
-- SUBMISSIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS submissions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_token   TEXT,                          -- for anonymous tracking

  -- Cancer details
  cancer_type     TEXT NOT NULL,
  cancer_stage    TEXT,
  diagnosis_date  DATE,

  -- Patient context (optional, anonymized)
  patient_age     SMALLINT CHECK (patient_age >= 0 AND patient_age <= 120),
  patient_sex     TEXT CHECK (patient_sex IN ('male', 'female', 'other', 'prefer_not')),
  country_code    CHAR(2),

  -- Imaging details
  imaging_modality  TEXT NOT NULL,
  imaging_date      DATE NOT NULL,
  body_region       TEXT NOT NULL,
  treatment_context TEXT,

  -- Free text
  notes TEXT,

  -- Flags
  is_anonymous    BOOLEAN NOT NULL DEFAULT TRUE,
  consent_given   BOOLEAN NOT NULL DEFAULT FALSE,

  -- Status workflow
  status          TEXT NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending', 'approved', 'rejected')),
  rejection_reason TEXT,

  -- Audit
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reviewed_at     TIMESTAMPTZ,
  approved_at     TIMESTAMPTZ
);

-- ============================================================
-- FILES
-- ============================================================
CREATE TABLE IF NOT EXISTS submission_files (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  submission_id   UUID NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,

  original_name   TEXT NOT NULL,
  stored_name     TEXT NOT NULL,          -- UUID-based filename in storage
  mime_type       TEXT NOT NULL,
  file_size_bytes BIGINT NOT NULL,
  storage_path    TEXT NOT NULL,          -- e.g. s3://bucket/path or local path
  storage_backend TEXT NOT NULL DEFAULT 'local',  -- 'local' | 's3' | 'r2'

  -- DICOM-specific (populated after de-identification)
  is_dicom        BOOLEAN DEFAULT FALSE,
  dicom_series_uid TEXT,
  dicom_study_uid  TEXT,
  pixel_data_only  BOOLEAN DEFAULT FALSE, -- true after DICOM scrub

  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- DATASET (approved, public-facing view)
-- ============================================================
CREATE VIEW dataset AS
  SELECT
    s.id,
    s.cancer_type,
    s.cancer_stage,
    s.patient_age,
    s.patient_sex,
    s.country_code,
    s.imaging_modality,
    s.imaging_date,
    s.body_region,
    s.treatment_context,
    s.notes,
    s.approved_at,
    COUNT(f.id) AS file_count
  FROM submissions s
  LEFT JOIN submission_files f ON f.submission_id = s.id
  WHERE s.status = 'approved'
    AND s.consent_given = TRUE
  GROUP BY s.id;

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status);
CREATE INDEX IF NOT EXISTS idx_submissions_cancer_type ON submissions(cancer_type);
CREATE INDEX IF NOT EXISTS idx_submissions_modality ON submissions(imaging_modality);
CREATE INDEX IF NOT EXISTS idx_submissions_created ON submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_files_submission ON submission_files(submission_id);
