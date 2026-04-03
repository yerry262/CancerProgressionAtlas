interface BadgeProps {
  children: React.ReactNode;
  variant?: 'cyan' | 'teal' | 'blue' | 'danger' | 'success' | 'warning' | 'muted';
}

const styles: Record<string, { color: string; background: string; border: string }> = {
  cyan: {
    color: '#00d4ff',
    background: 'rgba(0, 212, 255, 0.1)',
    border: '1px solid rgba(0, 212, 255, 0.25)',
  },
  teal: {
    color: '#00ffcc',
    background: 'rgba(0, 255, 204, 0.1)',
    border: '1px solid rgba(0, 255, 204, 0.25)',
  },
  blue: {
    color: '#6699ff',
    background: 'rgba(0, 102, 255, 0.12)',
    border: '1px solid rgba(0, 102, 255, 0.25)',
  },
  danger: {
    color: '#ff3d5a',
    background: 'rgba(255, 61, 90, 0.1)',
    border: '1px solid rgba(255, 61, 90, 0.25)',
  },
  success: {
    color: '#00e676',
    background: 'rgba(0, 230, 118, 0.1)',
    border: '1px solid rgba(0, 230, 118, 0.25)',
  },
  warning: {
    color: '#ffab00',
    background: 'rgba(255, 171, 0, 0.1)',
    border: '1px solid rgba(255, 171, 0, 0.25)',
  },
  muted: {
    color: '#6a8fa8',
    background: 'rgba(106, 143, 168, 0.08)',
    border: '1px solid rgba(26, 58, 92, 0.5)',
  },
};

export default function Badge({ children, variant = 'muted' }: BadgeProps) {
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mono"
      style={styles[variant]}
    >
      {children}
    </span>
  );
}
