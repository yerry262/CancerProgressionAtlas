import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-hot-toast';
import {
  Upload as UploadIcon, CheckCircle, ChevronRight, ChevronLeft,
  X, AlertCircle, Lock, Info, Loader2, Wand2
} from 'lucide-react';
import Select from '../components/ui/Select';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import {
  CANCER_TYPES, IMAGING_MODALITIES, CANCER_STAGES,
  BODY_REGIONS, TREATMENT_CONTEXT
} from '../data/medical';
import { COUNTRIES } from '../data/countries';
import { parseDicomHints } from '../lib/dicom';
import { submissionService } from '../services/submission.service';
import type { UploadFormData } from '../types';

const STEPS = [
  { id: 1, label: 'Cancer Info', desc: 'Type & diagnosis' },
  { id: 2, label: 'Imaging', desc: 'Scan details' },
  { id: 3, label: 'Files', desc: 'Upload scans' },
  { id: 4, label: 'Submit', desc: 'Review & consent' },
];

const DRAFT_KEY = 'cpa_upload_draft';

const EMPTY_FORM: UploadFormData = {
  cancerType: '', cancerStage: '', diagnosisDate: '',
  imagingModality: '', imagingDate: '', bodyRegion: '',
  treatmentContext: '', notes: '',
  patientAge: undefined, patientSex: undefined, countryCode: '',
  isAnonymous: true, consentGiven: false, files: [],
};

function loadDraft(): UploadFormData {
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    if (!raw) return EMPTY_FORM;
    const parsed = JSON.parse(raw);
    return { ...EMPTY_FORM, ...parsed, files: [] };
  } catch { return EMPTY_FORM; }
}

function saveDraft(form: UploadFormData) {
  try {
    const { files: _f, ...rest } = form;
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify(rest));
  } catch { /* ignore */ }
}

function StepDots({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-2">
      {STEPS.map((s) => (
        <div key={s.id} className="rounded-full transition-all duration-300"
          style={{
            height: 8, background: s.id === current ? '#00d4ff' : s.id < current ? '#00e676' : 'rgba(26,58,92,0.6)',
            width: s.id === current ? 24 : 8,
          }} />
      ))}
    </div>
  );
}

function StepHeader({ step, current }: { step: typeof STEPS[0]; current: number }) {
  const done = step.id < current;
  const active = step.id === current;
  return (
    <div className="flex flex-col items-center gap-1 flex-1">
      <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold mono transition-all"
        style={{
          background: done ? 'rgba(0,230,118,0.15)' : active ? 'rgba(0,212,255,0.15)' : 'rgba(26,58,92,0.3)',
          border: done ? '2px solid rgba(0,230,118,0.5)' : active ? '2px solid rgba(0,212,255,0.7)' : '2px solid rgba(26,58,92,0.5)',
          color: done ? '#00e676' : active ? '#00d4ff' : '#3d5a73',
          boxShadow: active ? '0 0 15px rgba(0,212,255,0.25)' : 'none',
        }}>
        {done ? <CheckCircle className="w-4 h-4" /> : step.id}
      </div>
      <div className="hidden sm:block text-center">
        <div className="text-xs font-semibold" style={{ color: active ? '#c8dff0' : '#3d5a73' }}>{step.label}</div>
        <div className="text-xs" style={{ color: '#3d5a73' }}>{step.desc}</div>
      </div>
    </div>
  );
}

function FilePreview({ file, onRemove }: { file: File; onRemove: () => void }) {
  const isImage = file.type.startsWith('image/');
  const isDicom = file.name.toLowerCase().match(/\.(dcm|dicom)$/);
  const url = isImage ? URL.createObjectURL(file) : null;

  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl"
      style={{ background: 'rgba(13,26,46,0.6)', border: '1px solid rgba(26,58,92,0.5)' }}>
      {url ? (
        <img src={url} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
          style={{ border: '1px solid rgba(0,212,255,0.2)' }} onLoad={() => URL.revokeObjectURL(url)} />
      ) : (
        <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold mono"
          style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)', color: '#00d4ff' }}>
          {isDicom ? 'DCM' : 'PDF'}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm truncate" style={{ color: '#c8dff0' }}>{file.name}</p>
        <p className="text-xs mono" style={{ color: '#3d5a73' }}>{(file.size / 1024 / 1024).toFixed(1)} MB</p>
      </div>
      <button onClick={onRemove} className="p-1.5 rounded-lg transition-colors hover:bg-red-500/10 flex-shrink-0">
        <X className="w-4 h-4" style={{ color: '#6a8fa8' }} />
      </button>
    </div>
  );
}

