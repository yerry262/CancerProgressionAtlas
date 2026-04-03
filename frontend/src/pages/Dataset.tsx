import { useState } from 'react';
import { Search, Download, ExternalLink, Database, SlidersHorizontal } from 'lucide-react';
import Badge from '../components/ui/Badge';
import Select from '../components/ui/Select';
import { CANCER_TYPES, IMAGING_MODALITIES, CANCER_STAGES } from '../data/medical';

// Placeholder entries until backend is connected
const MOCK_ENTRIES = [
  {
    id: 'CPA-0001',
    cancerTypeLabel: 'Breast Cancer',
    imagingModalityLabel: 'MRI with Contrast',
    imagingDate: '2023-04',
    bodyRegionLabel: 'Left Breast',
    cancerStage: 'Stage IIA',
    treatmentContext: 'Pre-Treatment / Baseline',
    fileCount: 3,
    approvedAt: '2025-01-10',
  },
  {
    id: 'CPA-0002',
    cancerTypeLabel: 'Lung Cancer – NSCLC',
    imagingModalityLabel: 'PET-CT',
    imagingDate: '2022-11',
    bodyRegionLabel: 'Right Lung',
    cancerStage: 'Stage IIIB',
    treatmentContext: 'During Chemotherapy',
    fileCount: 12,
    approvedAt: '2025-01-11',
  },
  {
    id: 'CPA-0003',
    cancerTypeLabel: 'Glioblastoma (GBM)',
    imagingModalityLabel: 'MRI – DWI',
    imagingDate: '2024-03',
    bodyRegionLabel: 'Brain',
    cancerStage: 'Stage IV – Metastatic',
    treatmentContext: 'Post-Treatment Follow-up',
    fileCount: 7,
    approvedAt: '2025-01-12',
  },
  {
    id: 'CPA-0004',
    cancerTypeLabel: 'Colorectal Cancer',
    imagingModalityLabel: 'CT Scan',
    imagingDate: '2023-08',
    bodyRegionLabel: 'Colon / Rectum',
    cancerStage: 'Stage II – Regional',
    treatmentContext: 'Surveillance / Monitoring',
    fileCount: 4,
    approvedAt: '2025-01-13',
  },
  {
    id: 'CPA-0005',
    cancerTypeLabel: 'Melanoma',
    imagingModalityLabel: 'Dermoscopy',
    imagingDate: '2024-06',
    bodyRegionLabel: 'Skin',
    cancerStage: 'Stage I – Localized',
    treatmentContext: 'Initial Diagnostic Workup',
    fileCount: 8,
    approvedAt: '2025-01-14',
  },
  {
    id: 'CPA-0006',
    cancerTypeLabel: 'Prostate Cancer',
    imagingModalityLabel: 'MRI with Contrast',
    imagingDate: '2022-09',
    bodyRegionLabel: 'Prostate',
    cancerStage: 'Stage IIB',
    treatmentContext: 'Pre-Treatment / Baseline',
    fileCount: 5,
    approvedAt: '2025-01-15',
  },
];

const modalityColor = (m: string): 'cyan' | 'teal' | 'blue' | 'muted' => {
  if (m.includes('MRI')) return 'cyan';
  if (m.includes('PET')) return 'teal';
  if (m.includes('CT')) return 'blue';
  return 'muted';
};

