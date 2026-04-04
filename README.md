# CancerProgressionAtlas

> An open-source, crowdsourced cancer medical imaging database — built by patients, for the future of AI-powered early detection.

[![Deploy Frontend](https://github.com/yerry262/CancerProgressionAtlas/actions/workflows/deploy-frontend.yml/badge.svg)](https://github.com/yerry262/CancerProgressionAtlas/actions/workflows/deploy-frontend.yml)
[![License: MIT](https://img.shields.io/badge/Code-MIT-blue.svg)](LICENSE)
[![Data License: CC BY 4.0](https://img.shields.io/badge/Data-CC%20BY%204.0-green.svg)](https://creativecommons.org/licenses/by/4.0/)

---

## What is this?

**CancerProgressionAtlas** is a free, open-source platform where cancer patients can upload their medical imaging history — CT scans, MRIs, PET scans, X-rays, DICOM files, and more — to build the world's most diverse, publicly available cancer imaging dataset.

The goal is simple: the more diverse and representative the imaging data, the better AI models can become at detecting cancer earlier across all populations, cancer types, and imaging equipment. Every scan contributed brings us closer to earlier detection for someone who hasn't been diagnosed yet.

**No medical background required. No account necessary. All uploads are anonymized.**

---

## The Problem We're Solving

AI models for cancer detection exist — but they're trained on small, institution-specific, proprietary datasets that generalize poorly to real-world patients. A model trained at one hospital may fail on a different scanner, a different demographic, or a different stage of disease.

The solution is a large, diverse, open dataset contributed by the people most motivated to advance early detection: **patients themselves**.

---

## Project Structure

```
CancerProgressionAtlas/
│
├── frontend/                        # React + TypeScript + Vite + Tailwind CSS
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.tsx           # Auth-aware navigation
│   │   │   ├── Footer.tsx
│   │   │   └── ui/                  # Design system components
│   │   │       ├── Badge.tsx
│   │   │       ├── Input.tsx
│   │   │       ├── Select.tsx
│   │   │       ├── Skeleton.tsx     # Loading skeletons
│   │   │       └── Textarea.tsx
│   │   ├── context/
│   │   │   └── AuthContext.tsx      # JWT auth + anonymous session
│   │   ├── data/
│   │   │   ├── countries.ts         # 50+ ISO country codes
│   │   │   └── medical.ts           # Cancer types, modalities, stages, regions
│   │   ├── lib/
│   │   │   ├── dicom.ts             # DICOM header parser (auto-fill + PHI strip)
│   │   │   └── validation.ts        # Zod schemas for auth forms
│   │   ├── pages/
│   │   │   ├── Landing.tsx          # Hero, live stats, how-it-works
│   │   │   ├── Upload.tsx           # 4-step guided upload wizard
│   │   │   ├── Dataset.tsx          # Public dataset browser
│   │   │   ├── Submissions.tsx      # User's submission dashboard
│   │   │   ├── About.tsx            # Research mission & data governance
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   └── Privacy.tsx          # Full privacy policy + HIPAA details
│   │   └── services/
│   │       ├── api.ts               # Axios instance with JWT interceptors
│   │       ├── auth.service.ts
│   │       └── submission.service.ts
│   └── ...
│
├── backend/                         # Node.js + Express + TypeScript
│   ├── src/
│   │   ├── db/
│   │   │   ├── pool.ts              # PostgreSQL connection pool
│   │   │   └── schema.sql           # Full DB schema (users, submissions, files)
│   │   ├── middleware/
│   │   │   └── upload.ts            # Multer file handler (500MB, DICOM-aware)
│   │   └── routes/
│   │       ├── auth.ts              # Register, login, JWT, anonymous session
│   │       └── submissions.ts       # Upload, list, public dataset endpoints
│   └── ...
│
├── .github/
│   └── workflows/
│       └── deploy-frontend.yml      # Auto-deploy to GitHub Pages on push to main
│
├── railway.toml                     # One-click Railway backend deploy config
└── FUTURE_ADDITIONS.md              # Planned features and roadmap
```

---

## Features

### Upload Wizard
- **4-step guided form** with step validation and animated progress
- **37+ cancer types** grouped by category (carcinoma, sarcoma, lymphoma, CNS, melanoma, leukemia, and more)
- **18 imaging modalities** — CT, MRI (DWI/contrast/mpMRI), PET-CT, PET-MRI, X-ray, mammogram, ultrasound, bone scan, dermoscopy, pathology slide, angiography, and more
- **14 cancer stages** including TNM 0–IV, recurrent, and unknown
- **31 body regions** for precise anatomical localization
- **Treatment context** — pre-treatment baseline, during chemo/radiation/immunotherapy, post-treatment, surveillance, recurrence evaluation
- **DICOM auto-fill** — drop a `.dcm` file and the imaging modality, date, and body region are auto-populated from the header
- **File previews** — JPEG/PNG show inline thumbnails; DICOM/PDF show a styled card with file size
- **Upload progress bar** with real-time percentage during actual file transfer
- **Session persistence** — wizard draft saved to `sessionStorage`; "draft restored" banner on return
- **Country selector** — 50+ countries for geographic diversity tracking
- **Month-only date inputs** — stores YYYY-MM only, never the exact day (HIPAA safe harbor)
- **Anonymous toggle** — submit without an account; tracked via a private session token
- **Explicit informed consent** — checkbox with full plain-language summary before submission

### Dataset Browser
- Search, filter by cancer type / imaging modality / stage
- Paginated results (20 per page)
- Loading skeletons while data fetches
- Graceful offline state when backend is unavailable
- CSV export (coming soon)
- CC BY 4.0 open license badge on every entry

### My Submissions Dashboard
- Real-time status: Pending Review / Approved / Rejected
- Auth-aware: sign in to track submissions across devices
- Rejected submissions show a re-submission prompt
- Loading skeletons

### Authentication
- Email/password registration with password strength meter
- JWT-based session (7-day tokens)
- Anonymous contributions with session token (no account needed)
- User menu in navbar with logout
- Account not required for any contribution

### Privacy & Security
- All 18 HIPAA Safe Harbor identifiers stripped from DICOM files before storage
- Only month/year stored for dates (never exact day)
- Helmet.js security headers on all API responses
- Passwords hashed with bcrypt (12 salt rounds)
- CORS restricted to allowed origins

### Infrastructure
- **GitHub Actions** auto-deploys frontend to GitHub Pages on every push to `main`
- **Railway-ready** backend with `railway.toml` config
- Full **Privacy Policy** page with HIPAA de-identification details

---

## Running Locally

### Prerequisites
- Node.js 18+
- PostgreSQL 14+ (or use [Railway](https://railway.app) free tier)

### 1. Clone the repo

```bash
git clone https://github.com/yerry262/CancerProgressionAtlas.git
cd CancerProgressionAtlas
```

### 2. Start the backend

```bash
cd backend
cp .env.example .env
# Fill in DATABASE_URL and JWT_SECRET in .env
npm install
npm run dev        # Starts on http://localhost:4000
```

### 3. Initialize the database

```bash
psql $DATABASE_URL -f backend/src/db/schema.sql
```

### 4. Start the frontend

```bash
cd frontend
npm install
npm run dev        # Starts on http://localhost:3000
```

The frontend dev server proxies `/api` requests to `http://localhost:4000` automatically.

### Environment Variables

**Backend** (`backend/.env`):
```env
PORT=4000
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/cancerprogressionatlas
JWT_SECRET=your-long-random-secret-here
JWT_EXPIRES=7d
ALLOWED_ORIGINS=http://localhost:3000
UPLOAD_DIR=./uploads
```

**Frontend** (`frontend/.env.local`) — only needed in production:
```env
VITE_API_URL=https://your-api.up.railway.app/api
```

---

## Deploying to Production

### Frontend → GitHub Pages (automatic)

1. Go to your repo **Settings → Pages** and set source to **GitHub Actions**
2. Add a repository secret: `Settings → Secrets → Actions → New secret`
   - Name: `VITE_API_URL`
   - Value: your Railway API URL (e.g. `https://cancerprogressionatlas-api.up.railway.app/api`)
3. Push to `main` — the workflow builds and deploys automatically

### Backend → Railway

1. Create a [Railway](https://railway.app) account and new project
2. Connect this GitHub repository
3. Add a **PostgreSQL** database service
4. Set environment variables in Railway dashboard:
   - `JWT_SECRET` — generate with `openssl rand -base64 32`
   - `ALLOWED_ORIGINS` — your GitHub Pages URL (e.g. `https://yerry262.github.io`)
   - `NODE_ENV=production`
5. Railway auto-detects `railway.toml` and deploys
6. Run the schema: open Railway's **PostgreSQL shell** and run `\i schema.sql`

---

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Create account |
| `POST` | `/api/auth/login` | Get JWT token |
| `GET` | `/api/auth/me` | Current user (requires JWT) |
| `POST` | `/api/auth/anonymous-session` | Get anonymous session token |
| `POST` | `/api/submissions` | Upload imaging + metadata (multipart) |
| `GET` | `/api/submissions` | List own submissions (by session token) |
| `GET` | `/api/submissions/dataset` | Public approved dataset (filterable, paginated) |
| `GET` | `/api/health` | Health check |
| `GET` | `/api/stats` | Live dataset statistics |

---

## Data Model

```
submissions
  id, session_token, cancer_type, cancer_stage, diagnosis_date,
  imaging_modality, imaging_date, body_region, treatment_context,
  notes, patient_age, patient_sex, country_code,
  is_anonymous, consent_given, status (pending/approved/rejected),
  created_at, approved_at

submission_files
  id, submission_id, original_name, stored_name, mime_type,
  file_size_bytes, storage_path, is_dicom, dicom_series_uid

users
  id, email, password_hash, display_name, created_at
```

---

## Medical Data Coverage

| Category | Examples |
|----------|---------|
| **Cancer Types** | 37+ types: breast, lung (NSCLC/SCLC), colorectal, prostate, ovarian, GBM, melanoma, AML, CLL, osteosarcoma, mesothelioma, and more |
| **Imaging Modalities** | CT, MRI, MRI-DWI, MRI-contrast, PET-CT, PET-MRI, X-ray, mammogram, ultrasound, bone scan, SPECT, dermoscopy, pathology slide, angiography |
| **Cancer Stages** | Stage 0 through IV (A/B/C substages), recurrent, unknown |
| **Body Regions** | 31 regions from brain to extremities, bilateral options, whole-body |
| **Treatment Contexts** | Pre-treatment baseline, during chemo/radiation/immunotherapy/targeted therapy, post-treatment, surveillance, recurrence workup |
| **File Formats** | DICOM (.dcm), JPEG, PNG, TIFF, PDF, NIfTI |

---

## Contributing

We welcome contributions from developers, researchers, and patient advocates.

**Ways to contribute:**
- Upload your own imaging (the most valuable contribution)
- Report bugs or UX issues via [GitHub Issues](https://github.com/yerry262/cancerprogressionatlas/issues)
- Submit pull requests for features on the [roadmap](FUTURE_ADDITIONS.md)
- Help with translations (international patients)
- Share in cancer patient communities and support groups

**For developers:**
```bash
git checkout -b feature/your-feature
# Make changes
npm run build   # Ensure no TypeScript errors
git push origin feature/your-feature
# Open a pull request
```

---

## Data License

| Asset | License |
|-------|---------|
| Submitted imaging & metadata | [Creative Commons CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) |
| Platform source code | [MIT](LICENSE) |

Contributed data is free for academic and commercial research with attribution. See [Privacy Policy](https://yerry262.github.io/CancerProgressionAtlas/privacy) for patient rights and data withdrawal.

---

## Privacy

- **HIPAA Safe Harbor de-identification**: All 18 patient identifiers stripped from DICOM headers
- **Date precision reduction**: Only month/year stored — never the exact date
- **Anonymous uploads**: No account required, no email stored
- **Data withdrawal**: Patients can request removal at any time
- **No selling, no advertising**: Data is used solely for open medical research

Full policy: [Privacy Policy](https://yerry262.github.io/CancerProgressionAtlas/privacy)

---

## Acknowledgements

Built with love for everyone fighting cancer and everyone who will face it in the future. Special thanks to the patients who trust this platform with their most personal medical data.

> *"The best time to plant a tree was 20 years ago. The second best time is now."*
> Every scan you share today is an early detection for someone tomorrow.
