import { Link } from 'react-router-dom';
import {
  Upload, Database, Brain, Shield, Users, ArrowRight,
  Microscope, Scan, Activity, ChevronRight, Lock, Globe
} from 'lucide-react';

const STATS = [
  { label: 'Imaging Submissions', value: '0', suffix: '', live: true },
  { label: 'Cancer Types Covered', value: '37', suffix: '+' },
  { label: 'Imaging Modalities', value: '18', suffix: '' },
  { label: 'Countries', value: '0', suffix: '', live: true },
];

const HOW_IT_WORKS = [
  {
    step: '01',
    icon: Upload,
    title: 'You Upload',
    desc: 'Share your medical imaging files — CT, MRI, PET, X-ray and more. All uploads are anonymized before entering the database.',
  },
  {
    step: '02',
    icon: Shield,
    title: 'We Anonymize',
    desc: 'Patient identifiers are automatically stripped. You control what metadata is shared. Your privacy is paramount.',
  },
  {
    step: '03',
    icon: Database,
    title: 'Data is Verified',
    desc: 'Each submission is reviewed for data quality. Approved entries join the open dataset with standardized labels.',
  },
  {
    step: '04',
    icon: Brain,
    title: 'AI Learns',
    desc: 'Researchers use the dataset to train models that detect cancer earlier, more accurately, and across more populations.',
  },
];