export default function Dataset() {
  const [search, setSearch] = useState('');
  const [filterCancer, setFilterCancer] = useState('');
  const [filterModality, setFilterModality] = useState('');
  const [filterStage, setFilterStage] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const filtered = MOCK_ENTRIES.filter((e) => {
    const q = search.toLowerCase();
    if (q && !e.cancerTypeLabel.toLowerCase().includes(q) && !e.imagingModalityLabel.toLowerCase().includes(q) && !e.bodyRegionLabel.toLowerCase().includes(q)) return false;
    if (filterCancer && !e.cancerTypeLabel.toLowerCase().includes(filterCancer.toLowerCase())) return false;
    if (filterModality && !e.imagingModalityLabel.toLowerCase().includes(filterModality.toLowerCase())) return false;
    if (filterStage && e.cancerStage !== filterStage) return false;
    return true;
  });

  return (
    <div className="min-h-screen pt-28 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <p className="text-xs uppercase tracking-widest mono mb-2" style={{ color: '#00d4ff' }}>Open Dataset</p>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3" style={{ color: '#c8dff0' }}>
            Browse Imaging Dataset
          </h1>
          <p className="text-sm" style={{ color: '#6a8fa8' }}>
            Anonymized, community-contributed cancer imaging. Free for research under CC BY 4.0.
          </p>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total Entries', value: MOCK_ENTRIES.length, note: 'sample data' },
            { label: 'Cancer Types', value: new Set(MOCK_ENTRIES.map(e => e.cancerTypeLabel)).size },
            { label: 'Total Files', value: MOCK_ENTRIES.reduce((a, e) => a + e.fileCount, 0) },
          ].map(({ label, value, note }) => (
            <div key={label} className="p-4 rounded-xl glass text-center">
              <p className="text-2xl font-black mono" style={{ color: '#00d4ff' }}>{value}</p>
              <p className="text-xs uppercase tracking-widest mt-1" style={{ color: '#3d5a73' }}>{label}</p>
              {note && <p className="text-xs mt-0.5" style={{ color: '#3d5a73' }}>({note})</p>}
            </div>
          ))}
        </div>

        {/* Search & filter bar */}
        <div className="mb-6 space-y-4">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#3d5a73' }} />
              <input
                type="text"
                placeholder="Search cancer type, modality, body region…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl text-sm"
                style={{ background: 'rgba(16, 32, 56, 0.8)', border: '1px solid rgba(26, 58, 92, 0.8)', color: '#c8dff0' }}
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all"
              style={{
                background: showFilters ? 'rgba(0, 212, 255, 0.1)' : 'rgba(16, 32, 56, 0.8)',
                border: showFilters ? '1px solid rgba(0, 212, 255, 0.3)' : '1px solid rgba(26, 58, 92, 0.8)',
                color: showFilters ? '#00d4ff' : '#6a8fa8',
              }}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>
            <button
              className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold"
              style={{ border: '1px solid rgba(26, 58, 92, 0.5)', color: '#6a8fa8', background: 'transparent' }}
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 rounded-xl animate-fadeInUp" style={{ background: 'rgba(13, 26, 46, 0.6)', border: '1px solid rgba(26, 58, 92, 0.5)' }}>
              <Select
                label="Cancer Type"
                value={filterCancer}
                onChange={setFilterCancer}
                options={[{ value: '', label: 'All Types' }, ...CANCER_TYPES as unknown as { value: string; label: string }[]]}
                groupByCategory
              />
              <Select
                label="Imaging Modality"
                value={filterModality}
                onChange={setFilterModality}
                options={[{ value: '', label: 'All Modalities' }, ...IMAGING_MODALITIES as unknown as { value: string; label: string }[]]}
              />
              <Select
                label="Cancer Stage"
                value={filterStage}
                onChange={setFilterStage}
                options={[{ value: '', label: 'All Stages' }, ...CANCER_STAGES as unknown as { value: string; label: string }[]]}
              />
            </div>
          )}
        </div>

        {/* Results */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm" style={{ color: '#6a8fa8' }}>
            Showing <span style={{ color: '#c8dff0' }}>{filtered.length}</span> entries
          </p>
          <Badge variant="cyan">Preview Mode – Sample Data</Badge>
        </div>

        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <Database className="w-12 h-12 mx-auto mb-4" style={{ color: '#3d5a73' }} />
              <p style={{ color: '#6a8fa8' }}>No entries match your filters.</p>
            </div>
          ) : (
            filtered.map((entry) => (
              <div
                key={entry.id}
                className="flex flex-col sm:flex-row sm:items-center gap-4 p-5 rounded-2xl glass transition-all duration-200 hover:border-glow group cursor-pointer"
              >
                {/* ID */}
                <div className="flex-shrink-0">
                  <p className="text-xs mono font-bold" style={{ color: '#00d4ff' }}>{entry.id}</p>
                  <p className="text-xs mt-0.5" style={{ color: '#3d5a73' }}>Added {entry.approvedAt}</p>
                </div>

                {/* Main info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="font-semibold text-sm" style={{ color: '#c8dff0' }}>{entry.cancerTypeLabel}</span>
                    <Badge variant={modalityColor(entry.imagingModalityLabel)}>{entry.imagingModalityLabel}</Badge>
                    {entry.cancerStage && <Badge variant="muted">{entry.cancerStage}</Badge>}
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs" style={{ color: '#6a8fa8' }}>
                    <span>{entry.bodyRegionLabel}</span>
                    <span>{entry.imagingDate}</span>
                    <span>{entry.treatmentContext}</span>
                    <span>{entry.fileCount} file{entry.fileCount !== 1 ? 's' : ''}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all"
                    style={{ border: '1px solid rgba(0, 212, 255, 0.25)', color: '#00d4ff', background: 'rgba(0, 212, 255, 0.05)' }}
                  >
                    <ExternalLink className="w-3 h-3" />
                    View
                  </button>
                  <button
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all"
                    style={{ border: '1px solid rgba(26, 58, 92, 0.5)', color: '#6a8fa8', background: 'transparent' }}
                  >
                    <Download className="w-3 h-3" />
                    Download
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
