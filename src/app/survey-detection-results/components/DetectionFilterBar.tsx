'use client';

import React from 'react';
import type { DetectionClass, DetectionStatus } from '@/data/mockData';
import { SlidersHorizontal, ArrowUpDown } from 'lucide-react';

const CLASSES: Array<DetectionClass | 'All'> = [
  'All', 'Shipwreck', 'Pipe', 'Cylinder', 'Entangled Net', 'Unknown Object',
];

const STATUSES: Array<DetectionStatus | 'All'> = [
  'All', 'pending', 'confirmed', 'false_positive', 'dismissed',
];

const STATUS_LABELS: Record<DetectionStatus | 'All', string> = {
  All: 'All Status',
  pending: 'Pending',
  confirmed: 'Confirmed',
  false_positive: 'False Positive',
  dismissed: 'Dismissed',
};

type SortOption = 'confidence_desc' | 'confidence_asc' | 'index_asc';

interface DetectionFilterBarProps {
  filterClass: DetectionClass | 'All';
  filterStatus: DetectionStatus | 'All';
  sortOption: SortOption;
  filterMinConf: number;
  onFilterClass: (v: DetectionClass | 'All') => void;
  onFilterStatus: (v: DetectionStatus | 'All') => void;
  onSortOption: (v: SortOption) => void;
  onFilterMinConf: (v: number) => void;
  totalCount: number;
  filteredCount: number;
}

export default function DetectionFilterBar({
  filterClass,
  filterStatus,
  sortOption,
  filterMinConf,
  onFilterClass,
  onFilterStatus,
  onSortOption,
  onFilterMinConf,
  totalCount,
  filteredCount,
}: DetectionFilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Class filter chips */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {CLASSES.map((cls) => (
          <button
            key={`chip-${cls}`}
            suppressHydrationWarning
            onClick={() => onFilterClass(cls)}
            className={`px-3 py-1 rounded-full text-[12px] font-medium transition-all duration-150 border ${
              filterClass === cls
                ? 'bg-primary text-white border-primary' :'bg-muted text-muted-foreground border-border hover:border-primary/50 hover:text-foreground'
            }`}
          >
            {cls}
          </button>
        ))}
      </div>

      <div className="w-px h-5 bg-border mx-1" />

      {/* Status filter */}
      <div className="flex items-center gap-1.5">
        <SlidersHorizontal size={13} className="text-muted-foreground" />
        <select
          suppressHydrationWarning
          value={filterStatus}
          onChange={(e) => onFilterStatus(e.target.value as DetectionStatus | 'All')}
          className="text-[12px] bg-muted border border-input rounded-lg px-2.5 py-1.5 text-foreground focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
        >
          {STATUSES.map((s) => (
            <option key={`status-opt-${s}`} value={s}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </select>
      </div>

      {/* Sort */}
      <div className="flex items-center gap-1.5">
        <ArrowUpDown size={13} className="text-muted-foreground" />
        <select
          suppressHydrationWarning
          value={sortOption}
          onChange={(e) => onSortOption(e.target.value as SortOption)}
          className="text-[12px] bg-muted border border-input rounded-lg px-2.5 py-1.5 text-foreground focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
        >
          <option value="index_asc">Contact #</option>
          <option value="confidence_desc">Confidence ↓</option>
          <option value="confidence_asc">Confidence ↑</option>
        </select>
      </div>

      {/* Confidence threshold */}
      <div className="flex items-center gap-2 ml-1">
        <span className="text-[12px] text-muted-foreground whitespace-nowrap">Min conf:</span>
        <input
          type="range"
          min={0}
          max={90}
          step={10}
          value={filterMinConf}
          onChange={(e) => onFilterMinConf(Number(e.target.value))}
          className="w-20 accent-primary cursor-pointer"
        />
        <span className="text-[12px] font-semibold font-tabular text-foreground w-8">{filterMinConf}%</span>
      </div>

      {/* Count */}
      <span className="ml-auto text-[12px] text-muted-foreground whitespace-nowrap">
        {filteredCount} of {totalCount} contacts
      </span>
    </div>
  );
}