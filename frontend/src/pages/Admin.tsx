import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
  ShieldCheck, Clock, CheckCircle, XCircle, ChevronDown,
  ChevronUp, Loader2, FileText, AlertTriangle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

// ─── Types ───────────────────────────────────────────────────────────────────

interface AdminSubmission {
  id: string;
  cancer_type: string;
  cancer_stage?: string;
  imaging_modality: string;
  imaging_date: string;
  body_region: string;
  treatment_context?: string;
  patient_age?: number;
  patient_sex?: string;
  country_code?: string;
  is_anonymous: boolean;
  notes?: string;
  status: 'pending' | 'approved' | 'rejected';
  rejection_reason?: string;
  created_at: string;
  file_count: number;
}

interface QueueStats { pending: number; approved: number; rejected: number }

// ─── API helpers ─────────────────────────────────────────────────────────────

const adminApi = {
  stats: () => api.get<QueueStats>('/admin/stats').then((r) => r.data),
  list: (status: string) =>
    api.get<{ submissions: AdminSubmission[]; total: number }>('/admin/submissions', { params: { status } })
      .then((r) => r.data),
  approve: (id: string) => api.post(`/admin/submissions/${id}/approve`),
  reject: (id: string, reason: string) =>
    api.post(`/admin/submissions/${id}/reject`, { reason }),
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatChip({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex flex-col items-center px-6 py-4 rounded-2xl"
      style={{ background: 'rgba(13,26,46,0.7)', border: `1px solid ${color}33` }}>
      <span className="text-2xl font-black mono" style={{ color }}>{value}</span>
      <span className="text-xs uppercase tracking-widest mt-1" style={{ color: '#3d5a73' }}>{label}</span>
    </div>
  );
}

function FieldPair({ label, value }: { label: string; value: string | number | undefined | null }) {
  if (!value && value !== 0) return null;
  return (
    <div>
      <dt className="text-xs uppercase tracking-widest mb-0.5" style={{ color: '#3d5a73' }}>{label}</dt>
      <dd className="text-sm mono" style={{ color: '#c8dff0' }}>{String(value)}</dd>
    </div>
  );
}

function RejectModal({ onConfirm, onCancel, loading }: {
  onConfirm: (reason: string) => void;
  onCancel: () => void;
  loading: boolean;
}) {
  const [reason, setReason] = useState('');
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(5,10,20,0.85)', backdropFilter: 'blur(8px)' }}>
      <div className="w-full max-w-md rounded-2xl p-6"
        style={{ background: 'rgba(13,26,46,0.98)', border: '1px solid rgba(255,61,90,0.3)', boxShadow: '0 30px 60px rgba(0,0,0,0.5)' }}>
        <h3 className="text-lg font-bold mb-1" style={{ color: '#c8dff0' }}>Reject Submission</h3>
        <p className="text-sm mb-4" style={{ color: '#6a8fa8' }}>
          Provide a reason — this will be shown to the contributor on their dashboard.
        </p>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={4}
          placeholder="e.g. DICOM file still contains patient name in header. Please re-export with PHI stripped."
          className="w-full rounded-xl px-4 py-3 text-sm resize-none outline-none"
          style={{
            background: 'rgba(8,15,32,0.8)',
            border: '1px solid rgba(26,58,92,0.8)',
            color: '#c8dff0',
          }}
        />
        <div className="flex gap-3 mt-4">
          <button onClick={onCancel} disabled={loading}
            className="flex-1 py-3 rounded-xl text-sm font-semibold"
            style={{ border: '1px solid rgba(26,58,92,0.5)', color: '#6a8fa8' }}>
            Cancel
          </button>
          <button
            onClick={() => reason.trim() && onConfirm(reason.trim())}
            disabled={!reason.trim() || loading}
            className="flex-1 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
            style={{
              background: reason.trim() && !loading ? 'rgba(255,61,90,0.15)' : 'rgba(26,58,92,0.3)',
              border: reason.trim() && !loading ? '1px solid rgba(255,61,90,0.4)' : '1px solid rgba(26,58,92,0.4)',
              color: reason.trim() && !loading ? '#ff3d5a' : '#3d5a73',
              cursor: reason.trim() && !loading ? 'pointer' : 'not-allowed',
            }}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}

function SubmissionCard({ sub, onApprove, onReject, approving, rejecting }: {
  sub: AdminSubmission;
  onApprove: () => void;
  onReject: () => void;
  approving: boolean;
  rejecting: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const busy = approving || rejecting;

  return (
    <div className="rounded-2xl overflow-hidden transition-all"
      style={{ background: 'rgba(13,26,46,0.7)', border: '1px solid rgba(26,58,92,0.8)' }}>

      {/* Header row */}
      <div className="flex items-start justify-between gap-4 p-5">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-sm font-bold" style={{ color: '#c8dff0' }}>{sub.cancer_type}</span>
            {sub.cancer_stage && (
              <span className="px-2 py-0.5 rounded-full text-xs mono"
                style={{ background: 'rgba(0,212,255,0.08)', color: '#00d4ff', border: '1px solid rgba(0,212,255,0.2)' }}>
                {sub.cancer_stage}
              </span>
            )}
            {sub.is_anonymous && (
              <span className="px-2 py-0.5 rounded-full text-xs"
                style={{ background: 'rgba(26,58,92,0.5)', color: '#6a8fa8' }}>
                anonymous
              </span>
            )}
          </div>
          <p className="text-xs" style={{ color: '#6a8fa8' }}>
            {sub.imaging_modality} · {sub.body_region} · {sub.file_count} file{sub.file_count !== 1 ? 's' : ''}
          </p>
          <p className="text-xs mt-0.5 mono" style={{ color: '#3d5a73' }}>
            Submitted {new Date(sub.created_at).toLocaleDateString()}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => setExpanded((e) => !e)}
            className="p-2 rounded-lg transition-colors"
            style={{ border: '1px solid rgba(26,58,92,0.5)', color: '#6a8fa8' }}>
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          <button onClick={onReject} disabled={busy}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all"
            style={{
              background: busy ? 'rgba(26,58,92,0.3)' : 'rgba(255,61,90,0.08)',
              border: busy ? '1px solid rgba(26,58,92,0.4)' : '1px solid rgba(255,61,90,0.25)',
              color: busy ? '#3d5a73' : '#ff3d5a',
              cursor: busy ? 'not-allowed' : 'pointer',
            }}>
            {rejecting ? <Loader2 className="w-3 h-3 animate-spin" /> : <XCircle className="w-3 h-3" />}
            Reject
          </button>
          <button onClick={onApprove} disabled={busy}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all"
            style={{
              background: busy ? 'rgba(26,58,92,0.3)' : 'rgba(0,230,118,0.1)',
              border: busy ? '1px solid rgba(26,58,92,0.4)' : '1px solid rgba(0,230,118,0.3)',
              color: busy ? '#3d5a73' : '#00e676',
              cursor: busy ? 'not-allowed' : 'pointer',
            }}>
            {approving ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle className="w-3 h-3" />}
            Approve
          </button>
        </div>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div className="px-5 pb-5 pt-0">
          <div className="h-px mb-4" style={{ background: 'rgba(26,58,92,0.5)' }} />
          <dl className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4">
            <FieldPair label="Imaging Date" value={sub.imaging_date} />
            <FieldPair label="Treatment Context" value={sub.treatment_context} />
            <FieldPair label="Age" value={sub.patient_age} />
            <FieldPair label="Sex" value={sub.patient_sex} />
            <FieldPair label="Country" value={sub.country_code} />
            <FieldPair label="Submission ID" value={sub.id} />
          </dl>
          {sub.notes && (
            <div className="mt-4 p-3 rounded-xl"
              style={{ background: 'rgba(8,15,32,0.6)', border: '1px solid rgba(26,58,92,0.4)' }}>
              <p className="text-xs uppercase tracking-widest mb-1" style={{ color: '#3d5a73' }}>Clinical Notes</p>
              <p className="text-sm" style={{ color: '#c8dff0' }}>{sub.notes}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function Admin() {
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [tab, setTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [rejectTarget, setRejectTarget] = useState<string | null>(null);
  const [actionId, setActionId] = useState<string | null>(null);

  // Redirect unauthenticated users
  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  // Show access denied for non-admins
  if (!isAdmin) {
    return (
      <div className="min-h-screen pt-28 px-6 flex items-center justify-center">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: 'rgba(255,61,90,0.08)', border: '1px solid rgba(255,61,90,0.2)' }}>
            <AlertTriangle className="w-8 h-8" style={{ color: '#ff3d5a' }} />
          </div>
          <h1 className="text-xl font-bold mb-2" style={{ color: '#c8dff0' }}>Access Denied</h1>
          <p className="text-sm" style={{ color: '#6a8fa8' }}>This page is only accessible to admins.</p>
        </div>
      </div>
    );
  }

  const { data: stats } = useQuery({ queryKey: ['adminStats'], queryFn: adminApi.stats, refetchInterval: 30_000 });
  const { data: queue, isLoading } = useQuery({
    queryKey: ['adminQueue', tab],
    queryFn: () => adminApi.list(tab),
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['adminQueue'] });
    queryClient.invalidateQueries({ queryKey: ['adminStats'] });
  };

  const approveMutation = useMutation({
    mutationFn: (id: string) => adminApi.approve(id),
    onSuccess: () => { toast.success('Submission approved'); setActionId(null); invalidate(); },
    onError: () => { toast.error('Failed to approve'); setActionId(null); },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => adminApi.reject(id, reason),
    onSuccess: () => { toast.success('Submission rejected'); setRejectTarget(null); setActionId(null); invalidate(); },
    onError: () => { toast.error('Failed to reject'); },
  });

  const handleApprove = (id: string) => {
    setActionId(id);
    approveMutation.mutate(id);
  };

  const handleRejectConfirm = (reason: string) => {
    if (!rejectTarget) return;
    rejectMutation.mutate({ id: rejectTarget, reason });
  };

  const TABS: { key: typeof tab; label: string; color: string }[] = [
    { key: 'pending', label: 'Pending', color: '#ffab00' },
    { key: 'approved', label: 'Approved', color: '#00e676' },
    { key: 'rejected', label: 'Rejected', color: '#ff3d5a' },
  ];

  return (
    <div className="min-h-screen pt-28 pb-20 px-6">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)' }}>
              <ShieldCheck className="w-5 h-5" style={{ color: '#00d4ff' }} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest mono" style={{ color: '#00d4ff' }}>Admin</p>
              <h1 className="text-2xl font-bold" style={{ color: '#c8dff0' }}>Submission Review</h1>
            </div>
          </div>
          <p className="text-sm" style={{ color: '#6a8fa8' }}>
            Review and moderate submissions before they enter the public dataset.
          </p>
        </div>

        {/* Stats */}
        {stats && (
          <div className="flex gap-3 mb-8 flex-wrap">
            <StatChip label="Pending" value={stats.pending} color="#ffab00" />
            <StatChip label="Approved" value={stats.approved} color="#00e676" />
            <StatChip label="Rejected" value={stats.rejected} color="#ff3d5a" />
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 mb-6 p-1 rounded-xl"
          style={{ background: 'rgba(13,26,46,0.5)', border: '1px solid rgba(26,58,92,0.5)', width: 'fit-content' }}>
          {TABS.map(({ key, label, color }) => (
            <button key={key} onClick={() => setTab(key)}
              className="px-5 py-2 rounded-lg text-sm font-semibold transition-all"
              style={{
                background: tab === key ? 'rgba(26,58,92,0.8)' : 'transparent',
                color: tab === key ? color : '#3d5a73',
                border: tab === key ? `1px solid ${color}33` : '1px solid transparent',
              }}>
              {label}
              {key === 'pending' && stats?.pending ? (
                <span className="ml-2 px-1.5 py-0.5 rounded-full text-xs"
                  style={{ background: 'rgba(255,171,0,0.15)', color: '#ffab00' }}>
                  {stats.pending}
                </span>
              ) : null}
            </button>
          ))}
        </div>

        {/* Queue */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 rounded-2xl animate-pulse"
                style={{ background: 'rgba(13,26,46,0.5)' }} />
            ))}
          </div>
        ) : queue?.submissions.length === 0 ? (
          <div className="text-center py-20">
            <FileText className="w-10 h-10 mx-auto mb-3" style={{ color: '#3d5a73' }} />
            <p className="text-sm" style={{ color: '#6a8fa8' }}>
              No {tab} submissions.
              {tab === 'pending' && ' Great work — the queue is clear.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {queue?.submissions.map((sub) => (
              <SubmissionCard
                key={sub.id}
                sub={sub}
                approving={actionId === sub.id && approveMutation.isPending}
                rejecting={actionId === sub.id && rejectMutation.isPending}
                onApprove={() => handleApprove(sub.id)}
                onReject={() => { setRejectTarget(sub.id); setActionId(sub.id); }}
              />
            ))}
            {(queue?.total ?? 0) > (queue?.submissions.length ?? 0) && (
              <p className="text-center text-xs pt-2" style={{ color: '#3d5a73' }}>
                Showing {queue?.submissions.length} of {queue?.total} submissions
              </p>
            )}
          </div>
        )}
      </div>

      {/* Reject modal */}
      {rejectTarget && (
        <RejectModal
          loading={rejectMutation.isPending}
          onConfirm={handleRejectConfirm}
          onCancel={() => { setRejectTarget(null); setActionId(null); }}
        />
      )}
    </div>
  );
}
