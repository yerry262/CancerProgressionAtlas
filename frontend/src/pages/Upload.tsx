import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Upload as UploadIcon, CheckCircle, ChevronRight, ChevronLeft,
  FileImage, X, AlertCircle, Lock, Info
} from 'lucide-react';
import Select from '../components/ui/Select';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import {
  CANCER_TYPES, IMAGING_MODALITIES, CANCER_STAGES,
  BODY_REGIONS, TREATMENT_CONTEXT
} from '../data/medical';
import type { UploadFormData } from '../types';

const STEPS = [
  { id: 1, label: 'Cancer Info', desc: 'Type & diagnosis details' },
  { id: 2, label: 'Imaging', desc: 'Scan details & date' },
  { id: 3, label: 'Upload Files', desc: 'Your imaging files' },
  { id: 4, label: 'Review & Submit', desc: 'Confirm & consent' },
];

const EMPTY_FORM: UploadFormData = {
  cancerType: '',
  cancerStage: '',
  diagnosisDate: '',
  imagingModality: '',
  imagingDate: '',
  bodyRegion: '',
  treatmentContext: '',
  patientAge: undefined,
  patientSex: undefined,
  notes: '',
  isAnonymous: true,
  consentGiven: false,
  files: [],
};

function StepIndicator({ step, current }: { step: typeof STEPS[0]; current: number }) {
  const done = step.id < current;
  const active = step.id === current;
  return (
    <div className={`flex items-center gap-3 flex-1 ${step.id < STEPS.length ? 'relative' : ''}`}>
      <div className="flex flex-col items-center">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 mono"
          style={{
            background: done
              ? 'rgba(0, 230, 118, 0.15)'
              : active
              ? 'rgba(0, 212, 255, 0.15)'
              : 'rgba(26, 58, 92, 0.3)',
            border: done
              ? '2px solid rgba(0, 230, 118, 0.5)'
              : active
              ? '2px solid rgba(0, 212, 255, 0.7)'
              : '2px solid rgba(26, 58, 92, 0.5)',
            color: done ? '#00e676' : active ? '#00d4ff' : '#3d5a73',
            boxShadow: active ? '0 0 15px rgba(0, 212, 255, 0.25)' : 'none',
          }}
        >
          {done ? <CheckCircle className="w-4 h-4" /> : step.id}
        </div>
        <div className="mt-2 text-center hidden sm:block">
          <div className="text-xs font-semibold" style={{ color: active ? '#c8dff0' : '#3d5a73' }}>
            {step.label}
          </div>
          <div className="text-xs" style={{ color: '#3d5a73' }}>{step.desc}</div>
        </div>
      </div>
      {step.id < STEPS.length && (
        <div
          className="flex-1 h-px mx-2 hidden sm:block"
          style={{ background: done ? 'rgba(0, 230, 118, 0.3)' : 'rgba(26, 58, 92, 0.5)' }}
        />
      )}
    </div>
  );
}

