# CancerProgressionAtlas

An open-source, crowdsourced cancer medical imaging database — built by patients, for the future of AI-powered early detection.

## What is this?

CancerProgressionAtlas lets cancer patients upload their imaging history (CT, MRI, PET, X-ray, DICOM, etc.) with structured metadata to build the world's most diverse, open cancer imaging dataset. This data will train AI models to detect cancer earlier than current clinical practice.

## Project Structure

```
/
├── frontend/          # React + TypeScript + Vite + Tailwind CSS
├── backend/           # Node.js + Express + TypeScript + PostgreSQL
├── railway.toml       # Railway deployment config
└── .gitignore
```

## Frontend Features

- **Landing page** — mission, stats, how-it-works, CTA
- **Upload Wizard** — 4-step guided form with:
  - Cancer type (37+ types, grouped by category)
  - Cancer stage (0–IV + recurrent)
  - Imaging modality (CT, MRI, PET, X-ray, DICOM, dermoscopy, pathology, etc.)
  - Body region (30+ regions)
  - Treatment context (pre/during/post treatment)
  - Date fields, clinical notes
  - Drag-and-drop DICOM/image upload (up to 500 MB/file)
  - Anonymous upload toggle
  - Explicit consent checkbox
- **Dataset Browser** — filter, search, download approved entries
- **My Submissions** — track submission status
- **About/Research** — mission, goals, data governance

## Backend Features

- Express REST API (TypeScript)
- PostgreSQL schema with full submission + file tracking
- DICOM-aware file handling (extensible for de-identification)
- `session_token`-based anonymous submission tracking
- Public dataset view (approved entries only)
- Railway-ready deployment config

## Running Locally

### Frontend

```bash
cd frontend
npm install
npm run dev      # http://localhost:3000
```

### Backend

```bash
cd backend
cp .env.example .env
# Edit .env with your PostgreSQL credentials
npm install
npm run dev      # http://localhost:4000
```

### Database

```bash
# Run schema against your PostgreSQL instance
psql $DATABASE_URL -f backend/src/db/schema.sql
```

## Deploying to Railway

1. Push this repo to GitHub
2. Create a new Railway project from the repo
3. Add a PostgreSQL plugin
4. Set `DATABASE_URL` (Railway injects this automatically)
5. Set `ALLOWED_ORIGINS` to your frontend Railway URL
6. Deploy

## Data License

Submitted imaging data is released under **Creative Commons CC BY 4.0** — free for academic and commercial research with attribution.

Platform code is **MIT licensed**.

## Privacy

- All DICOM metadata (patient name, DOB, MRN, institution) is stripped before storage
- Anonymous submissions require no account
- Patients can request data deletion at any time

## Contributing

PRs welcome. See [Issues](https://github.com/yerry262/cancerprogressionatlas/issues).
