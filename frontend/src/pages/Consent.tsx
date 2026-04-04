import { CheckCircle, XCircle, Clock, Info, Heart, Shield } from 'lucide-react';

export default function Consent() {
  return (
    <div className="min-h-screen pt-28 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <p className="text-xs uppercase tracking-widest mono mb-2" style={{ color: '#00d4ff' }}>Legal</p>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: '#c8dff0' }}>Data Consent Information</h1>
          <div className="flex items-center gap-4 text-sm" style={{ color: '#6a8fa8' }}>
            <span>Consent Version 1.0 · April 2025</span>
          </div>
          <div className="mt-4 p-4 rounded-xl" style={{ background: 'rgba(0, 212, 255, 0.06)', border: '1px solid rgba(0, 212, 255, 0.2)' }}>
            <p className="text-sm leading-relaxed" style={{ color: '#6a8fa8' }}>
              <span style={{ color: '#c8dff0' }}>Your consent matters.</span> This page explains exactly what you
              are agreeing to when you contribute imaging data, what we do with it, and what rights you keep.
              Please read it before uploading.
            </p>
          </div>
        </div>

        {/* What you consent to */}
        <div className="p-7 rounded-2xl glass mb-8">
          <h2 className="text-lg font-bold mb-5 flex items-center gap-3" style={{ color: '#c8dff0' }}>
            <span className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(0, 212, 255, 0.08)', border: '1px solid rgba(0, 212, 255, 0.2)' }}>
              <CheckCircle className="w-4 h-4" style={{ color: '#00d4ff' }} />
            </span>
            What You Are Consenting To
          </h2>
          <div className="space-y-4">
            {[
              {
                title: 'De-identification & Storage',
                body: 'Your imaging files will be processed to remove all 18 HIPAA Safe Harbor identifiers (patient name, DOB, MRN, etc.) before being stored. Only de-identified pixel data and the metadata you explicitly provide will be retained.',
              },
              {
                title: 'Public Open Dataset Release',
                body: 'De-identified imaging and metadata will be added to the CancerProgressionAtlas public dataset after a quality review. This dataset is freely available worldwide under the Creative Commons CC BY 4.0 license.',
              },
              {
                title: 'AI Model Training',
                body: 'Researchers and developers may use the dataset to train machine learning models for cancer detection, staging, and progression analysis. These models may be commercial or open-source. You will not receive financial compensation for this use.',
              },
              {
                title: 'Academic Research',
                body: 'The dataset may be used in peer-reviewed publications, conference papers, and clinical research studies. Your data will never be attributed to you personally.',
              },
              {
                title: 'Data Sharing with Collaborators',
                body: 'We may share the dataset with academic medical centers, research hospitals, and non-profit AI research organizations under the same CC BY 4.0 terms. We do not sell data to commercial entities.',
              },
            ].map(({ title, body }) => (
              <div key={title} className="flex gap-4">
                <div className="w-2 h-2 rounded-full flex-shrink-0 mt-2" style={{ background: '#00d4ff' }} />
                <div>
                  <p className="text-sm font-semibold mb-1" style={{ color: '#c8dff0' }}>{title}</p>
                  <p className="text-sm leading-relaxed" style={{ color: '#6a8fa8' }}>{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* What you are NOT consenting to */}
        <div className="p-7 rounded-2xl glass mb-8">
          <h2 className="text-lg font-bold mb-5 flex items-center gap-3" style={{ color: '#c8dff0' }}>
            <span className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(255, 61, 90, 0.08)', border: '1px solid rgba(255, 61, 90, 0.2)' }}>
              <XCircle className="w-4 h-4" style={{ color: '#ff3d5a' }} />
            </span>
            What You Are NOT Consenting To
          </h2>
          <ul className="space-y-3">
            {[
              'Sale of your identifiable data to insurance companies, employers, or data brokers.',
              'Re-identification or any attempt to link de-identified data back to you.',
              'Use of your data to make individual clinical decisions about you or others.',
              'Storage of your original non-de-identified imaging any longer than needed for processing.',
              'Sharing of your email or account information with third parties.',
              'Any use of your imaging data for law enforcement or government surveillance.',
            ].map((item, i) => (
              <li key={i} className="flex gap-3 text-sm leading-relaxed" style={{ color: '#6a8fa8' }}>
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-2" style={{ background: '#ff3d5a', opacity: 0.6 }} />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Your rights */}
        <div className="p-7 rounded-2xl glass mb-8">
          <h2 className="text-lg font-bold mb-5 flex items-center gap-3" style={{ color: '#c8dff0' }}>
            <span className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(0, 212, 255, 0.08)', border: '1px solid rgba(0, 212, 255, 0.2)' }}>
              <Shield className="w-4 h-4" style={{ color: '#00d4ff' }} />
            </span>
            Your Rights as a Contributor
          </h2>
          <ul className="space-y-3">
            {[
              'Withdraw any submission before it is incorporated into the public dataset at any time.',
              'Request deletion of your account and all associated data.',
              'Receive a copy of all data we hold about you.',
              'Know which consent version was in effect when you contributed.',
              'Submit anonymously — no account required.',
              'GDPR rights (if EU/EEA resident): access, rectification, erasure, portability, and right to object.',
            ].map((item, i) => (
              <li key={i} className="flex gap-3 text-sm leading-relaxed" style={{ color: '#6a8fa8' }}>
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-2" style={{ background: '#00d4ff' }} />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Withdrawal timeline */}
        <div className="p-7 rounded-2xl glass mb-8">
          <h2 className="text-lg font-bold mb-5 flex items-center gap-3" style={{ color: '#c8dff0' }}>
            <span className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(0, 212, 255, 0.08)', border: '1px solid rgba(0, 212, 255, 0.2)' }}>
              <Clock className="w-4 h-4" style={{ color: '#00d4ff' }} />
            </span>
            Withdrawal Timeline & Limitations
          </h2>
          <div className="space-y-4 text-sm leading-relaxed" style={{ color: '#6a8fa8' }}>
            <p>
              <span style={{ color: '#c8dff0' }}>Before approval:</span> Your submission can be fully deleted at any time from the My Submissions page. No trace will remain.
            </p>
            <p>
              <span style={{ color: '#c8dff0' }}>After approval:</span> We will remove your data from our systems within 30 days of a withdrawal request. However, once the data has been included in a public dataset release or used to train AI models that have been distributed, it is technically infeasible to remove it from all downstream copies. This is an inherent limitation of open-source dataset distribution.
            </p>
            <p>
              <span style={{ color: '#c8dff0' }}>Anonymous contributions:</span> Use your session token (stored in your browser) to identify and withdraw anonymous submissions. Without a session token, we may be unable to locate your anonymous contributions.
            </p>
          </div>
        </div>

        {/* De-identification details */}
        <div className="p-6 rounded-2xl" style={{ background: 'rgba(0, 212, 255, 0.04)', border: '1px solid rgba(0, 212, 255, 0.15)' }}>
          <h3 className="font-semibold mb-3 flex items-center gap-2" style={{ color: '#c8dff0' }}>
            <Info className="w-4 h-4" style={{ color: '#00d4ff' }} />
            DICOM De-identification Process
          </h3>
          <p className="text-sm leading-relaxed mb-3" style={{ color: '#6a8fa8' }}>
            All DICOM files undergo automated header scrubbing compliant with HIPAA Safe Harbor (45 CFR §164.514(b)).
            The following fields are removed or replaced before any storage or distribution:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              'Patient Name', 'Date of Birth', 'Medical Record Number', 'Accession Number',
              'Institution Name', 'Referring Physician', 'Study Description', 'Device Serial',
              'Station Name', 'Patient ID', 'Study Date (→ Month/Year)', 'Operator Name',
            ].map((field) => (
              <span key={field} className="text-xs px-2 py-1 rounded-lg mono" style={{ background: 'rgba(0, 212, 255, 0.06)', color: '#6a8fa8', border: '1px solid rgba(26, 58, 92, 0.5)' }}>
                {field}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-8 flex items-start gap-3 p-5 rounded-xl" style={{ background: 'rgba(0, 230, 118, 0.06)', border: '1px solid rgba(0, 230, 118, 0.2)' }}>
          <Heart className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#00e676' }} />
          <p className="text-sm leading-relaxed" style={{ color: '#6a8fa8' }}>
            <span style={{ color: '#c8dff0' }}>Thank you for contributing.</span> Every scan you share could
            help an AI model detect cancer earlier in someone who hasn't been diagnosed yet.
            Your contribution is a gift to the global cancer research community.
          </p>
        </div>
      </div>
    </div>
  );
}
