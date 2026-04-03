import { type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  error?: string;
}

export default function Input({ label, hint, error, required, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#6a8fa8' }}>
        {label} {required && <span style={{ color: '#00d4ff' }}>*</span>}
      </label>
      <input
        {...props}
        required={required}
        className="px-4 py-3 rounded-xl text-sm transition-all duration-200"
        style={{
          background: 'rgba(16, 32, 56, 0.8)',
          border: error
            ? '1px solid rgba(255, 61, 90, 0.6)'
            : '1px solid rgba(26, 58, 92, 0.8)',
          color: '#c8dff0',
          outline: 'none',
        }}
        onFocus={(e) => {
          e.currentTarget.style.border = '1px solid rgba(0, 212, 255, 0.5)';
          e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0, 212, 255, 0.06)';
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          e.currentTarget.style.border = error
            ? '1px solid rgba(255, 61, 90, 0.6)'
            : '1px solid rgba(26, 58, 92, 0.8)';
          e.currentTarget.style.boxShadow = 'none';
          props.onBlur?.(e);
        }}
      />
      {hint && !error && <p className="text-xs" style={{ color: '#3d5a73' }}>{hint}</p>}
      {error && <p className="text-xs" style={{ color: '#ff3d5a' }}>{error}</p>}
    </div>
  );
}
