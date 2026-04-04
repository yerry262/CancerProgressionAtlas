interface SkeletonProps {
  className?: string;
  height?: number | string;
  width?: number | string;
  rounded?: string;
}

export function Skeleton({ height = 20, width = '100%', rounded = '8px', className = '' }: SkeletonProps) {
  return (
    <div
      className={className}
      style={{
        height,
        width,
        borderRadius: rounded,
        background: 'linear-gradient(90deg, rgba(26,58,92,0.3) 25%, rgba(26,58,92,0.5) 50%, rgba(26,58,92,0.3) 75%)',
        backgroundSize: '200% 100%',
        animation: 'skeleton-shimmer 1.5s ease-in-out infinite',
      }}
    />
  );
}

export function SubmissionSkeleton() {
  return (
    <div className="flex items-center gap-4 p-5 rounded-2xl glass">
      <Skeleton width={48} height={48} rounded="12px" />
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <Skeleton width="40%" height={16} />
          <Skeleton width={80} height={20} rounded="999px" />
        </div>
        <Skeleton width="60%" height={12} />
      </div>
      <Skeleton width={80} height={32} rounded="8px" />
    </div>
  );
}

export function DatasetCardSkeleton() {
  return (
    <div className="flex items-center gap-4 p-5 rounded-2xl glass">
      <div className="flex-shrink-0 space-y-1">
        <Skeleton width={60} height={14} />
        <Skeleton width={80} height={12} />
      </div>
      <div className="flex-1 space-y-2">
        <div className="flex gap-2">
          <Skeleton width="35%" height={16} />
          <Skeleton width={90} height={20} rounded="999px" />
          <Skeleton width={70} height={20} rounded="999px" />
        </div>
        <Skeleton width="50%" height={12} />
      </div>
      <div className="flex gap-2">
        <Skeleton width={60} height={32} rounded="8px" />
        <Skeleton width={80} height={32} rounded="8px" />
      </div>
    </div>
  );
}

export function StatSkeleton() {
  return (
    <div className="text-center">
      <Skeleton width={80} height={36} rounded="6px" className="mx-auto mb-2" />
      <Skeleton width={100} height={12} rounded="4px" className="mx-auto" />
    </div>
  );
}

// Add CSS for shimmer animation to index.css via a style tag approach
export function SkeletonStyles() {
  return (
    <style>{`
      @keyframes skeleton-shimmer {
        0% { background-position: -200% center; }
        100% { background-position: 200% center; }
      }
    `}</style>
  );
}
