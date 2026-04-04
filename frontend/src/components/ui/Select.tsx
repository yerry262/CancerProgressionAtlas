import { ChevronDown } from 'lucide-react';

interface Option {
  value: string;
  label: string;
  category?: string;
  description?: string;
}

interface SelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  required?: boolean;
  hint?: string;
  groupByCategory?: boolean;
}

export default function Select({
  label,
  value,
  onChange,
  options,
  placeholder = 'Select…',
  required,
  hint,
  groupByCategory,
}: SelectProps) {
  const grouped = groupByCategory
    ? options.reduce<Record<string, Option[]>>((acc, opt) => {
        const cat = opt.category ?? 'Other';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(opt);
        return acc;
      }, {})
    : null;

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#6a8fa8' }}>
        {label} {required && <span style={{ color: '#00d4ff' }}>*</span>}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          className="w-full appearance-none px-4 py-3 pr-10 rounded-xl text-sm transition-all duration-200 cursor-pointer"
          style={{
            background: '#e8f0f7',
            border: value ? '1px solid rgba(0, 212, 255, 0.5)' : '1px solid #b0c8de',
            color: value ? '#0d1a2e' : '#6a8fa8',
            boxShadow: value ? '0 0 0 1px rgba(0, 212, 255, 0.08) inset' : 'none',
          }}
        >
          <option value="" disabled style={{ color: '#6a8fa8', background: '#e8f0f7' }}>{placeholder}</option>
          {grouped
            ? Object.entries(grouped).map(([cat, opts]) => (
                <optgroup key={cat} label={cat} style={{ color: '#0d1a2e', background: '#e8f0f7' }}>
                  {opts.map((opt) => (
                    <option key={opt.value} value={opt.value} style={{ color: '#0d1a2e', background: '#e8f0f7' }}>{opt.label}</option>
                  ))}
                </optgroup>
              ))
            : options.map((opt) => (
                <option key={opt.value} value={opt.value} style={{ color: '#0d1a2e', background: '#e8f0f7' }}>{opt.label}</option>
              ))}
        </select>
        <ChevronDown
          className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
          style={{ color: '#0d1a2e' }}
        />
      </div>
      {hint && <p className="text-xs" style={{ color: '#3d5a73' }}>{hint}</p>}
    </div>
  );
}
