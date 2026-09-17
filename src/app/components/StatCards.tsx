'use client';

import React from 'react';
import { FileSearch, Clock4, ShieldAlert, CheckCircle2, TrendingUp, AlertTriangle } from 'lucide-react';
import { StatCardSkeleton } from '@/components/ui/SkeletonLoader';

interface StatsData {
  totalSurveys: number;
  pendingReview: number;
  highConfidenceHazards: number;
  avgProcessingTime: string;
  totalDetections: number;
  falsePositiveRate: number;
}

interface StatCardsProps {
  stats: StatsData;
  loading: boolean;
}

export default function StatCards({ stats, loading }: StatCardsProps) {
  if (loading || !stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardSkeleton key={`stat-skeleton-${i}`} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-4 fade-in">
      {/* Total Surveys — hero card spans 1 col */}
      <div className="bg-card rounded-xl border border-border shadow-card p-5 hover:shadow-card-hover transition-shadow duration-200">
        <div className="flex items-start justify-between mb-3">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <FileSearch size={18} className="text-primary" />
          </div>
          <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Total Surveys</span>
        </div>
        <div className="mt-1">
          <span className="text-[36px] font-bold text-foreground font-tabular leading-none">{stats.totalSurveys}</span>
        </div>
        <div className="flex items-center gap-1 mt-2">
          <TrendingUp size={12} className="text-green-600" />
          <span className="text-[12px] text-muted-foreground">+3 this week</span>
        </div>
      </div>

      {/* Pending Review — amber alert state */}
      <div className="bg-card rounded-xl border border-amber-200 shadow-card p-5 hover:shadow-card-hover transition-shadow duration-200 relative overflow-hidden">
        <div className="absolute inset-0 bg-amber-50/60 pointer-events-none rounded-xl" />
        <div className="relative">
          <div className="flex items-start justify-between mb-3">
            <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center">
              <AlertTriangle size={18} className="text-amber-600" />
            </div>
            <span className="text-[11px] font-medium text-amber-700 uppercase tracking-wide">Pending Review</span>
          </div>
          <div className="mt-1">
            <span className="text-[36px] font-bold text-amber-700 font-tabular leading-none">{stats.pendingReview}</span>
          </div>
          <div className="flex items-center gap-1 mt-2">
            <span className="text-[12px] text-amber-600 font-medium">Requires operator action</span>
          </div>
        </div>
      </div>

      {/* High-Confidence Hazards */}
      <div className="bg-card rounded-xl border border-border shadow-card p-5 hover:shadow-card-hover transition-shadow duration-200">
        <div className="flex items-start justify-between mb-3">
          <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center">
            <ShieldAlert size={18} className="text-red-600" />
          </div>
          <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">High-Conf. Hazards</span>
        </div>
        <div className="mt-1">
          <span className="text-[36px] font-bold text-foreground font-tabular leading-none">{stats.highConfidenceHazards}</span>
        </div>
        <div className="flex items-center gap-1 mt-2">
          <span className="text-[12px] text-muted-foreground">Confidence &gt;80% confirmed</span>
        </div>
      </div>

      {/* Avg Processing Time */}
      <div className="bg-card rounded-xl border border-border shadow-card p-5 hover:shadow-card-hover transition-shadow duration-200">
        <div className="flex items-start justify-between mb-3">
          <div className="w-9 h-9 rounded-lg bg-secondary/10 flex items-center justify-center">
            <Clock4 size={18} className="text-secondary" />
          </div>
          <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Avg. Process Time</span>
        </div>
        <div className="mt-1">
          <span className="text-[28px] font-bold text-foreground font-tabular leading-none">{stats.avgProcessingTime}</span>
        </div>
        <div className="flex items-center gap-1 mt-2">
          <CheckCircle2 size={12} className="text-green-600" />
          <span className="text-[12px] text-muted-foreground">Pipeline nominal</span>
        </div>
      </div>
    </div>
  );
}