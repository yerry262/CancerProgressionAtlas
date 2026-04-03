import { Link } from 'react-router-dom';
import { Upload, Clock, CheckCircle, XCircle, FileImage, ChevronRight } from 'lucide-react';
import Badge from '../components/ui/Badge';

// Placeholder until auth + backend are wired
const MOCK_SUBMISSIONS = [
  {
    id: 'SUB-001',
    cancerType: 'Breast Cancer',
    imagingModality: 'MRI with Contrast',
    imagingDate: '2023-04-15',
    bodyRegion: 'Left Breast',
    status: 'approved' as const,
    createdAt: '2025-01-08',
    fileCount: 3,
  },
  {
    id: 'SUB-002',
    cancerType: 'Breast Cancer',
    imagingModality: 'CT Scan',
    imagingDate: '2024-01-10',
    bodyRegion: 'Chest / Thorax',
    status: 'pending' as const,
    createdAt: '2025-01-20',
    fileCount: 8,
  },
];

const statusConfig = {
  pending: { label: 'Under Review', icon: Clock, color: 'warning' as const },
  approved: { label: 'Approved', icon: CheckCircle, color: 'success' as const },
  rejected: { label: 'Rejected', icon: XCircle, color: 'danger' as const },
};

export default function Submissions() {
  const hasSubmissions = MOCK_SUBMISSIONS.length > 0;

  return (
    <div className="min-h-screen pt-28 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="text-xs uppercase tracking-widest mono mb-2" style={{ color: '#00d4ff' }}>Dashboard</p>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2" style={{ color: '#c8dff0' }}>My Submissions</h1>
            <p className="text-sm" style={{ color: '#6a8fa8' }}>
              Track the status of your contributed imaging.
            </p>
          </div>
          <Link
            to="/upload"
            className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold"
            style={{ background: 'linear-gradient(135deg, #0066ff, #00d4ff)', color: '#fff', boxShadow: '0 0 20px rgba(0, 102, 255, 0.3)' }}
          >
            <Upload className="w-4 h-4" />
            New Upload
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total Uploads', value: MOCK_SUBMISSIONS.length, color: '#00d4ff' },
            { label: 'Approved', value: MOCK_SUBMISSIONS.filter(s => s.status === 'approved').length, color: '#00e676' },
            { label: 'Pending Review', value: MOCK_SUBMISSIONS.filter(s => s.status === 'pending').length, color: '#ffab00' },
          ].map(({ label, value, color }) => (
            <div key={label} className="p-5 rounded-xl glass text-center">
              <p className="text-3xl font-black mono" style={{ color }}>{value}</p>
              <p className="text-xs uppercase tracking-widest mt-1" style={{ color: '#3d5a73' }}>{label}</p>
            </div>
          ))}
        </div>

        {/* Auth notice */}
        <div className="mb-6 flex gap-3 p-4 rounded-xl" style={{ background: 'rgba(0, 102, 255, 0.08)', border: '1px solid rgba(0, 102, 255, 0.2)' }}>
          <Clock className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#6699ff' }} />
          <p className="text-xs" style={{ color: '#6a8fa8' }}>
            <span style={{ color: '#c8dff0' }}>Note:</span> Account-based submission tracking is coming soon.
            Currently showing sample submissions. Anonymous uploads are tracked via a session token stored locally.
          </p>
        </div>

        {/* Submissions list */}
        {!hasSubmissions ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(0, 212, 255, 0.08)', border: '1px solid rgba(0, 212, 255, 0.2)' }}>
              <Upload className="w-8 h-8" style={{ color: '#3d5a73' }} />
            </div>
            <p className="text-base font-semibold mb-2" style={{ color: '#c8dff0' }}>No submissions yet</p>
            <p className="text-sm mb-6" style={{ color: '#6a8fa8' }}>Upload your first imaging to get started.</p>
            <Link
              to="/upload"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold"
              style={{ background: 'linear-gradient(135deg, #0066ff, #00d4ff)', color: '#fff' }}
            >
              <Upload className="w-4 h-4" />
              Upload Imaging
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {MOCK_SUBMISSIONS.map((sub) => {
              const { label, icon: StatusIcon, color } = statusConfig[sub.status];
              return (
                <div
                  key={sub.id}
                  className="flex flex-col sm:flex-row sm:items-center gap-4 p-5 rounded-2xl glass transition-all duration-200 hover:border-glow cursor-pointer"
                >
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(0, 212, 255, 0.08)', border: '1px solid rgba(0, 212, 255, 0.2)' }}>
                    <FileImage className="w-6 h-6" style={{ color: '#00d4ff' }} />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-semibold text-sm" style={{ color: '#c8dff0' }}>{sub.cancerType}</span>
                      <Badge variant="cyan">{sub.imagingModality}</Badge>
                      <Badge variant={color}>
                        <StatusIcon className="w-3 h-3 mr-1 inline" />
                        {label}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs" style={{ color: '#6a8fa8' }}>
                      <span>{sub.bodyRegion}</span>
                      <span>Imaged: {sub.imagingDate}</span>
                      <span>Submitted: {sub.createdAt}</span>
                      <span className="mono">{sub.id}</span>
                      <span>{sub.fileCount} files</span>
                    </div>
                  </div>

                  <ChevronRight className="w-4 h-4 flex-shrink-0" style={{ color: '#3d5a73' }} />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
