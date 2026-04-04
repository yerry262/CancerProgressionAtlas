import { Shield, Lock, Eye, Trash2, Mail } from 'lucide-react';

const SECTIONS = [
  {
    icon: Eye,
    title: 'What We Collect',
    content: [
      'Medical imaging files you voluntarily upload (CT, MRI, PET, X-ray, DICOM, etc.)',
      'Metadata you provide: cancer type, cancer stage, imaging modality, body region, imaging date, diagnosis date (month/year only — never the exact day), treatment context, and optional clinical notes.',
      'Optional demographic context: approximate age, biological sex, and country of imaging.',
      'If you create an account: your email address and a hashed (never plain-text) password.',
      'A session token for anonymous contributors so you can track and withdraw your own submissions.',
    ],
  },
  {
    icon: Shield,
    title: 'How We Protect Your Privacy',
    content: [
      'DICOM de-identification: All 18 HIPAA Safe Harbor identifiers are automatically stripped from uploaded DICOM files before storage. This includes patient name, date of birth, MRN, accession number, device serial numbers, institution name, and more.',
      'Date precision reduction: We store and display only the month and year of imaging and diagnosis dates — never the exact date — to prevent re-identification.',
      'No facial reconstructions: For head/neck scans, we prohibit any rendering that could reconstruct facial features.',
      'Anonymous uploads: Contributions can be made without creating an account. No email or personal information is linked.',
      'Encryption in transit: All file uploads use TLS encryption.',
      'Passwords are hashed with bcrypt and never stored in plain text.',
    ],
  },
  {
    icon: Lock,
    title: 'How Your Data Is Used',
    content: [
      'Your imaging and metadata are added to the CancerProgressionAtlas open dataset after manual review and quality verification.',
      'The dataset is released under Creative Commons CC BY 4.0, allowing researchers worldwide to use it freely for AI training, academic research, and clinical studies — with attribution.',
      'We do not sell your data. We do not share it with advertisers. We do not use it for any commercial purpose beyond the open research mission.',
      'Your email address (if provided) is used only to notify you when your submission is reviewed, and for account-related communications. It is never shown publicly.',
    ],
  },
  {
    icon: Trash2,
    title: 'Your Rights & Data Withdrawal',
    content: [
      'You may withdraw any submission at any time by using the "My Submissions" dashboard or by emailing us.',
      'Withdrawal requests are processed within 30 days. Approved entries already incorporated into derived AI models cannot be retroactively removed from those models, but the source data will be deleted from our systems.',
      'You may request deletion of your account and all associated submissions at any time.',
      'You have the right to access a copy of all data we hold about you. Contact us to request this.',
      'If you are in the EU/EEA, you have rights under GDPR including access, rectification, erasure, and portability.',
    ],
  },
  {
    icon: Mail,
    title: 'Contact & Consent Version',
    content: [
      'For privacy requests, data withdrawal, or questions, open a GitHub issue or reach out via the repository.',
      'This privacy policy applies to all submissions made through CancerProgressionAtlas.',
      'We will notify account holders by email if this policy changes materially.',
      'Current consent version: 1.0 (April 2025)',
    ],
  },
];

export default function Privacy() {
  return (
    <div className="min-h-screen pt-28 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <p className="text-xs uppercase tracking-widest mono mb-2" style={{ color: '#00d4ff' }}>Legal</p>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: '#c8dff0' }}>Privacy Policy</h1>
          <div className="flex items-center gap-4 text-sm" style={{ color: '#6a8fa8' }}>
            <span>Effective: April 2025</span>
            <span>·</span>
            <span>Consent Version 1.0</span>
          </div>
          <div className="mt-4 p-4 rounded-xl" style={{ background: 'rgba(0, 230, 118, 0.06)', border: '1px solid rgba(0, 230, 118, 0.2)' }}>
            <p className="text-sm leading-relaxed" style={{ color: '#6a8fa8' }}>
              <span style={{ color: '#c8dff0' }}>Short version:</span> We collect only what you voluntarily share.
              We strip all patient identifiers from DICOM files automatically. We never sell your data.
              You can withdraw your contributions at any time.
            </p>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-8">
          {SECTIONS.map(({ icon: Icon, title, content }) => (
            <div key={title} className="p-7 rounded-2xl glass">
              <h2 className="text-lg font-bold mb-5 flex items-center gap-3" style={{ color: '#c8dff0' }}>
                <span className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(0, 212, 255, 0.08)', border: '1px solid rgba(0, 212, 255, 0.2)' }}>
                  <Icon className="w-4 h-4" style={{ color: '#00d4ff' }} />
                </span>
                {title}
              </h2>
              <ul className="space-y-3">
                {content.map((item, i) => (
                  <li key={i} className="flex gap-3 text-sm leading-relaxed" style={{ color: '#6a8fa8' }}>
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-2" style={{ background: '#1a3a5c' }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* HIPAA note */}
        <div className="mt-8 p-6 rounded-2xl" style={{ background: 'rgba(0, 212, 255, 0.04)', border: '1px solid rgba(0, 212, 255, 0.15)' }}>
          <h3 className="font-semibold mb-3" style={{ color: '#c8dff0' }}>HIPAA De-identification Standards</h3>
          <p className="text-sm leading-relaxed" style={{ color: '#6a8fa8' }}>
            Our DICOM processing pipeline removes all 18 identifiers specified under the HIPAA Safe Harbor method
            (45 CFR §164.514(b)). These include: names, geographic data smaller than a state, dates other than year,
            phone numbers, fax numbers, email addresses, Social Security numbers, Medical Record Numbers,
            health plan beneficiary numbers, account numbers, certificate/license numbers, vehicle identifiers,
            device identifiers, web URLs, IP addresses, biometric identifiers, full-face photographs, and
            any other unique identifying number or code. After de-identification, the data is no longer
            considered Protected Health Information (PHI) under HIPAA.
          </p>
        </div>
      </div>
    </div>
  );
}