function DropZone({ files, onAdd, onRemove, onDicomHint }: {
  files: File[];
  onAdd: (f: File[]) => void;
  onRemove: (i: number) => void;
  onDicomHint: (modality: string, date: string, region: string) => void;
}) {
  const onDrop = useCallback(async (accepted: File[]) => {
    onAdd(accepted);
    for (const file of accepted) {
      const hints = await parseDicomHints(file);
      if (hints) {
        onDicomHint(hints.modality ?? '', hints.studyDate ?? '', hints.bodyPartExamined ?? '');
        if (hints.modality || hints.studyDate) {
          toast.success('DICOM fields auto-filled from imaging file', { icon: '🔬', duration: 3000 });
        }
      }
    }
  }, [onAdd, onDicomHint]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/dicom': ['.dcm', '.dicom'], 'image/*': ['.jpg', '.jpeg', '.png', '.tiff', '.tif'], 'application/pdf': ['.pdf'] },
    maxSize: 500 * 1024 * 1024,
  });

  return (
    <div className="space-y-3">
      <div {...getRootProps()} className="border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-200"
        style={{
          borderColor: isDragActive ? 'rgba(0,212,255,0.6)' : 'rgba(26,58,92,0.6)',
          background: isDragActive ? 'rgba(0,212,255,0.05)' : 'rgba(13,26,46,0.4)',
          boxShadow: isDragActive ? '0 0 30px rgba(0,212,255,0.1)' : 'none',
        }}>
        <input {...getInputProps()} />
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
          style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)' }}>
          <UploadIcon className="w-7 h-7" style={{ color: isDragActive ? '#00d4ff' : '#3d5a73' }} />
        </div>
        <p className="font-semibold mb-1" style={{ color: isDragActive ? '#00d4ff' : '#c8dff0' }}>
          {isDragActive ? 'Drop files here…' : 'Drag & drop your imaging files'}
        </p>
        <p className="text-sm" style={{ color: '#6a8fa8' }}>
          or <span style={{ color: '#00d4ff' }}>click to browse</span>
        </p>
        <p className="text-xs mt-3 mono" style={{ color: '#3d5a73' }}>
          DICOM (.dcm) · JPEG · PNG · TIFF · PDF &nbsp;·&nbsp; Max 500 MB/file
        </p>
        <div className="flex items-center justify-center gap-2 mt-3">
          <Wand2 className="w-3 h-3" style={{ color: '#00ffcc' }} />
          <span className="text-xs" style={{ color: '#00ffcc' }}>DICOM files auto-fill imaging details</span>
        </div>
      </div>
      {files.map((f, i) => <FilePreview key={`${f.name}-${i}`} file={f} onRemove={() => onRemove(i)} />)}
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1.5" style={{ borderBottom: '1px solid rgba(26,58,92,0.3)' }}>
      <span className="text-xs uppercase tracking-widest" style={{ color: '#3d5a73' }}>{label}</span>
      <span className="text-sm mono text-right" style={{ color: '#c8dff0', maxWidth: '60%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value || '—'}</span>
    </div>
  );
}

export default function Upload() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<UploadFormData>(loadDraft);
  const [submitting, setSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submissionId, setSubmissionId] = useState('');

  const set = useCallback(<K extends keyof UploadFormData>(field: K, value: UploadFormData[K]) => {
    setForm((f) => {
      const next = { ...f, [field]: value };
      saveDraft(next);
      return next;
    });
  }, []);

  const applyDicomHints = useCallback((modality: string, date: string, region: string) => {
    setForm((f) => {
      const next = {
        ...f,
        imagingModality: modality || f.imagingModality,
        imagingDate: date || f.imagingDate,
        bodyRegion: region || f.bodyRegion,
      };
      saveDraft(next);
      return next;
    });
  }, []);

  const canProceed = () => {
    if (step === 1) return !!form.cancerType;
    if (step === 2) return !!form.imagingModality && !!form.imagingDate && !!form.bodyRegion;
    if (step === 3) return form.files.length > 0;
    if (step === 4) return form.consentGiven;
    return false;
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setProgress(0);
    try {
      const result = await submissionService.submit(form, setProgress);
      sessionStorage.removeItem(DRAFT_KEY);
      setSubmissionId(result.id);
      setSubmitted(true);
      toast.success('Submission received! Thank you for contributing.');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error
        ?? 'Upload failed. Please try again.';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const hasDraft = !!(form.cancerType || form.imagingModality);

  if (submitted) {
    return (
      <div className="min-h-screen pt-28 px-6 flex items-center justify-center">
        <div className="max-w-lg w-full text-center">
          <div className="p-12 rounded-3xl"
            style={{ background: 'rgba(13,26,46,0.8)', border: '1px solid rgba(0,230,118,0.3)', boxShadow: '0 0 60px rgba(0,230,118,0.08)' }}>
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ background: 'rgba(0,230,118,0.1)', border: '2px solid rgba(0,230,118,0.4)' }}>
              <CheckCircle className="w-10 h-10" style={{ color: '#00e676' }} />
            </div>
            <h2 className="text-2xl font-bold mb-3" style={{ color: '#c8dff0' }}>Submission Received</h2>
            <p className="text-sm mb-2 mono" style={{ color: '#3d5a73' }}>ID: {submissionId}</p>
            <p className="text-sm mb-8 leading-relaxed" style={{ color: '#6a8fa8' }}>
              Thank you for contributing to the CancerProgressionAtlas. Your imaging will be reviewed
              and anonymized before joining the open dataset. Every scan counts.
            </p>
            <div className="space-y-3">
              <button onClick={() => { setForm(EMPTY_FORM); setStep(1); setSubmitted(false); }}
                className="w-full py-3 rounded-xl font-semibold text-sm"
                style={{ background: 'linear-gradient(135deg, #0066ff, #00d4ff)', color: '#fff' }}>
                Upload Another Scan
              </button>
              <a href="/submissions" className="block w-full py-3 rounded-xl font-semibold text-sm"
                style={{ border: '1px solid rgba(26,58,92,0.5)', color: '#c8dff0' }}>
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
        <div className="mb-10 text-center">
          <p className="text-xs uppercase tracking-widest mono mb-2" style={{ color: '#00d4ff' }}>Contribute</p>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3" style={{ color: '#c8dff0' }}>Upload Medical Imaging</h1>
          <p className="text-sm" style={{ color: '#6a8fa8' }}>
            All submissions are anonymized. Your data helps train AI models to detect cancer earlier.
          </p>
          {hasDraft && step === 1 && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs"
              style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)', color: '#00d4ff' }}>
              <Info className="w-3 h-3" /> Draft restored from your last session
            </div>
          )}
        </div>

        {/* Step indicators */}
        <div className="flex items-start mb-10 px-2">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center flex-1">
              <StepHeader step={s} current={step} />
              {i < STEPS.length - 1 && (
                <div className="flex-1 h-px mx-1 hidden sm:block" style={{ background: s.id < step ? 'rgba(0,230,118,0.3)' : 'rgba(26,58,92,0.5)' }} />
              )}
            </div>
          ))}
        </div>

        <div className="rounded-2xl p-8"
          style={{ background: 'rgba(13,26,46,0.7)', border: '1px solid rgba(26,58,92,0.8)', boxShadow: '0 0 40px rgba(0,0,0,0.3)' }}>

          {/* Step 1 — Cancer Info */}
          {step === 1 && (
            <div className="space-y-6 animate-fadeInUp">
              <div>
                <h2 className="text-lg font-semibold mb-1" style={{ color: '#c8dff0' }}>Cancer Information</h2>
                <p className="text-sm" style={{ color: '#6a8fa8' }}>Tell us about your diagnosis. All fields help make the dataset more useful for researchers.</p>
              </div>
              <Select label="Cancer Type" value={form.cancerType}
                onChange={(v) => set('cancerType', v)}
                options={CANCER_TYPES as unknown as { value: string; label: string; category?: string }[]}
                placeholder="Select cancer type…" required groupByCategory />
              <Select label="Cancer Stage" value={form.cancerStage ?? ''}
                onChange={(v) => set('cancerStage', v)}
                options={CANCER_STAGES as unknown as { value: string; label: string }[]}
                placeholder="Select stage…"
                hint="Select the stage that applied at the time this imaging was taken." />
              <Input label="Month of Diagnosis" type="month"
                value={form.diagnosisDate ?? ''} onChange={(e) => set('diagnosisDate', e.target.value)}
                hint="Month and year only — we never store the exact day."
                max={new Date().toISOString().slice(0, 7)} />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Age at Time of Imaging" type="number" min={0} max={120}
                  value={form.patientAge ?? ''} onChange={(e) => set('patientAge', e.target.value ? parseInt(e.target.value) : undefined)}
                  hint="Optional. Helps train age-aware AI models." />
                <Select label="Biological Sex" value={form.patientSex ?? ''}
                  onChange={(v) => set('patientSex', v as UploadFormData['patientSex'])}
                  options={[
                    { value: 'male', label: 'Male' },
                    { value: 'female', label: 'Female' },
                    { value: 'other', label: 'Other / Intersex' },
                    { value: 'prefer_not', label: 'Prefer not to say' },
                  ]} placeholder="Select…" hint="Optional." />
              </div>
            </div>
          )}

          {/* Step 2 — Imaging Details */}
          {step === 2 && (
            <div className="space-y-6 animate-fadeInUp">
              <div>
                <h2 className="text-lg font-semibold mb-1" style={{ color: '#c8dff0' }}>Imaging Details</h2>
                <p className="text-sm" style={{ color: '#6a8fa8' }}>Describe the scan. If you upload a DICOM file on the next step, some fields will auto-fill.</p>
              </div>
              <Select label="Imaging Modality" value={form.imagingModality}
                onChange={(v) => set('imagingModality', v)}
                options={IMAGING_MODALITIES as unknown as { value: string; label: string }[]}
                placeholder="Select imaging type…" required />
              <Input label="Month of Imaging" type="month"
                value={form.imagingDate} onChange={(e) => set('imagingDate', e.target.value)}
                required hint="Month and year the scan was taken."
                max={new Date().toISOString().slice(0, 7)} />
              <Select label="Body Region Imaged" value={form.bodyRegion}
                onChange={(v) => set('bodyRegion', v)}
                options={BODY_REGIONS as unknown as { value: string; label: string }[]}
                placeholder="Select body region…" required />
              <Select label="Country Where Imaging Was Done" value={form.countryCode ?? ''}
                onChange={(v) => set('countryCode', v)}
                options={COUNTRIES as unknown as { value: string; label: string }[]}
                placeholder="Select country…"
                hint="Helps identify geographic diversity in the dataset." />
              <Select label="Treatment Context" value={form.treatmentContext ?? ''}
                onChange={(v) => set('treatmentContext', v)}
                options={TREATMENT_CONTEXT as unknown as { value: string; label: string }[]}
                placeholder="When was this scan taken relative to treatment?" />
              <Textarea label="Clinical Notes (optional)" value={form.notes ?? ''}
                onChange={(e) => set('notes', e.target.value)}
                placeholder="E.g. 'Post-surgery follow-up. Tumor measured 1.8cm at diagnosis, now 0.4cm.'"
                hint="Do NOT include your name, MRN, doctor's name, hospital name, or any identifying information."
                rows={4} />
            </div>
          )}

          {/* Step 3 — File Upload */}
          {step === 3 && (
            <div className="space-y-6 animate-fadeInUp">
              <div>
                <h2 className="text-lg font-semibold mb-1" style={{ color: '#c8dff0' }}>Upload Imaging Files</h2>
                <p className="text-sm" style={{ color: '#6a8fa8' }}>Upload one or more files for this scan. You can upload a full DICOM series (multiple .dcm files).</p>
              </div>
              <div className="flex gap-3 p-4 rounded-xl"
                style={{ background: 'rgba(0,102,255,0.07)', border: '1px solid rgba(0,102,255,0.18)' }}>
                <Lock className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#6699ff' }} />
                <p className="text-xs leading-relaxed" style={{ color: '#6a8fa8' }}>
                  <span style={{ color: '#c8dff0' }}>Privacy protection:</span> Patient identifiers embedded in DICOM headers
                  (name, DOB, MRN, institution) are automatically stripped before storage. Only pixel data and your chosen metadata are kept.
                </p>
              </div>
              <DropZone files={form.files}
                onAdd={(added) => set('files', [...form.files, ...added])}
                onRemove={(i) => set('files', form.files.filter((_, idx) => idx !== i))}
                onDicomHint={applyDicomHints} />
              {/* Anonymous toggle */}
              <div className="flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all"
                style={{ background: 'rgba(13,26,46,0.5)', border: '1px solid rgba(26,58,92,0.5)' }}
                onClick={() => set('isAnonymous', !form.isAnonymous)}>
                <div>
                  <p className="text-sm font-semibold" style={{ color: '#c8dff0' }}>Submit Anonymously</p>
                  <p className="text-xs mt-0.5" style={{ color: '#6a8fa8' }}>No account linked. A private session token lets you track and withdraw your submission.</p>
                </div>
                <div className="w-12 h-6 rounded-full relative flex-shrink-0 ml-4 transition-all"
                  style={{ background: form.isAnonymous ? 'rgba(0,212,255,0.3)' : 'rgba(26,58,92,0.5)', border: form.isAnonymous ? '1px solid rgba(0,212,255,0.5)' : '1px solid rgba(26,58,92,0.5)' }}>
                  <div className="absolute top-0.5 w-5 h-5 rounded-full transition-all duration-300"
                    style={{ background: form.isAnonymous ? '#00d4ff' : '#3d5a73', left: form.isAnonymous ? 'calc(100% - 22px)' : '2px' }} />
                </div>
              </div>
            </div>
          )}

          {/* Step 4 — Review & Consent */}
          {step === 4 && (
            <div className="space-y-6 animate-fadeInUp">
              <div>
                <h2 className="text-lg font-semibold mb-1" style={{ color: '#c8dff0' }}>Review & Consent</h2>
                <p className="text-sm" style={{ color: '#6a8fa8' }}>Please review your submission and provide informed consent.</p>
              </div>
              <div className="p-5 rounded-xl space-y-1"
                style={{ background: 'rgba(8,15,32,0.6)', border: '1px solid rgba(26,58,92,0.5)' }}>
                <SummaryRow label="Cancer Type" value={CANCER_TYPES.find(c => c.value === form.cancerType)?.label ?? ''} />
                <SummaryRow label="Stage" value={CANCER_STAGES.find(s => s.value === form.cancerStage)?.label ?? ''} />
                <SummaryRow label="Diagnosis" value={form.diagnosisDate ?? ''} />
                <SummaryRow label="Modality" value={IMAGING_MODALITIES.find(m => m.value === form.imagingModality)?.label ?? ''} />
                <SummaryRow label="Imaging Date" value={form.imagingDate} />
                <SummaryRow label="Body Region" value={BODY_REGIONS.find(b => b.value === form.bodyRegion)?.label ?? ''} />
                <SummaryRow label="Country" value={COUNTRIES.find(c => c.value === form.countryCode)?.label ?? ''} />
                <SummaryRow label="Files" value={`${form.files.length} file${form.files.length !== 1 ? 's' : ''}`} />
                <SummaryRow label="Submission" value={form.isAnonymous ? 'Anonymous' : 'Linked to account'} />
              </div>
              <div className="p-5 rounded-xl" style={{ background: 'rgba(0,212,255,0.04)', border: '1px solid rgba(0,212,255,0.15)' }}>
                <div className="flex gap-2 mb-3">
                  <Info className="w-4 h-4 flex-shrink-0" style={{ color: '#00d4ff' }} />
                  <p className="text-xs font-semibold" style={{ color: '#c8dff0' }}>By submitting you confirm that:</p>
                </div>
                <ul className="space-y-2 text-xs" style={{ color: '#6a8fa8' }}>
                  {[
                    'You are the patient or have legal authority to share this imaging data',
                    'You consent to the data being anonymized and released under CC BY 4.0 for open AI research',
                    'Patient-identifying DICOM metadata will be permanently removed before storage',
                    'You understand this is not a medical service — your data helps future patients, not your own care',
                    'You can withdraw your submission at any time via My Submissions',
                  ].map((item) => (
                    <li key={item} className="flex gap-2">
                      <CheckCircle className="w-3 h-3 flex-shrink-0 mt-0.5" style={{ color: '#00e676' }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-xl cursor-pointer transition-all"
                style={{ background: form.consentGiven ? 'rgba(0,230,118,0.05)' : 'rgba(13,26,46,0.5)', border: form.consentGiven ? '1px solid rgba(0,230,118,0.3)' : '1px solid rgba(26,58,92,0.5)' }}
                onClick={() => set('consentGiven', !form.consentGiven)}>
                <div className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5 transition-all"
                  style={{ background: form.consentGiven ? 'rgba(0,230,118,0.2)' : 'transparent', border: form.consentGiven ? '2px solid #00e676' : '2px solid rgba(26,58,92,0.8)' }}>
                  {form.consentGiven && <CheckCircle className="w-3 h-3" style={{ color: '#00e676' }} />}
                </div>
                <p className="text-sm" style={{ color: '#c8dff0' }}>
                  I agree and consent to contributing this imaging data to the CancerProgressionAtlas open dataset.
                </p>
              </div>
              {!form.consentGiven && (
                <div className="flex gap-2 p-3 rounded-lg" style={{ background: 'rgba(255,171,0,0.08)', border: '1px solid rgba(255,171,0,0.2)' }}>
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#ffab00' }} />
                  <p className="text-xs" style={{ color: '#ffab00' }}>Please check the consent box above to submit.</p>
                </div>
              )}
              {/* Upload progress */}
              {submitting && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs" style={{ color: '#6a8fa8' }}>
                    <span>Uploading & encrypting…</span>
                    <span className="mono">{progress}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'rgba(26,58,92,0.5)' }}>
                    <div className="h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #0066ff, #00d4ff)' }} />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6" style={{ borderTop: '1px solid rgba(26,58,92,0.4)' }}>
            <button onClick={() => setStep((s) => Math.max(1, s - 1))} disabled={step === 1}
              className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all"
              style={{ color: step === 1 ? '#3d5a73' : '#c8dff0', border: '1px solid rgba(26,58,92,0.5)', background: 'transparent', cursor: step === 1 ? 'not-allowed' : 'pointer' }}>
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            <StepDots current={step} />
            {step < 4 ? (
              <button onClick={() => setStep((s) => s + 1)} disabled={!canProceed()}
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all"
                style={{
                  background: canProceed() ? 'linear-gradient(135deg, #0066ff, #00d4ff)' : 'rgba(26,58,92,0.3)',
                  color: canProceed() ? '#fff' : '#3d5a73',
                  cursor: canProceed() ? 'pointer' : 'not-allowed',
                  boxShadow: canProceed() ? '0 0 20px rgba(0,102,255,0.3)' : 'none',
                }}>
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={!canProceed() || submitting}
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all"
                style={{
                  background: canProceed() && !submitting ? 'linear-gradient(135deg, #00bb99, #00e676)' : 'rgba(26,58,92,0.3)',
                  color: canProceed() && !submitting ? '#fff' : '#3d5a73',
                  cursor: canProceed() && !submitting ? 'pointer' : 'not-allowed',
                  boxShadow: canProceed() && !submitting ? '0 0 20px rgba(0,230,118,0.3)' : 'none',
                }}>
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadIcon className="w-4 h-4" />}
                {submitting ? 'Submitting…' : 'Submit Contribution'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
