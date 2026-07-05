# Cancer Progression Atlas - Developer Guide

## Project Overview
An open-source crowdsourced cancer medical imaging database platform. Patients upload imaging history (CT, MRI, PET, X-rays, DICOM) to build a diverse public dataset for AI-powered early cancer detection. All uploads are anonymized and community-driven.

## Architecture

### Frontend (React + TypeScript + Vite)
- **Pages**: Landing, Upload (4-step wizard), Dataset, Submissions, Admin review queue, About, Privacy, Terms, Consent, License, Login/Register, **Email Verification**
- **Components**: Navbar, Footer, UI kit (Badge, Input, Select, Skeleton, Textarea)
- **Services**: Auth (with email verification), Submissions, API (Axios with JWT interceptors)
- **Context**: AuthContext for JWT + anonymous sessions
- **State Management**: React Query for data fetching
- **Styling**: Tailwind CSS with dark theme

### Backend (Node.js + Express + TypeScript)
- **Database**: PostgreSQL with auto-migrations
- **Storage**: Local disk (default) | S3-compatible (AWS S3 | Cloudflare R2)
- **Auth**: JWT with email verification tokens
- **File Upload**: Multer with 500MB limit, 50 files max
- **Email**: Resend integration for notifications
- **Admin**: Review queue with approve/reject workflow

### Data Flow
```
1. User registers → verification email sent
2. Clicks email link → account verified
3. Login with JWT → access token in localStorage
4. Upload submission → files stored (local/S3), metadata in DB
5. Admin reviews → approve/reject sends notification email
6. Approved submissions → appear in public dataset
```

## Deployment Status (2026-07-05)

### Railway Configuration
- **Frontend**: GitHub Pages (`yerry262.github.io/CancerProgressionAtlas`)
- **Backend**: Railway API (`cancer-progression-atlas` project)
- **Database**: PostgreSQL (provisioned via Railway)
- **Last Deploy**: 2026-07-05 22:12 UTC ✅ **SUCCESS**

### Environment Variables (Railway)
```env
# Database
DATABASE_URL=postgresql://...

# JWT & Email
JWT_SECRET=xxx (set in Railway)
RESEND_API_KEY=xxx (optional, logs if missing)
APP_URL=https://yerry262.github.io/CancerProgressionAtlas
FROM_EMAIL=noreply@cancerprogressionatlas.org

# Admin
ADMIN_EMAILS=user@example.com,admin@example.com

# File Storage (optional)
STORAGE_BACKEND=local (default) | s3 | r2
AWS_ACCESS_KEY_ID=xxx (if s3)
AWS_SECRET_ACCESS_KEY=xxx (if s3)
AWS_REGION=us-east-1 (if s3)
S3_BUCKET=cancer-progression-atlas
R2_ACCESS_KEY_ID=xxx (if r2)
R2_SECRET_ACCESS_KEY=xxx (if r2)
R2_ENDPOINT=https://your-account.r2.cloudflarestorage.com (if r2)
```

## Recent Implementation (July 2026)

### Phase 1: Email & User Accounts ✅ COMPLETE
- ✅ Email verification with Resend integration
- ✅ Frontend `/verify-email` page with token handling
- ✅ Auth service: `sendVerificationEmail()`, `verifyEmail()`
- ✅ Submissions linked to user accounts via `user_id`
- ✅ Email notifications ready (approval/rejection)
- ✅ Both anonymous and authenticated upload paths
- ✅ Users see only their own submissions
- ✅ All builds passing, 0 vulnerabilities

### Phase 2: File Storage Foundation ✅ COMPLETE
- ✅ Storage service abstraction (local/S3/R2 compatible)
- ✅ Presigned URLs for S3/R2 (24hr expiration)
- ✅ Hybrid multer middleware (memory for S3, disk for local)
- ✅ Auto-upload to S3/R2 on submission
- ✅ Configurable via `STORAGE_BACKEND` env var
- ✅ Ready for production: flip env var and go

### DICOM De-identification (Foundation Ready)
- ✅ Service structure in place (`backend/src/services/dicom.ts`)
- ✅ All 18 HIPAA Safe Harbor elements documented
- ✅ Ready for pydicom integration (Python service)
- ⏳ TODO: Wire up Python service for actual de-identification

## Database Schema

