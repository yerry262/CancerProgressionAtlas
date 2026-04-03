import { Brain, Database, Shield, GitFork, BookOpen, Activity, Microscope } from 'lucide-react';

const GOALS = [
  {
    icon: Database,
    title: 'Build the World\'s Most Diverse Cancer Imaging Dataset',
    desc: 'Current AI training datasets are often small, institution-specific, and biased toward certain demographics. CancerProgressionAtlas aggregates imaging from patients worldwide, creating a more representative and comprehensive dataset.',
  },
  {
    icon: Brain,
    title: 'Enable Earlier AI-Powered Detection',
    desc: 'Models trained on larger, more diverse datasets can detect subtle imaging patterns that indicate cancer earlier than human readers alone. Earlier detection = better outcomes.',
  },
  {
    icon: Activity,
    title: 'Capture Disease Progression Longitudinally',
    desc: 'By collecting imaging across multiple time points per patient (from diagnosis through treatment), we can train models that understand how cancer evolves — enabling better response prediction and monitoring.',
  },
  {
    icon: Shield,
    title: 'Protect Patient Privacy by Design',
    desc: 'All DICOM metadata is automatically de-identified. Anonymous contributions are supported. No personal information is required. Data governance follows HIPAA de-identification standards.',
  },
];

const RESEARCH_AREAS = [
  'Early-stage tumor detection from CT & MRI',
  'Treatment response prediction from longitudinal imaging',
  'Multi-modal fusion (combining PET, CT, MRI)',
  'Rare cancer imaging benchmarks',
  'Demographic bias reduction in diagnostic AI',
  'Progression modeling across cancer subtypes',
];

export default function About() {
  return (
    <div className="min-h-screen pt-28 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-16 text-center">
          <p className="text-xs uppercase tracking-widest mono mb-3" style={{ color: '#00d4ff' }}>Research Mission</p>
          <h1 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight" style={{ color: '#c8dff0' }}>
            Why CancerProgressionAtlas?
          </h1>
          <p className="text-lg leading-relaxed max-w-2xl mx-auto" style={{ color: '#6a8fa8' }}>
            AI can detect cancer earlier than current clinical practice — but only if it's trained on
            large, diverse, high-quality imaging data. That data doesn't exist yet. We're building it together.
          </p>
        </div>

        {/* The Problem */}
        <div className="mb-16 p-8 rounded-2xl" style={{ background: 'rgba(255, 61, 90, 0.04)', border: '1px solid rgba(255, 61, 90, 0.15)' }}>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-3" style={{ color: '#c8dff0' }}>
            <span className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255, 61, 90, 0.1)', border: '1px solid rgba(255, 61, 90, 0.3)' }}>
              <Microscope className="w-4 h-4" style={{ color: '#ff3d5a' }} />
            </span>
            The Problem
          </h2>
          <div className="space-y-3 text-sm leading-relaxed" style={{ color: '#6a8fa8' }}>
            <p>
              Cancer is diagnosed late in{' '}
              <span style={{ color: '#c8dff0' }}>millions of cases annually</span>. Late-stage diagnosis
              dramatically reduces survival rates across nearly all cancer types.
            </p>
            <p>
              AI models for cancer imaging detection exist, but they're trained on{' '}
              <span style={{ color: '#c8dff0' }}>small, siloed, proprietary datasets</span> from single
              institutions. These models generalize poorly to real-world populations.
            </p>
            <p>
              The solution is a large, diverse, open dataset — contributed by the very people most
              motivated to advance early detection: <span style={{ color: '#c8dff0' }}>patients themselves</span>.
            </p>
          </div>
        </div>

        {/* Goals */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8" style={{ color: '#c8dff0' }}>Our Goals</h2>
          <div className="space-y-4">
            {GOALS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-5 p-6 rounded-2xl glass">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: 'rgba(0, 212, 255, 0.08)', border: '1px solid rgba(0, 212, 255, 0.2)' }}>
                  <Icon className="w-5 h-5" style={{ color: '#00d4ff' }} />
                </div>
                <div>
                  <h3 className="font-semibold mb-2" style={{ color: '#c8dff0' }}>{title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#6a8fa8' }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Research Areas */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6" style={{ color: '#c8dff0' }}>Research Use Cases</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {RESEARCH_AREAS.map((area) => (
              <div key={area} className="flex items-center gap-3 p-4 rounded-xl glass">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#00ffcc' }} />
                <span className="text-sm" style={{ color: '#c8dff0' }}>{area}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Data Governance */}
        <div className="mb-16 p-8 rounded-2xl" style={{ background: 'rgba(0, 212, 255, 0.04)', border: '1px solid rgba(0, 212, 255, 0.15)' }}>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-3" style={{ color: '#c8dff0' }}>
            <Shield className="w-5 h-5" style={{ color: '#00d4ff' }} />
            Data Governance & Privacy
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm" style={{ color: '#6a8fa8' }}>
            <div className="space-y-2">
              <p className="font-semibold" style={{ color: '#c8dff0' }}>De-identification</p>
              <p>DICOM files are processed to remove all 18 HIPAA identifiers including patient name, date of birth, MRN, and institution.</p>
            </div>
            <div className="space-y-2">
              <p className="font-semibold" style={{ color: '#c8dff0' }}>Consent</p>
              <p>Every submission requires explicit patient consent. Contributions can be made anonymously without creating an account.</p>
            </div>
            <div className="space-y-2">
              <p className="font-semibold" style={{ color: '#c8dff0' }}>License</p>
              <p>Dataset released under Creative Commons CC BY 4.0. Free for academic and commercial research with attribution.</p>
            </div>
            <div className="space-y-2">
              <p className="font-semibold" style={{ color: '#c8dff0' }}>Withdrawal</p>
              <p>Patients can request removal of their contributions at any time. Deletion requests are processed within 30 days.</p>
            </div>
          </div>
        </div>

        {/* Open Source CTA */}
        <div className="text-center p-10 rounded-2xl glass">
          <GitFork className="w-10 h-10 mx-auto mb-4" style={{ color: '#6a8fa8' }} />
          <h3 className="text-xl font-bold mb-3" style={{ color: '#c8dff0' }}>Open Source</h3>
          <p className="text-sm mb-6 max-w-md mx-auto leading-relaxed" style={{ color: '#6a8fa8' }}>
            CancerProgressionAtlas is fully open source. The platform code, data schema, and tooling
            are available on GitHub. Contributions welcome.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="https://github.com/yerry262/cancerprogressionatlas"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all"
              style={{ border: '1px solid rgba(26, 58, 92, 0.6)', color: '#c8dff0', background: 'rgba(13, 26, 46, 0.5)' }}
            >
              <GitFork className="w-4 h-4" />
              View on GitHub
            </a>
            <a
              href="/dataset"
              className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold"
              style={{ background: 'linear-gradient(135deg, #0066ff, #00d4ff)', color: '#fff' }}
            >
              <BookOpen className="w-4 h-4" />
              Explore the Dataset
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
