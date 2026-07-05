# User Upload Implementation Plan

## Current Status
✅ **Working:**
- Upload wizard (4-step form)
- File upload & validation
- DICOM parsing (client-side)
- Submissions dashboard
- Admin review queue
- Anonymous session tracking

❌ **Critical Missing:**
1. Email Verification (users can't verify accounts)
2. Email Notifications (no status updates to users)
3. Server-side DICOM De-identification (PHI risk)
4. File Storage (currently local disk - lost on redeploy)
5. Submission tracking by logged-in users

---

## Implementation Priority

### Phase 1: Email Infrastructure (CRITICAL)
- [ ] Setup Resend/Postmark integration
- [ ] Email verification on registration
- [ ] Submission status notifications
- [ ] Link submissions to user accounts

### Phase 2: Data Security (CRITICAL)
- [ ] DICOM de-identification server-side
- [ ] File storage migration (S3/R2)
- [ ] Presigned URLs for downloads

### Phase 3: UX Enhancements
- [ ] Longitudinal upload (case linking)
- [ ] DICOM viewer in browser
- [ ] Better submission tracking

---

## Detailed Tasks

### 1. Email Verification & User Auth Enhancement
- Add `email_verified` to users table ✅ (already in schema)
- Create `POST /api/auth/verify-email` endpoint
- Generate time-limited JWT tokens for email verification
- Send verification email on registration
- Redirect after email click to verify account

### 2. Email Notifications
- Create email templates (Resend/Postmark)
- Send on status change: pending → approved/rejected
- Send weekly digest to admins with queue stats
- Send subscriber digest: new scans in interested cancer types

### 3. Link Submissions to User Accounts
- Add `user_id` column to submissions table
- Update submission creation to use user_id (not just session_token)
- Allow users to see only their submissions
- Allow users to withdraw pending submissions

### 4. DICOM De-identification
- Add Python `pydicom` service (separate from Node backend)
- Strip 18 HIPAA Safe Harbor identifiers
- Store `deidentified_at` timestamp
- Flag files that fail de-identification

### 5. File Storage (S3/R2)
- Integrate `multer-s3` or `multer-d1` for Cloudflare R2
- Stream files directly to storage on upload
- Generate presigned GET URLs (time-limited)
- Update `submission_files` to use S3 paths

---

## Database Changes
```sql
-- Link submissions to verified user accounts
ALTER TABLE submissions ADD COLUMN user_id UUID REFERENCES users(id) ON DELETE SET NULL;

-- Email verification token
CREATE TABLE IF NOT EXISTS email_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

## Environment Variables Needed
```
RESEND_API_KEY=xxx           # Email service
CLOUDFLARE_R2_BUCKET=xxx     # File storage
CLOUDFLARE_R2_KEY=xxx
CLOUDFLARE_R2_SECRET=xxx
JWT_SECRET=xxx               # For email verification tokens
```

---

## Testing Checklist
- [ ] Register → Receive verification email
- [ ] Click email link → Account verified
- [ ] Upload submission → Appears in "My Submissions"
- [ ] Admin approves → User receives email
- [ ] File upload → Goes to S3/R2 (not local disk)
- [ ] Download file → Uses presigned URL
