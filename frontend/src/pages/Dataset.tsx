import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Download, Database, SlidersHorizontal, AlertCircle, X } from 'lucide-react';
import Badge from '../components/ui/Badge';
import Select from '../components/ui/Select';
import { DatasetCardSkeleton } from '../components/ui/Skeleton';
import { CANCER_TYPES, IMAGING_MODALITIES, CANCER_STAGES, TREATMENT_CONTEXT } from '../data/medical';
import { COUNTRIES } from '../data/countries';
import { submissionService, type DatasetEntry } from '../services/submission.service';

const MODALITY_BADGE: Record<string, 'cyan' | 'teal' | 'blue' | 'muted'> = {
  mri: 'cyan', mri_contrast: 'cyan', mri_dwi: 'cyan',
  pet_ct: 'teal', pet_mri: 'teal',
  ct: 'blue', ct_contrast: 'blue',
};

function EntryCard({ entry }: { entry: DatasetEntry }) {
  const modalityLabel = IMAGING_MODALITIES.find(m => m.value === entry.imaging_modality)?.label ?? entry.imaging_modality;
  const cancerLabel = CANCER_TYPES.find(c => c.value === entry.cancer_type)?.label ?? entry.cancer_type;
  const stageLabel = CANCER_STAGES.find(s => s.value === entry.cancer_stage)?.label ?? entry.cancer_stage;
  const variant = MODALITY_BADGE[entry.imaging_modality] ?? 'muted';

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-5 rounded-2xl glass transition-all duration-200 hover:border-glow cursor-pointer">
      <div className="flex-shrink-0">
        <p className="text-xs mono font-bold" style={{ color: '#00d4ff' }}>CPA-{entry.id.slice(0,6).toUpperCase()}</p>
        <p className="text-xs mt-0.5" style={{ color: '#3d5a73' }}>{entry.approved_at?.slice(0,10)}</p>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1.5">
          <span className="font-semibold text-sm" style={{ color: '#c8dff0' }}>{cancerLabel}</span>
          <Badge variant={variant}>{modalityLabel}</Badge>
          {stageLabel && <Badge variant="muted">{stageLabel}</Badge>}
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs" style={{ color: '#6a8fa8' }}>
          <span>{entry.body_region}</span>
          <span>{entry.imaging_date}</span>
          {entry.treatment_context && <span>{entry.treatment_context}</span>}
          <span>{entry.file_count} file{entry.file_count !== 1 ? 's' : ''}</span>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className="px-3 py-1.5 rounded-lg text-xs"
          style={{ border: '1px solid rgba(26,58,92,0.4)', color: '#3d5a73', background: 'transparent' }}
          title="File viewer coming soon">
          <Download className="w-3 h-3 inline mr-1" />Download (soon)
        </span>
      </div>
    </div>
  );
}

