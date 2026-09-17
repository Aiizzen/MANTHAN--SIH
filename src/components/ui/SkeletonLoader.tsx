import React from 'react';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div className={`skeleton-pulse rounded-md ${className}`} />
  );
}

export function StatCardSkeleton() {
  return (
    <div className="bg-card rounded-xl border border-border shadow-card p-5">
      <Skeleton className="h-3 w-24 mb-3" />
      <Skeleton className="h-8 w-16 mb-2" />
      <Skeleton className="h-3 w-32" />
    </div>
  );
}

export function TableRowSkeleton({ cols = 6 }: { cols?: number }) {
  return (
    <tr className="border-b border-border">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={`skeleton-col-${i}`} className="px-4 py-3">
          <Skeleton className="h-4 w-full" />
        </td>
      ))}
    </tr>
  );
}

export function DetectionCardSkeleton() {
  return (
    <div className="bg-card rounded-xl border border-border shadow-card p-4">
      <div className="flex gap-3">
        <Skeleton className="w-20 h-16 rounded-lg flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-2 w-full" />
        </div>
      </div>
    </div>
  );
}