const FEATURES = [
  {
    icon: Microscope,
    title: 'DICOM & Standard Formats',
    desc: 'Upload native DICOM files, JPEG, PNG, TIFF, NIfTI, or PDF radiology reports.',
  },
  {
    icon: Scan,
    title: 'Rich Metadata',
    desc: 'Tag each image with cancer type, stage, imaging modality, body region, date, and treatment context.',
  },
  {
    icon: Lock,
    title: 'Privacy First',
    desc: 'Anonymous upload option. All DICOM metadata is scrubbed. No account required to contribute.',
  },
  {
    icon: Globe,
    title: 'Open License',
    desc: 'The dataset is released under Creative Commons CC BY 4.0 for free research use worldwide.',
  },
  {
    icon: Activity,
    title: 'Longitudinal Tracking',
    desc: 'Upload imaging from multiple time points to capture cancer progression across treatment.',
  },
  {
    icon: Users,
    title: 'Community Driven',
    desc: "Built by patients, for patients. Every submission helps future patients get diagnosed earlier.",
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        {/* Background grid */}
        <div className="absolute inset-0 grid-bg opacity-60 pointer-events-none" />

        {/* Radial glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, rgba(0, 102, 255, 0.1) 0%, transparent 70%)' }}
        />

        <div className="relative max-w-5xl mx-auto text-center">
          {/* Tag line */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 animate-fadeInUp"
            style={{ background: 'rgba(0, 212, 255, 0.08)', border: '1px solid rgba(0, 212, 255, 0.2)' }}>
            <span className="w-2 h-2 rounded-full animate-pulse-glow" style={{ background: '#00d4ff' }} />
            <span className="text-xs font-semibold tracking-widest uppercase mono" style={{ color: '#00d4ff' }}>
              Open Source · Community Driven · Life Saving
            </span>
          </div>

          {/* Headline */}
          <h1
            className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight mb-6 animate-fadeInUp"
            style={{ animationDelay: '0.1s', color: '#c8dff0', letterSpacing: '-0.03em' }}
          >
            Crowd-sourced cancer{' '}
            <span className="glow-cyan" style={{ color: '#00d4ff' }}>imaging</span>{' '}
            for the{' '}
            <span className="glow-teal" style={{ color: '#00ffcc' }}>AI era</span>
          </h1>

          <p
            className="text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed animate-fadeInUp"
            style={{ animationDelay: '0.2s', color: '#6a8fa8' }}
          >
            Share your cancer imaging history to help build the world's most diverse open dataset.
            Together, we can train AI models to detect cancer <em style={{ color: '#c8dff0' }}>earlier</em> than ever before.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
            <Link
              to="/upload"
              className="flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-base transition-all duration-300 group"
              style={{
                background: 'linear-gradient(135deg, #0066ff, #00d4ff)',
                color: '#fff',
                boxShadow: '0 0 30px rgba(0, 102, 255, 0.4)',
              }}
            >
              <Upload className="w-5 h-5" />
              Contribute Your Imaging
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/dataset"
              className="flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-base transition-all duration-300"
              style={{
                color: '#c8dff0',
                border: '1px solid rgba(26, 58, 92, 0.8)',
                background: 'rgba(13, 26, 46, 0.5)',
              }}
            >
              <Database className="w-5 h-5" style={{ color: '#00d4ff' }} />
              Browse the Dataset
            </Link>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section style={{ background: 'rgba(13, 26, 46, 0.5)', borderTop: '1px solid rgba(26, 58, 92, 0.5)', borderBottom: '1px solid rgba(26, 58, 92, 0.5)' }}>
        <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map(({ label, value, suffix, live }) => (
            <div key={label} className="text-center">
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-4xl font-black mono" style={{ color: '#00d4ff' }}>
                  {value}
                </span>
                <span className="text-xl font-bold" style={{ color: '#00d4ff' }}>{suffix}</span>
                {live && (
                  <span className="text-xs ml-1 px-2 py-0.5 rounded-full" style={{ color: '#00e676', background: 'rgba(0, 230, 118, 0.1)', border: '1px solid rgba(0, 230, 118, 0.2)' }}>
                    LIVE
                  </span>
                )}
              </div>
              <p className="text-xs uppercase tracking-widest mt-1" style={{ color: '#3d5a73' }}>{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs uppercase tracking-widest mb-3 mono" style={{ color: '#00d4ff' }}>Process</p>
            <h2 className="text-3xl sm:text-4xl font-bold" style={{ color: '#c8dff0' }}>How it works</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map(({ step, icon: Icon, title, desc }, i) => (
              <div
                key={step}
                className="relative p-6 rounded-2xl glass transition-all duration-300 hover:border-glow group"
              >
                <div className="text-5xl font-black mono mb-4" style={{ color: 'rgba(0, 212, 255, 0.12)' }}>
                  {step}
                </div>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: 'rgba(0, 212, 255, 0.1)', border: '1px solid rgba(0, 212, 255, 0.2)' }}>
                  <Icon className="w-5 h-5" style={{ color: '#00d4ff' }} />
                </div>
                <h3 className="font-semibold mb-2" style={{ color: '#c8dff0' }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#6a8fa8' }}>{desc}</p>
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                    <ChevronRight className="w-5 h-5" style={{ color: '#1a3a5c' }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section className="py-20 px-6" style={{ background: 'rgba(8, 15, 32, 0.5)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs uppercase tracking-widest mb-3 mono" style={{ color: '#00ffcc' }}>Features</p>
            <h2 className="text-3xl sm:text-4xl font-bold" style={{ color: '#c8dff0' }}>
              Built for medical-grade contributions
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="p-6 rounded-2xl glass transition-all duration-300 group hover:border-glow"
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: 'rgba(0, 255, 204, 0.08)', border: '1px solid rgba(0, 255, 204, 0.2)' }}>
                  <Icon className="w-5 h-5" style={{ color: '#00ffcc' }} />
                </div>
                <h3 className="font-semibold mb-2" style={{ color: '#c8dff0' }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#6a8fa8' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div
            className="p-12 rounded-3xl relative overflow-hidden"
            style={{ background: 'rgba(13, 26, 46, 0.8)', border: '1px solid rgba(0, 212, 255, 0.2)', boxShadow: '0 0 80px rgba(0, 102, 255, 0.08)' }}
          >
            <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ background: 'rgba(0, 212, 255, 0.1)', border: '1px solid rgba(0, 212, 255, 0.3)' }}>
                <Activity className="w-8 h-8 animate-pulse-glow" style={{ color: '#00d4ff' }} />
              </div>
              <h2 className="text-3xl font-bold mb-4" style={{ color: '#c8dff0' }}>
                Your scan could save a life
              </h2>
              <p className="text-base mb-8 leading-relaxed" style={{ color: '#6a8fa8' }}>
                Every image contributed helps build a more diverse, representative dataset.
                AI models trained on more data detect cancer across more people, earlier.
                No medical background required — just your imaging and your consent.
              </p>
              <Link
                to="/upload"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-base transition-all"
                style={{ background: 'linear-gradient(135deg, #0066ff, #00d4ff)', color: '#fff', boxShadow: '0 0 30px rgba(0, 102, 255, 0.35)' }}
              >
                <Upload className="w-5 h-5" />
                Upload Your Imaging Now
                <ArrowRight className="w-4 h-4" />
              </Link>
              <p className="mt-4 text-xs" style={{ color: '#3d5a73' }}>
                Anonymous upload available · No account required · Open source
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
