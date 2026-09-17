import React from 'react';

interface ConfidenceBarProps {
  value: number;
  showLabel?: boolean;
  height?: string;
}

export default function ConfidenceBar({ value, showLabel = true, height = 'h-1.5' }: ConfidenceBarProps) {
  const colorClass =
    value >= 80
      ? 'confidence-bar-high'
      : value >= 50
      ? 'confidence-bar-mid' :'confidence-bar-low';

  const textColorClass =
    value >= 80
      ? 'text-[#1C8C5A]'
      : value >= 50
      ? 'text-[#B14C15]'
      : 'text-red-600';

  return (
    <div className="flex items-center gap-2">
      <div className={`flex-1 bg-muted rounded-full ${height} overflow-hidden`}>
        <div
          className={`${height} rounded-full transition-all duration-300 ${colorClass}`}
          style={{ width: `${value}%` }}
        />
      </div>
      {showLabel && (
        <span className={`text-[12px] font-semibold font-tabular w-8 text-right ${textColorClass}`}>
          {value}%
        </span>
      )}
    </div>
  );
}