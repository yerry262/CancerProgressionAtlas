# Future Additions & Roadmap

This document covers planned features, enhancements, and long-term directions for CancerProgressionAtlas. Items are grouped by category and roughly prioritized. PRs welcome for any of these — see [CONTRIBUTING](README.md#contributing).

---

## Priority 1 — Critical for Launch Readiness

### 🔒 DICOM Server-Side De-identification
**Why:** Client-side DICOM parsing catches most PHI, but the server must be the final guardian.
**What to build:**
- Integrate [Dicoogle](https://www.dicoogle.com/) or the Python `pydicom` library as a processing step after upload
- Strip all 18 HIPAA Safe Harbor identifiers server-side before files are written to permanent storage
- Flag DICOM files that fail de-identification for manual review rather than silently accepting them
- Store a `deidentified_at` timestamp per file

### 📧 Email Verification & Notifications
**Why:** Users need to confirm their email for account security, and receive updates on submission status.
**What to build:**
- `POST /api/auth/verify-email` with a time-limited token
- Submission status emails: "Your scan has been approved and added to the dataset"
- Weekly digest for researchers: "X new scans added this week in [cancer type]"
- Use [Resend](https://resend.com) or [Postmark](https://postmarkapp.com) (both have generous free tiers)
- Store `email_verified` on the users table

### 🛡️ Admin Review Dashboard
**Why:** Every submission must be manually reviewed before entering the public dataset.
**What to build:**
- `/admin` route (JWT role-based: `role = 'admin'` on users table)
- Queue view: pending submissions listed oldest-first
- Per-submission actions: Approve, Reject (with reason), Flag for expert review
- Bulk approve for clearly compliant submissions
- Image preview in the admin panel (thumbnail or Cornerstone3D viewer)
- Audit log: who approved/rejected, when, reason stored in DB

### 📁 S3-Compatible File Storage
**Why:** Local disk storage won't scale and is lost on Railway redeploy.
**What to build:**
- Switch `uploadMiddleware` to stream directly to S3/R2 using `multer-s3`
- Use [Cloudflare R2](https://developers.cloudflare.com/r2/) (S3-compatible, no egress fees) or AWS S3
- Store `s3_key` and `storage_backend` on `submission_files`
- Generate presigned `GET` URLs for downloads (time-limited, audit-logged)
- Thumbnail generation: after upload, create a 256×256 JPEG preview for dataset browser cards

---

## Priority 2 — Core UX & Data Quality

### 🔬 In-Browser DICOM Viewer
**Why:** Researchers browsing the dataset should be able to view DICOM series without downloading.
**What to build:**
- Integrate [Cornerstone3D](https://www.cornerstonejs.org/) (`@cornerstonejs/core` + `@cornerstonejs/tools`)
- Window/level adjustment, zoom, pan, scroll through slices
- Series thumbnail strip for multi-file uploads
- Lazy-load: only initialize Cornerstone on the detail modal, not on the list page
- Fallback to a static JPEG thumbnail for non-DICOM images

### 📊 Longitudinal Upload Linking
**Why:** The most scientifically valuable data is imaging from the same patient at multiple time points (diagnosis → treatment → remission → recurrence).
**What to build:**
- "Add scan to existing case" flow in the Upload Wizard
- `case_id` field on submissions — multiple submissions can share a case
- Timeline view on submission detail page showing all scans for a case in chronological order
- On the dataset browser, show "View full progression series" for cases with multiple time points
- Privacy: case IDs are random UUIDs, never linked to personal identity

### 🌍 Multi-Language Support (i18n)
**Why:** Cancer affects people worldwide. Many patients don't read English fluently.
**What to build:**
- Integrate `react-i18next`
- Start with: Spanish, Portuguese, French, German, Japanese, Hindi, Arabic (cover ~70% of internet users)
- Language switcher in the Navbar
- Translate: all UI labels, dropdown options, consent text, privacy policy
- Use professional medical translators for consent text — Google Translate alone is not acceptable for legal/medical language

### 📱 Mobile App (React Native)
**Why:** Patients often receive imaging on their phone or from a hospital app. Mobile upload is more natural.
**What to build:**
- React Native app sharing business logic with the web frontend
- Access to iOS/Android photo library for selecting DICOM exports
- Camera scan: photograph a physical radiology printout (lower quality but useful for older scans)
- Push notifications for submission status updates
- Offline-first: queue uploads when on cellular, send on WiFi

### 🏷️ Data Quality Scoring
**Why:** AI training is only as good as the data quality. Low-quality or mislabeled submissions hurt the model.
**What to build:**
- Automated quality checks on upload: file size, DICOM validity, image resolution
- Community quality flagging: logged-in users can flag a dataset entry as potentially mislabeled
- "Confidence score" per submission based on metadata completeness (all fields filled = higher score)
- Researchers can filter dataset by minimum quality score
- Quality score displayed on each dataset entry card

---

## Priority 3 — Research & AI Features

### 🤖 Baseline AI Model Training Pipeline
**Why:** The ultimate goal. Once there's enough data, start training and releasing public models.
**What to build:**
- Export pipeline: generate a structured dataset download (manifest JSON + images) in standard formats (TCIA format, MedSAM-compatible)
- Integration with [Hugging Face Hub](https://huggingface.co/datasets) — publish the dataset publicly with a dataset card
- Start with a binary classifier: "Malignant vs. Benign" per cancer type using the labeled data
- Use [MONAI](https://monai.io/) (PyTorch-based medical imaging framework) for training pipelines
- Public model cards with training data provenance, performance metrics, and limitations
- API endpoint: `POST /api/ai/predict` — submit an image, get a research-grade (not diagnostic) prediction with confidence

### 📈 Researcher Dashboard & Dataset Analytics
**Why:** Researchers need to understand what's in the dataset before committing to use it.
**What to build:**
- Interactive charts: submissions over time, by cancer type, by modality, by country, by stage
- Dataset composition heatmap (cancer type × imaging modality matrix)
- Geographic world map showing contributing countries
- Demographic distribution (age, sex, stage breakdown)
- Use [Recharts](https://recharts.org/) or [Nivo](https://nivo.rocks/) for visualization
- Public `/stats` page with all analytics (no auth required)

### 🔗 TCIA & TCGA Integration
**Why:** Link our crowdsourced data with established research datasets.
**What to build:**
- Allow users to cross-reference their submission with an existing TCIA or TCGA accession number
- Import public TCIA collections to seed the dataset with research-grade imaging
- Attribution tracking: which entries came from TCIA vs. patient contributions

### 🧬 Genomic & Pathology Data Linkage
**Why:** Imaging + molecular data (mutations, gene expression) is far more powerful for AI training.
**What to build:**
- Optional field: genetic mutation annotations (e.g., BRCA1, EGFR, KRAS)
- Optional field: pathology report summary (structured, not free text)
- `biomarker_data` JSONB column on submissions for flexible storage
- Integration with [cBioPortal](https://www.cbioportal.org/) API for cross-referencing public genomic data

### 🔍 Semantic Search
**Why:** "Find all Stage III lung adenocarcinoma PET-CT scans from patients aged 45–65 who were scanned post-chemo" should be a one-click operation.
**What to build:**
- Full-text search using PostgreSQL `tsvector` on notes, cancer type, and modality labels
- Advanced filter UI: age range slider, date range picker, multi-select for cancer types
- Saved searches: researchers can bookmark a filter configuration
- Elasticsearch integration for larger-scale search (once dataset exceeds ~100K entries)

---

## Priority 4 — Community & Trust

### 🏥 Institution Verification
**Why:** Some contributions come from hospitals, cancer centers, or research labs — these deserve a "verified institution" badge.
**What to build:**
- Institution signup flow with domain verification (e.g., verify ownership of `mskcc.org`)
- `institution_id` on submissions, shown as a verified badge on dataset entries
- Bulk upload API for institutions contributing large datasets programmatically
- Data use agreements (DUAs) for institutional contributions with specific licensing requirements

### 🤝 Patient Advocacy Organization Partnerships
**Why:** Organizations like the American Cancer Society, Leukaemia UK, or cancer-specific foundations have direct access to patient communities.
**What to build:**
- Referral tracking: submissions can carry a `referral_source` tag (e.g., `breast-cancer-now`)
- Partnership landing pages with custom branding/messaging for each org
- Aggregate stats for partners: "Your community has contributed X scans"
- Dedicated contact flow for organizations wanting to partner

### 🎖️ Contributor Recognition
**Why:** Patients taking the courageous step of sharing their imaging deserve acknowledgement.
**What to build:**
- Optional public contributor profile page (display name + contribution count only — no medical data shown)
- "Contribution badges" (e.g., "Pioneer" for first 100 contributors, "Longitudinal" for 3+ time points)
- Annual impact report: "In 2025, CancerProgressionAtlas contributors helped researchers at X institutions train models that improved detection of Y cancers"
- Opt-in newsletter for contributors to see how their data is being used

### 💬 Patient Community Forum
**Why:** Patients going through cancer often feel isolated. A community space tied to the platform creates belonging.
**What to build:**
- Simple forum with cancer-type channels (e.g., #breast-cancer, #glioblastoma)
- NOT a medical advice forum — clear guidelines: share experiences, not diagnoses
- Share imaging journey stories (optional, with consent)
- Moderation tools and a clear code of conduct
- Consider using [Discourse](https://www.discourse.org/) self-hosted rather than building from scratch

---

## Priority 5 — Long-Term Infrastructure

### ⚡ DICOM Streaming & Series Management
**Why:** A single CT scan can have 500+ DICOM slices. Uploading them individually is painful.
**What to build:**
- ZIP upload: patient zips their DICOM folder, we extract and process server-side
- Multipart upload for large files using S3 presigned multipart URLs
- DICOM series grouping: automatically group `.dcm` files by `SeriesInstanceUID`
- Series thumbnail generation: render a representative slice per series

### 🔐 Federated Learning Support
**Why:** Some hospitals and patients can't upload data to a third-party server due to regulations (especially EU/GDPR, HIPAA covered entities).
**What to build:**
- Federated learning client: hospitals run training locally on their data, share only model weight updates
- Integration with [PySyft](https://github.com/OpenMined/PySyft) or [Flower](https://flower.dev/) federated learning frameworks
- Audit trail: what model versions were trained, on which data partitions, by which institutions
- This significantly expands data access without centralizing sensitive data

### 🌐 FHIR API
**Why:** FHIR (Fast Healthcare Interoperability Resources) is the standard for exchanging healthcare data between systems.
**What to build:**
- FHIR R4 compliant API layer alongside the existing REST API
- Resources: `ImagingStudy`, `DiagnosticReport`, `Patient` (anonymized), `Condition`
- Enables direct integration with EHR systems (Epic, Cerner, etc.)
- Patients could authorize their hospital to send imaging directly to CancerProgressionAtlas via FHIR

### 🗄️ Data Versioning & Provenance
**Why:** AI training requires knowing exactly what data was used for each model version.
**What to build:**
- Dataset snapshots: tag the dataset at a point in time (e.g., `v2025-Q1`)
- Provenance records: which submissions were included in which model training run
- Immutable audit log using PostgreSQL's `GENERATED ALWAYS AS` for derived fields
- Data lineage visualization: show researchers what processing happened to each file

### 🔄 Automated Data Pipeline
**Why:** Manual review doesn't scale past a few thousand submissions per month.
**What to build:**
- ML-assisted pre-screening: flag submissions where declared metadata doesn't match DICOM header (e.g., "declared CT but DICOM says MR")
- Duplicate detection: hash-based deduplication to prevent the same scan being submitted multiple times
- Automated quality scoring: check image resolution, slice count, contrast
- Rule-based auto-approve for high-confidence submissions from verified institutions
- Human-in-the-loop escalation for anything the automated pipeline is uncertain about

---

## Priority 6 — Accessibility & Inclusion

### ♿ Full WCAG 2.1 AA Compliance
**Why:** Cancer disproportionately affects older adults, who are more likely to have visual or motor impairments.
**What to build:**
- Full keyboard navigation for all interactive elements including the upload wizard
- Screen reader compatibility (ARIA labels on all custom components)
- High-contrast mode toggle
- Font size adjustment
- Run `axe-core` in CI to catch accessibility regressions automatically
- Test with real screen readers (NVDA, VoiceOver)

### 🧓 Simplified "Senior Mode" Upload
**Why:** Many cancer patients are elderly and may find the full upload wizard complex.
**What to build:**
- Toggle between "Standard" and "Simplified" wizard
- Simplified mode: larger text, fewer fields (just cancer type, scan type, drag-and-drop)
- Phone-based upload assistant: call a number, answer questions verbally, email a link to upload the file
- Consider partnership with hospital IT departments to offer assisted upload

### 🌐 Low-Bandwidth Mode
**Why:** Cancer is a global disease, but internet infrastructure varies widely.
**What to build:**
- Compress images client-side before upload (JPEG compression with quality selector)
- Progressive upload: submit metadata first, upload files when on a good connection
- Offline-capable PWA: cache the upload wizard, submit when connectivity returns
- SMS-based upload instructions for feature phones

---

## Technical Debt & Code Quality

### Testing
- Unit tests for all service layer functions (`jest` or `vitest`)
- Integration tests for all API endpoints (`supertest`)
- End-to-end tests for the full upload flow (`Playwright`)
- Test coverage reporting in CI

### Performance
- Code splitting: lazy-load heavy pages (Dataset browser, DICOM viewer) with `React.lazy`
- Image optimization: `<picture>` element with WebP format for thumbnails
- CDN for static assets: Cloudflare or similar
- Database query optimization: EXPLAIN ANALYZE on the dataset query with large datasets
- API response caching: Redis for stats endpoint and public dataset queries

### Security Hardening
- Rate limiting on auth endpoints: `express-rate-limit` (max 10 login attempts per IP per 15 min)
- CSRF protection for state-changing endpoints
- Content Security Policy headers via Helmet
- Dependency vulnerability scanning in CI: `npm audit` + `dependabot`
- Penetration testing before public launch (use [OWASP ZAP](https://www.zaproxy.org/))
- Bug bounty program once the platform handles real patient data at scale

### Monitoring & Observability
- Error tracking: [Sentry](https://sentry.io) for both frontend (JS errors) and backend (server errors)
- Uptime monitoring: [Better Uptime](https://betteruptime.com/) or [UptimeRobot](https://uptimerobot.com/)
- Database performance: pg_stat_statements for slow query identification
- Structured logging: replace `console.log` with [Pino](https://getpino.io/) for JSON logs
- Health dashboard: public status page (statuspage.io or built in-house)

---

## Community Governance

### Open Governance Model
As the dataset grows, the project needs a formal governance structure:
- **Technical Steering Committee**: 3–5 members representing developers, researchers, and patient advocates
- **Data Ethics Board**: includes medical ethicists, patient representatives, and privacy lawyers
- **Submission Review Board**: rotating panel of volunteer oncologists and radiologists who review edge cases
- **RFC process**: major changes to data schema, licensing, or privacy policy require a 30-day public comment period

### Dataset Ethics
- Regular bias audits: check whether certain demographics are underrepresented and actively recruit from those communities
- Consent re-review: if the research use expands beyond what was originally consented to, contact contributors
- Fair use policy: prevent any single commercial entity from monopolizing the dataset
- Annual transparency report: published publicly, detailing who accessed the data, for what purpose, and what was found

---

## Ideas from the Community

*This section is for ideas that have been suggested but not yet evaluated. Add yours via [GitHub Issues](https://github.com/yerry262/cancerprogressionatlas/issues) with the label `feature-idea`.*

- [ ] Integration with Apple Health / Google Health for automatic imaging history import
- [ ] QR codes that hospitals can print on radiology reports for easy patient contribution
- [ ] Browser extension that detects radiology report PDFs and offers to contribute them
- [ ] "Challenge dataset" releases with specific AI training tasks and public leaderboards
- [ ] Formal partnerships with TCIA, Cancer Research UK, NIH NCI
- [ ] Patient-authored annotations: patients can mark where they feel the tumor is on their own scans
- [ ] Differential privacy guarantees with mathematical proofs for the dataset release
- [ ] Integration with [OHIF Viewer](https://ohif.org/) for a full-featured web DICOM viewer
- [ ] Blockchain-based consent receipts for immutable proof of patient consent

---

*Last updated: April 2025*
*To suggest additions to this roadmap, open a [GitHub Issue](https://github.com/yerry262/cancerprogressionatlas/issues) or submit a PR editing this file.*
