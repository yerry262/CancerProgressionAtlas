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
            background: 'rgba(16, 32, 56, 0.8)',
            border: value ? '1px solid rgba(0, 212, 255, 0.4)' : '1px solid rgba(26, 58, 92, 0.8)',
            color: value ? '#c8dff0' : '#3d5a73',
            boxShadow: value ? '0 0 0 1px rgba(0, 212, 255, 0.1) inset' : 'none',
          }}
        >
          <option value="" disabled>{placeholder}</option>
          {grouped
            ? Object.entries(grouped).map(([cat, opts]) => (
                <optgroup key={cat} label={cat}>
                  {opts.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </optgroup>
              ))
            : options.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
        </select>
        <ChevronDown
          className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
          style={{ color: '#3d5a73' }}
        />
      </div>
      {hint && <p className="text-xs" style={{ color: '#3d5a73' }}>{hint}</p>}
    </div>
  );
}
