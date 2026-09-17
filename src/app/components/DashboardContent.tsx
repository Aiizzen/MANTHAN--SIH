'use client';

import React, { useState, useEffect } from 'react';
import { SURVEYS, STATS } from '@/data/mockData';
import StatCards from './StatCards';
import SurveysTable from './SurveysTable';
import { RefreshCw, Upload } from 'lucide-react';
import Link from 'next/link';

export default function DashboardContent() {
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState('');

  useEffect(() => {
    // Backend integration point: fetch surveys and stats from API
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);
    setLastUpdated(new Date()?.toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }));
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="px-6 lg:px-8 xl:px-10 py-8 max-w-screen-2xl mx-auto">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[24px] font-semibold text-foreground tracking-tight">
            Operations Dashboard
          </h1>
          <p className="text-[14px] text-muted-foreground mt-1">
            Survey queue and detection overview — RV Investigator fleet
          </p>
        </div>
        <div className="flex items-center gap-3">
          {lastUpdated && (
            <span className="text-[12px] text-muted-foreground flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
              Updated {lastUpdated}
            </span>
          )}
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-card text-[13px] font-medium text-foreground hover:bg-muted transition-colors duration-150">
            <RefreshCw size={14} />
            Refresh
          </button>
          <Link
            href="/upload-new-survey"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-[13px] font-semibold hover:bg-secondary transition-colors duration-150 shadow-sm"
          >
            <Upload size={14} />
            Upload Survey
          </Link>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <StatCards stats={STATS} loading={loading} />

      {/* Surveys Table */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-[18px] font-semibold text-foreground">Recent Surveys</h2>
            <p className="text-[13px] text-muted-foreground mt-0.5">
              {SURVEYS?.length} surveys processed — sorted by upload date
            </p>
          </div>
        </div>
        <SurveysTable surveys={SURVEYS} loading={loading} />
      </div>
    </div>
  );
}