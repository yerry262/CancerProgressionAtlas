import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { Upload, Clock, CheckCircle, XCircle, FileImage, AlertCircle, LogIn, Trash2, Loader2 } from 'lucide-react';
import Badge from '../components/ui/Badge';
import { SubmissionSkeleton } from '../components/ui/Skeleton';
import { submissionService, type SubmissionListItem } from '../services/submission.service';
import { CANCER_TYPES, IMAGING_MODALITIES } from '../data/medical';
import { useAuth } from '../context/AuthContext';

const STATUS_CONFIG = {
  pending: { label: 'Under Review', icon: Clock, color: 'warning' as const },
  approved: { label: 'Approved', icon: CheckCircle, color: 'success' as const },
  rejected: { label: 'Rejected', icon: XCircle, color: 'danger' as const },
  withdrawn: { label: 'Withdrawn', icon: XCircle, color: 'muted' as const },
};

function SubmissionCard({ sub, onWithdraw, withdrawing }: {
  sub: SubmissionListItem;
  onWithdraw: () => void;
  withdrawing: boolean;
}) {
  const { label, icon: StatusIcon, color } = STATUS_CONFIG[sub.status];
  const cancerLabel = CANCER_TYPES.find(c => c.value === sub.cancer_type)?.label ?? sub.cancer_type;
  const modalityLabel = IMAGING_MODALITIES.find(m => m.value === sub.imaging_modality)?.label ?? sub.imaging_modality;
  const canWithdraw = sub.status === 'pending' || sub.status === 'rejected';

  return (
    <div className="p-5 rounded-2xl glass transition-all duration-200"
      style={{ borderColor: sub.status === 'rejected' ? 'rgba(255,61,90,0.2)' : undefined }}>
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)' }}>
          <FileImage className="w-6 h-6" style={{ color: '#00d4ff' }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="font-semibold text-sm" style={{ color: '#c8dff0' }}>{cancerLabel}</span>
            <Badge variant="cyan">{modalityLabel}</Badge>
            <Badge variant={color}>
              <StatusIcon className="w-3 h-3 mr-1 inline" />{label}
            </Badge>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs" style={{ color: '#6a8fa8' }}>
            <span>{sub.body_region}</span>
            <span>Imaged: {sub.imaging_date}</span>
            <span>Submitted: {sub.created_at?.slice(0, 10)}</span>
            <span className="mono">{sub.id.slice(0, 8).toUpperCase()}</span>
            <span>{sub.file_count} file{sub.file_count !== 1 ? 's' : ''}</span>
          </div>
        </div>
        {canWithdraw && (
          <button onClick={onWithdraw} disabled={withdrawing}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold flex-shrink-0 transition-all"
            style={{
              background: 'rgba(255,61,90,0.06)',
              border: '1px solid rgba(255,61,90,0.2)',
              color: withdrawing ? '#3d5a73' : '#ff3d5a',
              cursor: withdrawing ? 'not-allowed' : 'pointer',
            }}>
            {withdrawing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
            Withdraw
          </button>
        )}
        {sub.status === 'approved' && (
          <span className="text-xs px-2 py-1 rounded-lg flex-shrink-0"
            style={{ background: 'rgba(0,230,118,0.06)', color: '#3d5a73', border: '1px solid rgba(0,230,118,0.1)' }}>
            In dataset
          </span>
        )}
      </div>
      {/* Rejection reason + guidance */}
      {sub.status === 'rejected' && (sub as SubmissionListItem & { rejection_reason?: string }).rejection_reason && (
        <div className="mt-3 p-3 rounded-xl"
          style={{ background: 'rgba(255,61,90,0.05)', border: '1px solid rgba(255,61,90,0.15)' }}>
          <p className="text-xs font-semibold mb-1" style={{ color: '#ff3d5a' }}>Rejection reason</p>
          <p className="text-xs mb-2" style={{ color: '#6a8fa8' }}>
            {(sub as SubmissionListItem & { rejection_reason?: string }).rejection_reason}
          </p>
          <Link to="/upload" className="text-xs" style={{ color: '#00d4ff' }}>
            Re-submit with corrections →
          </Link>
        </div>
      )}
    </div>
  );
}

export default function Submissions() {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [withdrawingId, setWithdrawingId] = useState<string | null>(null);

  const { data: submissions = [], isLoading, isError } = useQuery({
    queryKey: ['submissions'],
    queryFn: submissionService.listMine,
    staleTime: 15_000,
    retry: false,
  });

  const withdrawMutation = useMutation({
    mutationFn: (id: string) => submissionService.withdraw(id),
    onSuccess: () => {
      toast.success('Submission withdrawn');
      setWithdrawingId(null);
      queryClient.invalidateQueries({ queryKey: ['submissions'] });
    },
    onError: () => {
      toast.error('Could not withdraw — please try again');
      setWithdrawingId(null);
    },
  });

  const approved = submissions.filter(s => s.status === 'approved').length;
  const pending = submissions.filter(s => s.status === 'pending').length;
  const rejected = submissions.filter(s => s.status === 'rejected').length;

  return (
    <div className="min-h-screen pt-28 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="text-xs uppercase tracking-widest mono mb-2" style={{ color: '#00d4ff' }}>Dashboard</p>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2" style={{ color: '#c8dff0' }}>My Submissions</h1>
            <p className="text-sm" style={{ color: '#6a8fa8' }}>Track the status of your contributed imaging.</p>
          </div>
          <Link to="/upload" className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #0066ff, #00d4ff)', color: '#fff', boxShadow: '0 0 20px rgba(0,102,255,0.3)' }}>
            <Upload className="w-4 h-4" /> New Upload
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total Uploads', value: isLoading ? '—' : submissions.length, color: '#00d4ff' },
            { label: 'Approved', value: isLoading ? '—' : approved, color: '#00e676' },
            { label: 'Pending', value: isLoading ? '—' : pending, color: '#ffab00' },
          ].map(({ label, value, color }) => (
            <div key={label} className="p-5 rounded-xl glass text-center">
              <p className="text-3xl font-black mono" style={{ color }}>{value}</p>
              <p className="text-xs uppercase tracking-widest mt-1" style={{ color: '#3d5a73' }}>{label}</p>
            </div>
          ))}
        </div>

        {/* Auth notice */}
        {!isAuthenticated && (
          <div className="mb-6 flex gap-3 p-4 rounded-xl"
            style={{ background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.15)' }}>
            <LogIn className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#00d4ff' }} />
            <div>
              <p className="text-sm" style={{ color: '#c8dff0' }}>
                Showing submissions for this browser session.{' '}
                <Link to="/login" style={{ color: '#00d4ff' }} className="hover:underline">Sign in</Link>{' '}
                to access submissions across devices.
              </p>
            </div>
          </div>
        )}

        {/* Rejected warning */}
        {rejected > 0 && (
          <div className="mb-6 flex gap-3 p-4 rounded-xl"
            style={{ background: 'rgba(255,61,90,0.06)', border: '1px solid rgba(255,61,90,0.2)' }}>
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#ff3d5a' }} />
            <p className="text-sm" style={{ color: '#6a8fa8' }}>
              <span style={{ color: '#ff3d5a' }}>{rejected} submission{rejected > 1 ? 's were' : ' was'} not accepted</span> — often due to image quality or missing metadata. You can re-submit with corrections.
            </p>
          </div>
        )}

        {/* List */}
        <div className="space-y-3">
          {isLoading && Array.from({ length: 3 }).map((_, i) => <SubmissionSkeleton key={i} />)}
          {isError && (
            <div className="flex gap-3 p-5 rounded-2xl"
              style={{ background: 'rgba(255,61,90,0.05)', border: '1px solid rgba(255,61,90,0.2)' }}>
              <AlertCircle className="w-5 h-5 flex-shrink-0" style={{ color: '#ff3d5a' }} />
              <div>
                <p className="font-semibold text-sm mb-1" style={{ color: '#c8dff0' }}>Could not load submissions</p>
                <p className="text-sm" style={{ color: '#6a8fa8' }}>The backend may not be running. Start the server to see your submissions.</p>
              </div>
            </div>
          )}
          {!isLoading && !isError && submissions.length === 0 && (
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)' }}>
                <Upload className="w-8 h-8" style={{ color: '#3d5a73' }} />
              </div>
              <p className="text-base font-semibold mb-2" style={{ color: '#c8dff0' }}>No submissions yet</p>
              <p className="text-sm mb-6" style={{ color: '#6a8fa8' }}>
                Upload your first scan — every image helps future patients get diagnosed earlier.
              </p>
              <Link to="/upload" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold"
                style={{ background: 'linear-gradient(135deg, #0066ff, #00d4ff)', color: '#fff' }}>
                <Upload className="w-4 h-4" /> Upload Imaging
              </Link>
            </div>
          )}
          {submissions.map(sub => (
            <SubmissionCard
              key={sub.id}
              sub={sub}
              withdrawing={withdrawingId === sub.id}
              onWithdraw={() => {
                setWithdrawingId(sub.id);
                withdrawMutation.mutate(sub.id);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