function FileDropZone({
  files,
  onAdd,
  onRemove,
}: {
  files: File[];
  onAdd: (f: File[]) => void;
  onRemove: (i: number) => void;
}) {
  const onDrop = useCallback((accepted: File[]) => onAdd(accepted), [onAdd]);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/dicom': ['.dcm', '.dicom'],
      'image/*': ['.jpg', '.jpeg', '.png', '.tiff', '.tif'],
      'application/pdf': ['.pdf'],
    },
    maxSize: 500 * 1024 * 1024, // 500MB
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className="border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-200"
        style={{
          borderColor: isDragActive ? 'rgba(0, 212, 255, 0.6)' : 'rgba(26, 58, 92, 0.6)',
          background: isDragActive ? 'rgba(0, 212, 255, 0.05)' : 'rgba(13, 26, 46, 0.4)',
          boxShadow: isDragActive ? '0 0 30px rgba(0, 212, 255, 0.1)' : 'none',
        }}
      >
        <input {...getInputProps()} />
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(0, 212, 255, 0.08)', border: '1px solid rgba(0, 212, 255, 0.2)' }}>
          <UploadIcon className="w-8 h-8" style={{ color: isDragActive ? '#00d4ff' : '#3d5a73' }} />
        </div>
        <p className="font-semibold mb-1" style={{ color: isDragActive ? '#00d4ff' : '#c8dff0' }}>
          {isDragActive ? 'Drop files here…' : 'Drag & drop imaging files'}
        </p>
        <p className="text-sm" style={{ color: '#6a8fa8' }}>
          or <span style={{ color: '#00d4ff' }}>browse to upload</span>
        </p>
        <p className="text-xs mt-3 mono" style={{ color: '#3d5a73' }}>
          Accepted: DICOM (.dcm), JPEG, PNG, TIFF, PDF · Max 500 MB per file
        </p>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, i) => (
            <div
              key={`${file.name}-${i}`}
              className="flex items-center gap-3 px-4 py-3 rounded-xl"
              style={{ background: 'rgba(13, 26, 46, 0.6)', border: '1px solid rgba(26, 58, 92, 0.5)' }}
            >
              <FileImage className="w-4 h-4 flex-shrink-0" style={{ color: '#00d4ff' }} />
              <span className="flex-1 text-sm truncate" style={{ color: '#c8dff0' }}>{file.name}</span>
              <span className="text-xs mono" style={{ color: '#3d5a73' }}>
                {(file.size / 1024 / 1024).toFixed(1)} MB
              </span>
              <button
                onClick={() => onRemove(i)}
                className="p-1 rounded-lg hover:bg-red-500/10 transition-colors"
              >
                <X className="w-4 h-4" style={{ color: '#6a8fa8' }} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Upload() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<UploadFormData>(EMPTY_FORM);
  const [submitted, setSubmitted] = useState(false);

  const set = (field: keyof UploadFormData, value: unknown) =>
    setForm((f) => ({ ...f, [field]: value }));

  const canProceed = () => {
    if (step === 1) return !!form.cancerType;
    if (step === 2) return !!form.imagingModality && !!form.imagingDate && !!form.bodyRegion;
    if (step === 3) return form.files.length > 0;
    if (step === 4) return form.consentGiven;
    return false;
  };

  const handleSubmit = async () => {
    // TODO: POST to /api/submissions with FormData
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen pt-28 px-6 flex items-center justify-center">
        <div className="max-w-lg w-full text-center">
          <div
            className="p-12 rounded-3xl"
            style={{ background: 'rgba(13, 26, 46, 0.8)', border: '1px solid rgba(0, 230, 118, 0.3)', boxShadow: '0 0 60px rgba(0, 230, 118, 0.08)' }}
          >
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: 'rgba(0, 230, 118, 0.1)', border: '2px solid rgba(0, 230, 118, 0.4)' }}>
              <CheckCircle className="w-10 h-10" style={{ color: '#00e676' }} />
            </div>
            <h2 className="text-2xl font-bold mb-3" style={{ color: '#c8dff0' }}>Submission Received</h2>
            <p className="text-sm mb-6 leading-relaxed" style={{ color: '#6a8fa8' }}>
              Thank you for contributing to the CancerProgressionAtlas. Your imaging will be reviewed
              and anonymized before being added to the open dataset.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => { setForm(EMPTY_FORM); setStep(1); setSubmitted(false); }}
                className="w-full py-3 rounded-xl font-semibold text-sm transition-all"
                style={{ background: 'linear-gradient(135deg, #0066ff, #00d4ff)', color: '#fff' }}
              >
                Upload Another Scan
              </button>
              <a
                href="/submissions"
                className="block w-full py-3 rounded-xl font-semibold text-sm transition-all"
                style={{ border: '1px solid rgba(26, 58, 92, 0.5)', color: '#c8dff0' }}
              >
                View My Submissions
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-10 text-center">
          <p className="text-xs uppercase tracking-widest mono mb-2" style={{ color: '#00d4ff' }}>Contribute</p>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3" style={{ color: '#c8dff0' }}>
            Upload Medical Imaging
          </h1>
          <p className="text-sm" style={{ color: '#6a8fa8' }}>
            All submissions are anonymized. Your data helps train AI models to detect cancer earlier.
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-start mb-10 px-2">
          {STEPS.map((s) => <StepIndicator key={s.id} step={s} current={step} />)}
        </div>

        {/* Form card */}
        <div
          className="rounded-2xl p-8"
          style={{ background: 'rgba(13, 26, 46, 0.7)', border: '1px solid rgba(26, 58, 92, 0.8)', boxShadow: '0 0 40px rgba(0, 0, 0, 0.3)' }}
        >
          {/* Step 1: Cancer Info */}
          {step === 1 && (
            <div className="space-y-6 animate-fadeInUp">
              <div>
                <h2 className="text-lg font-semibold mb-1" style={{ color: '#c8dff0' }}>Cancer Information</h2>
                <p className="text-sm" style={{ color: '#6a8fa8' }}>Tell us about your cancer diagnosis.</p>
              </div>
              <Select
                label="Cancer Type"
                value={form.cancerType}
                onChange={(v) => set('cancerType', v)}
                options={CANCER_TYPES as unknown as { value: string; label: string; category?: string }[]}
                placeholder="Select cancer type…"
                required
                groupByCategory
              />
              <Select
                label="Cancer Stage at Time of Imaging"
                value={form.cancerStage ?? ''}
                onChange={(v) => set('cancerStage', v)}
                options={CANCER_STAGES as unknown as { value: string; label: string }[]}
                placeholder="Select stage…"
              />
              <Input
                label="Date of Diagnosis"
                type="date"
                value={form.diagnosisDate ?? ''}
                onChange={(e) => set('diagnosisDate', e.target.value)}
                hint="Approximate date is fine. Leave blank if you prefer not to share."
                max={new Date().toISOString().split('T')[0]}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Patient Age at Imaging (optional)"
                  type="number"
                  min={0}
                  max={120}
                  value={form.patientAge ?? ''}
                  onChange={(e) => set('patientAge', e.target.value ? parseInt(e.target.value) : undefined)}
                  hint="Helps train age-aware models"
                />
                <Select
                  label="Biological Sex (optional)"
                  value={form.patientSex ?? ''}
                  onChange={(v) => set('patientSex', v as UploadFormData['patientSex'])}
                  options={[
                    { value: 'male', label: 'Male' },
                    { value: 'female', label: 'Female' },
                    { value: 'other', label: 'Other' },
                    { value: 'prefer_not', label: 'Prefer not to say' },
                  ]}
                  placeholder="Select…"
                />
              </div>
            </div>
          )}

          {/* Step 2: Imaging Details */}
          {step === 2 && (
            <div className="space-y-6 animate-fadeInUp">
              <div>
                <h2 className="text-lg font-semibold mb-1" style={{ color: '#c8dff0' }}>Imaging Details</h2>
                <p className="text-sm" style={{ color: '#6a8fa8' }}>Describe the scan you're uploading.</p>
              </div>
              <Select
                label="Imaging Modality"
                value={form.imagingModality}
                onChange={(v) => set('imagingModality', v)}
                options={IMAGING_MODALITIES as unknown as { value: string; label: string; description?: string }[]}
                placeholder="Select imaging type…"
                required
              />
              <Input
                label="Date of This Imaging"
                type="date"
                value={form.imagingDate}
                onChange={(e) => set('imagingDate', e.target.value)}
                required
                hint="The date shown on the scan report."
                max={new Date().toISOString().split('T')[0]}
              />
              <Select
                label="Body Region Imaged"
                value={form.bodyRegion}
                onChange={(v) => set('bodyRegion', v)}
                options={BODY_REGIONS as unknown as { value: string; label: string }[]}
                placeholder="Select body region…"
                required
              />
              <Select
                label="Treatment Context"
                value={form.treatmentContext ?? ''}
                onChange={(v) => set('treatmentContext', v)}
                options={TREATMENT_CONTEXT as unknown as { value: string; label: string }[]}
                placeholder="When was this scan taken?"
                hint="E.g., pre-treatment baseline, mid-chemo, surveillance follow-up"
              />
              <Textarea
                label="Clinical Notes / Additional Context"
                value={form.notes ?? ''}
                onChange={(e) => set('notes', e.target.value)}
                placeholder="E.g., 'First CT after completing 6 cycles of chemo. Lesion measured 2.1cm at diagnosis.'"
                hint="Optional free text. Do not include any personally identifying information."
                rows={4}
              />
            </div>
          )}

          {/* Step 3: File Upload */}
          {step === 3 && (
            <div className="space-y-6 animate-fadeInUp">
              <div>
                <h2 className="text-lg font-semibold mb-1" style={{ color: '#c8dff0' }}>Upload Imaging Files</h2>
                <p className="text-sm" style={{ color: '#6a8fa8' }}>
                  Upload one or more files for this scan. DICOM files are preferred for full metadata fidelity.
                </p>
              </div>

              {/* Privacy notice */}
              <div className="flex gap-3 p-4 rounded-xl" style={{ background: 'rgba(0, 102, 255, 0.08)', border: '1px solid rgba(0, 102, 255, 0.2)' }}>
                <Lock className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#6699ff' }} />
                <p className="text-xs leading-relaxed" style={{ color: '#6a8fa8' }}>
                  <span style={{ color: '#c8dff0' }}>Privacy protection:</span> DICOM metadata containing
                  patient identifiers (name, DOB, MRN) is automatically stripped before storage.
                  Only the imaging pixel data and the metadata you provided in previous steps is retained.
                </p>
              </div>

              <FileDropZone
                files={form.files}
                onAdd={(added) => set('files', [...form.files, ...added])}
                onRemove={(i) => set('files', form.files.filter((_, idx) => idx !== i))}
              />

              {/* Anonymous toggle */}
              <div
                className="flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all"
                style={{ background: 'rgba(13, 26, 46, 0.5)', border: '1px solid rgba(26, 58, 92, 0.5)' }}
                onClick={() => set('isAnonymous', !form.isAnonymous)}
              >
                <div>
                  <p className="text-sm font-semibold" style={{ color: '#c8dff0' }}>Anonymous Submission</p>
                  <p className="text-xs mt-0.5" style={{ color: '#6a8fa8' }}>
                    Submit without linking to any account. Recommended for privacy.
                  </p>
                </div>
                <div
                  className="w-12 h-6 rounded-full transition-all duration-300 relative flex-shrink-0"
                  style={{
                    background: form.isAnonymous ? 'rgba(0, 212, 255, 0.3)' : 'rgba(26, 58, 92, 0.5)',
                    border: form.isAnonymous ? '1px solid rgba(0, 212, 255, 0.5)' : '1px solid rgba(26, 58, 92, 0.5)',
                  }}
                >
                  <div
                    className="absolute top-0.5 w-5 h-5 rounded-full transition-all duration-300"
                    style={{
                      background: form.isAnonymous ? '#00d4ff' : '#3d5a73',
                      left: form.isAnonymous ? 'calc(100% - 22px)' : '2px',
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Review & Consent */}
          {step === 4 && (
            <div className="space-y-6 animate-fadeInUp">
              <div>
                <h2 className="text-lg font-semibold mb-1" style={{ color: '#c8dff0' }}>Review & Consent</h2>
                <p className="text-sm" style={{ color: '#6a8fa8' }}>Confirm your submission details and provide consent.</p>
              </div>

              {/* Summary */}
              <div className="space-y-3 p-5 rounded-xl" style={{ background: 'rgba(8, 15, 32, 0.6)', border: '1px solid rgba(26, 58, 92, 0.5)' }}>
                <SummaryRow label="Cancer Type" value={CANCER_TYPES.find(c => c.value === form.cancerType)?.label ?? '—'} />
                <SummaryRow label="Stage" value={CANCER_STAGES.find(s => s.value === form.cancerStage)?.label ?? '—'} />
                <SummaryRow label="Diagnosis Date" value={form.diagnosisDate || '—'} />
                <SummaryRow label="Imaging Modality" value={IMAGING_MODALITIES.find(m => m.value === form.imagingModality)?.label ?? '—'} />
                <SummaryRow label="Imaging Date" value={form.imagingDate} />
                <SummaryRow label="Body Region" value={BODY_REGIONS.find(b => b.value === form.bodyRegion)?.label ?? '—'} />
                <SummaryRow label="Files" value={`${form.files.length} file${form.files.length !== 1 ? 's' : ''}`} />
                <SummaryRow label="Anonymous" value={form.isAnonymous ? 'Yes' : 'No'} />
              </div>

              {/* Consent */}
              <div className="space-y-3 p-5 rounded-xl" style={{ background: 'rgba(0, 212, 255, 0.04)', border: '1px solid rgba(0, 212, 255, 0.15)' }}>
                <div className="flex gap-2 mb-3">
                  <Info className="w-4 h-4 flex-shrink-0" style={{ color: '#00d4ff' }} />
                  <p className="text-xs leading-relaxed" style={{ color: '#6a8fa8' }}>
                    By submitting, you confirm:
                  </p>
                </div>
                <ul className="space-y-1.5 text-xs" style={{ color: '#6a8fa8' }}>
                  <li className="flex gap-2"><CheckCircle className="w-3 h-3 flex-shrink-0 mt-0.5" style={{ color: '#00e676' }} /> You are the patient or have legal authority to share this imaging data</li>
                  <li className="flex gap-2"><CheckCircle className="w-3 h-3 flex-shrink-0 mt-0.5" style={{ color: '#00e676' }} /> The data will be anonymized and released under CC BY 4.0 for open research</li>
                  <li className="flex gap-2"><CheckCircle className="w-3 h-3 flex-shrink-0 mt-0.5" style={{ color: '#00e676' }} /> You understand this is not a medical service and your data may train AI models</li>
                  <li className="flex gap-2"><CheckCircle className="w-3 h-3 flex-shrink-0 mt-0.5" style={{ color: '#00e676' }} /> Patient-identifying DICOM metadata will be permanently removed</li>
                </ul>
              </div>

              {/* Consent checkbox */}
              <div
                className="flex items-start gap-3 p-4 rounded-xl cursor-pointer transition-all"
                style={{ background: form.consentGiven ? 'rgba(0, 230, 118, 0.05)' : 'rgba(13, 26, 46, 0.5)', border: form.consentGiven ? '1px solid rgba(0, 230, 118, 0.3)' : '1px solid rgba(26, 58, 92, 0.5)' }}
                onClick={() => set('consentGiven', !form.consentGiven)}
              >
                <div
                  className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5 transition-all"
                  style={{
                    background: form.consentGiven ? 'rgba(0, 230, 118, 0.2)' : 'transparent',
                    border: form.consentGiven ? '2px solid #00e676' : '2px solid rgba(26, 58, 92, 0.8)',
                  }}
                >
                  {form.consentGiven && <CheckCircle className="w-3 h-3" style={{ color: '#00e676' }} />}
                </div>
                <p className="text-sm" style={{ color: '#c8dff0' }}>
                  I agree to the data sharing consent above and want to contribute this imaging to the
                  open CancerProgressionAtlas dataset.
                </p>
              </div>

              {!form.consentGiven && (
                <div className="flex gap-2 p-3 rounded-lg" style={{ background: 'rgba(255, 171, 0, 0.08)', border: '1px solid rgba(255, 171, 0, 0.2)' }}>
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#ffab00' }} />
                  <p className="text-xs" style={{ color: '#ffab00' }}>Please check the consent box above to submit.</p>
                </div>
              )}
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex items-center justify-between mt-8 pt-6" style={{ borderTop: '1px solid rgba(26, 58, 92, 0.4)' }}>
            <button
              onClick={() => setStep((s) => Math.max(1, s - 1))}
              disabled={step === 1}
              className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all"
              style={{
                color: step === 1 ? '#3d5a73' : '#c8dff0',
                border: '1px solid rgba(26, 58, 92, 0.5)',
                background: 'transparent',
                cursor: step === 1 ? 'not-allowed' : 'pointer',
              }}
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>

            <div className="flex items-center gap-2">
              {STEPS.map((s) => (
                <div
                  key={s.id}
                  className="w-2 h-2 rounded-full transition-all"
                  style={{
                    background: s.id === step
                      ? '#00d4ff'
                      : s.id < step
                      ? '#00e676'
                      : 'rgba(26, 58, 92, 0.6)',
                    width: s.id === step ? '20px' : '8px',
                  }}
                />
              ))}
            </div>

            {step < 4 ? (
              <button
                onClick={() => setStep((s) => s + 1)}
                disabled={!canProceed()}
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all"
                style={{
                  background: canProceed() ? 'linear-gradient(135deg, #0066ff, #00d4ff)' : 'rgba(26, 58, 92, 0.3)',
                  color: canProceed() ? '#fff' : '#3d5a73',
                  cursor: canProceed() ? 'pointer' : 'not-allowed',
                  boxShadow: canProceed() ? '0 0 20px rgba(0, 102, 255, 0.3)' : 'none',
                }}
              >
                Continue
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!canProceed()}
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all"
                style={{
                  background: canProceed() ? 'linear-gradient(135deg, #00bb99, #00e676)' : 'rgba(26, 58, 92, 0.3)',
                  color: canProceed() ? '#fff' : '#3d5a73',
                  cursor: canProceed() ? 'pointer' : 'not-allowed',
                  boxShadow: canProceed() ? '0 0 20px rgba(0, 230, 118, 0.3)' : 'none',
                }}
              >
                <UploadIcon className="w-4 h-4" />
                Submit Contribution
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs uppercase tracking-widest" style={{ color: '#3d5a73' }}>{label}</span>
      <span className="text-sm mono" style={{ color: '#c8dff0' }}>{value}</span>
    </div>
  );
}