```sql
-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  display_name TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  role TEXT ('user', 'admin'),
  created_at TIMESTAMPTZ
);

-- Submissions (linked to users or anonymous sessions)
CREATE TABLE submissions (
  id UUID PRIMARY KEY,
  user_id UUID (nullable for anonymous),
  session_token TEXT (for anonymous tracking),
  cancer_type TEXT NOT NULL,
  cancer_stage TEXT,
  imaging_modality TEXT NOT NULL,
  imaging_date DATE NOT NULL,
  body_region TEXT NOT NULL,
  patient_age SMALLINT,
  patient_sex TEXT,
  country_code CHAR(2),
  notes TEXT,
  status TEXT ('pending', 'approved', 'rejected', 'withdrawn'),
  created_at TIMESTAMPTZ
);

-- Files (with flexible storage backend)
CREATE TABLE submission_files (
  id UUID PRIMARY KEY,
  submission_id UUID REFERENCES submissions(id),
  original_name TEXT NOT NULL,
  stored_name TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  file_size_bytes BIGINT,
  storage_path TEXT NOT NULL,
  storage_backend TEXT ('local', 's3', 'r2'),
  is_dicom BOOLEAN,
  dicom_series_uid TEXT,
  pixel_data_only BOOLEAN (after de-identification)
);
```

## Key Endpoints

### Auth
```
POST   /api/auth/register              - Create account, send verification
POST   /api/auth/login                 - Get JWT token
POST   /api/auth/send-verification-email - Resend verification
POST   /api/auth/verify-email          - Verify with token
GET    /api/auth/me                    - Get current user + isVerified
POST   /api/auth/anonymous-session     - Get session token
```

### Submissions
```
POST   /api/submissions                - Create submission with files
GET    /api/submissions                - List user's submissions (auth) or session (anon)
DELETE /api/submissions/:id            - Withdraw pending/rejected submission
GET    /api/dataset                    - Public approved dataset (paginated, filterable)
```

### Admin
```
GET    /api/admin/stats                - Dataset statistics
GET    /api/admin/submissions          - Pending submissions queue
POST   /api/admin/submissions/:id/approve - Approve + send email
POST   /api/admin/submissions/:id/reject  - Reject with reason + send email
```

## Testing Checklist

- [x] Frontend builds (0 TypeScript errors)
- [x] Backend builds (0 TypeScript errors)
- [x] Register → verification email sent
- [x] Click email link → `/verify-email?token=...` works
- [x] Token verified → isVerified set to true
- [x] Login → JWT token stored
- [x] Upload with auth → submission linked to user_id
- [x] Upload anonymous → submission linked to session_token
- [x] Admin approve → notification email sent
- [x] All npm packages up-to-date (0 vulnerabilities)

## Future Roadmap

### Phase 3: UX Enhancements
- [ ] In-browser DICOM viewer (Cornerstone3D)
- [ ] Longitudinal upload (case linking for time-series)
- [ ] DICOM viewer on dataset detail page

### Phase 4: Research & Analytics
- [ ] Dataset composition dashboard (charts by type, modality, stage)
- [ ] Researcher export (TCIA format, Hugging Face)
- [ ] Baseline AI model training pipeline

### Phase 5: Community
- [ ] Contributor recognition (badges, profiles)
- [ ] Patient community forum (Discourse)
- [ ] Institution verification for hospitals/labs

## Code Style & Conventions

- **Frontend**: React hooks, functional components, React Query for server state
- **Backend**: Express middleware, TypeScript strict mode
- **Database**: PostgreSQL with auto-migrations on startup
- **Error Handling**: JWT validation on protected routes, CORS enabled for GitHub Pages
- **Logging**: Console logs with timestamps for debugging
- **Secrets**: Never commit `.env` files; use Railway secrets manager

## Known Limitations & TODOs

1. YouTube search fallback not implemented (for Phase 3+)
2. DICOM de-identification is a placeholder (needs pydicom integration)
3. Email notifications require RESEND_API_KEY (will silently skip if not set)
4. S3/R2 requires valid credentials to work (defaults to local disk)
5. No rate limiting on public dataset endpoint (TODO: add Redis cache)

## Contacts & References

- **Project**: [GitHub](https://github.com/yerry262/CancerProgressionAtlas)
- **Live**: [GitHub Pages](https://yerry262.github.io/CancerProgressionAtlas)
- **Owner**: yerry262
- **Last Updated**: 2026-07-05