export default function Dataset() {
  const [search, setSearch] = useState('');
  const [filterCancer, setFilterCancer] = useState('');
  const [filterModality, setFilterModality] = useState('');
  const [filterStage, setFilterStage] = useState('');
  const [filterCountry, setFilterCountry] = useState('');
  const [filterTreatment, setFilterTreatment] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const hasActiveFilters = !!(filterCancer || filterModality || filterStage || filterCountry || filterTreatment);
  const clearFilters = () => {
    setFilterCancer(''); setFilterModality(''); setFilterStage('');
    setFilterCountry(''); setFilterTreatment(''); setPage(1);
  };
  const [page, setPage] = useState(1);
  const LIMIT = 20;

  const { data, isLoading, isError } = useQuery({
    queryKey: ['dataset', page, search, filterCancer, filterModality, filterStage],
    queryFn: () => submissionService.getDataset({
      page, limit: LIMIT,
      ...(search && { search }),
      ...(filterCancer && { cancerType: filterCancer }),
      ...(filterModality && { modality: filterModality }),
      ...(filterStage && { stage: filterStage }),
      ...(filterCountry && { country: filterCountry }),
      ...(filterTreatment && { treatmentContext: filterTreatment }),
    }),
    staleTime: 30_000,
    placeholderData: (prev) => prev,
  });

  const entries: DatasetEntry[] = data?.entries ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div className="min-h-screen pt-28 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-widest mono mb-2" style={{ color: '#00d4ff' }}>Open Dataset</p>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3" style={{ color: '#c8dff0' }}>Browse Imaging Dataset</h1>
          <p className="text-sm" style={{ color: '#6a8fa8' }}>
            Anonymized, patient-contributed cancer imaging. Free for research use under CC BY 4.0.
          </p>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total Entries', value: isLoading ? '—' : total.toLocaleString() },
            { label: 'Cancer Types', value: '37+' },
            { label: 'Imaging Modalities', value: '18' },
          ].map(({ label, value }) => (
            <div key={label} className="p-4 rounded-xl glass text-center">
              <p className="text-2xl font-black mono" style={{ color: '#00d4ff' }}>{value}</p>
              <p className="text-xs uppercase tracking-widest mt-1" style={{ color: '#3d5a73' }}>{label}</p>
            </div>
          ))}
        </div>

        {/* Search & filters */}
        <div className="mb-6 space-y-4">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#3d5a73' }} />
              <input type="text" placeholder="Search cancer type, modality, body region…"
                value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none"
                style={{ background: 'rgba(16,32,56,0.8)', border: '1px solid rgba(26,58,92,0.8)', color: '#c8dff0' }} />
            </div>
            <button onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all"
              style={{ background: (showFilters || hasActiveFilters) ? 'rgba(0,212,255,0.1)' : 'rgba(16,32,56,0.8)', border: (showFilters || hasActiveFilters) ? '1px solid rgba(0,212,255,0.3)' : '1px solid rgba(26,58,92,0.8)', color: (showFilters || hasActiveFilters) ? '#00d4ff' : '#6a8fa8' }}>
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {hasActiveFilters && (
                <span className="px-1.5 py-0.5 rounded-full text-xs"
                  style={{ background: 'rgba(0,212,255,0.2)', color: '#00d4ff' }}>
                  {[filterCancer, filterModality, filterStage, filterCountry, filterTreatment].filter(Boolean).length}
                </span>
              )}
            </button>
            {hasActiveFilters && (
              <button onClick={clearFilters}
                className="flex items-center gap-1.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all"
                style={{ border: '1px solid rgba(255,61,90,0.25)', color: '#ff3d5a', background: 'rgba(255,61,90,0.06)' }}>
                <X className="w-4 h-4" /> Clear
              </button>
            )}
          </div>
          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 rounded-xl animate-fadeInUp"
              style={{ background: 'rgba(13,26,46,0.6)', border: '1px solid rgba(26,58,92,0.5)' }}>
              <Select label="Cancer Type" value={filterCancer} onChange={(v) => { setFilterCancer(v); setPage(1); }}
                options={[{ value: '', label: 'All Types' }, ...CANCER_TYPES as unknown as { value: string; label: string; category?: string }[]]}
                groupByCategory />
              <Select label="Imaging Modality" value={filterModality} onChange={(v) => { setFilterModality(v); setPage(1); }}
                options={[{ value: '', label: 'All Modalities' }, ...IMAGING_MODALITIES as unknown as { value: string; label: string }[]]} />
              <Select label="Cancer Stage" value={filterStage} onChange={(v) => { setFilterStage(v); setPage(1); }}
                options={[{ value: '', label: 'All Stages' }, ...CANCER_STAGES as unknown as { value: string; label: string }[]]} />
              <Select label="Treatment Context" value={filterTreatment} onChange={(v) => { setFilterTreatment(v); setPage(1); }}
                options={[{ value: '', label: 'All Contexts' }, ...TREATMENT_CONTEXT as unknown as { value: string; label: string }[]]} />
              <Select label="Country" value={filterCountry} onChange={(v) => { setFilterCountry(v); setPage(1); }}
                options={[{ value: '', label: 'All Countries' }, ...COUNTRIES as unknown as { value: string; label: string }[]]} />
            </div>
          )}
        </div>

        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm" style={{ color: '#6a8fa8' }}>
            {isLoading ? 'Loading…' : <><span style={{ color: '#c8dff0' }}>{total.toLocaleString()}</span> entries</>}
          </p>
          <Badge variant="cyan">CC BY 4.0 — Open for Research</Badge>
        </div>

        <div className="space-y-3">
          {isLoading && Array.from({ length: 6 }).map((_, i) => <DatasetCardSkeleton key={i} />)}
          {isError && (
            <div className="flex gap-3 p-5 rounded-2xl" style={{ background: 'rgba(255,61,90,0.05)', border: '1px solid rgba(255,61,90,0.2)' }}>
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#ff3d5a' }} />
              <div>
                <p className="font-semibold text-sm mb-1" style={{ color: '#c8dff0' }}>Could not load dataset</p>
                <p className="text-sm" style={{ color: '#6a8fa8' }}>The API may not be running yet. Start the backend or deploy to Railway to see live data.</p>
              </div>
            </div>
          )}
          {!isLoading && !isError && entries.length === 0 && (
            <div className="text-center py-20">
              <Database className="w-12 h-12 mx-auto mb-4" style={{ color: '#3d5a73' }} />
              <p className="font-semibold mb-1" style={{ color: '#c8dff0' }}>No entries yet</p>
              <p className="text-sm" style={{ color: '#6a8fa8' }}>Be the first to contribute imaging to the dataset.</p>
            </div>
          )}
          {entries.map(entry => <EntryCard key={entry.id} entry={entry} />)}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="px-4 py-2 rounded-lg text-sm transition-all"
              style={{ border: '1px solid rgba(26,58,92,0.5)', color: page === 1 ? '#3d5a73' : '#c8dff0', cursor: page === 1 ? 'not-allowed' : 'pointer' }}>
              ← Prev
            </button>
            <span className="text-sm mono" style={{ color: '#6a8fa8' }}>Page {page} of {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="px-4 py-2 rounded-lg text-sm transition-all"
              style={{ border: '1px solid rgba(26,58,92,0.5)', color: page === totalPages ? '#3d5a73' : '#c8dff0', cursor: page === totalPages ? 'not-allowed' : 'pointer' }}>
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
