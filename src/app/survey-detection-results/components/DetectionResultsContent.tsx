'use client';

import React, { useState, useEffect } from 'react';
import { DETECTIONS, SURVEYS } from '@/data/mockData';
import type { Detection, DetectionClass, DetectionStatus } from '@/data/mockData';
import DetectionFilterBar from './DetectionFilterBar';
import DetectionCardList from './DetectionCardList';
import DetectionDrawer from './DetectionDrawer';
import dynamic from 'next/dynamic';
import { DetectionCardSkeleton } from '@/components/ui/SkeletonLoader';
import { FileSearch } from 'lucide-react';

// Leaflet requires browser — dynamic import with ssr: false
const DetectionMap = dynamic(() => import('./DetectionMap'), { ssr: false });

type SortOption = 'confidence_desc' | 'confidence_asc' | 'index_asc';

export default function DetectionResultsContent() {
  const [loading, setLoading] = useState(true);
  const [detections, setDetections] = useState<Detection[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filterClass, setFilterClass] = useState<DetectionClass | 'All'>('All');
  const [filterStatus, setFilterStatus] = useState<DetectionStatus | 'All'>('All');
  const [sortOption, setSortOption] = useState<SortOption>('index_asc');
  const [filterMinConf, setFilterMinConf] = useState(0);

  const survey = SURVEYS.find((s) => s.id === 'survey-001')!;

  useEffect(() => {
    // Backend integration point: fetch detections for survey from API
    const t = setTimeout(() => {
      setDetections(DETECTIONS);
      setLoading(false);
    }, 900);
    return () => clearTimeout(t);
  }, []);

  const updateDetectionStatus = (id: string, status: DetectionStatus, note?: string) => {
    setDetections((prev) =>
      prev.map((d) =>
        d.id === id ? { ...d, status, note: note !== undefined ? note : d.note } : d
      )
    );
  };

  const filtered = detections
    .filter((d) => filterClass === 'All' || d.classification === filterClass)
    .filter((d) => filterStatus === 'All' || d.status === filterStatus)
    .filter((d) => d.confidence >= filterMinConf);

  const sorted = [...filtered].sort((a, b) => {
    if (sortOption === 'confidence_desc') return b.confidence - a.confidence;
    if (sortOption === 'confidence_asc') return a.confidence - b.confidence;
    return a.index - b.index;
  });

  const selectedDetection = detections.find((d) => d.id === selectedId) ?? null;

  const handleCardClick = (id: string) => {
    setSelectedId(id);
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setTimeout(() => setSelectedId(null), 200);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Page Header */}
      <div className="px-6 lg:px-8 py-5 border-b border-border bg-card flex-shrink-0">
        <div className="flex items-start justify-between max-w-screen-2xl mx-auto">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[12px] text-muted-foreground font-mono">survey-001</span>
              <span className="w-1 h-1 rounded-full bg-border" />
              <span className="text-[12px] text-muted-foreground">{survey.vessel}</span>
              <span className="w-1 h-1 rounded-full bg-border" />
              <span className="text-[12px] text-muted-foreground">{survey.areaCovered}</span>
            </div>
            <h1 className="text-[20px] font-semibold text-foreground tracking-tight truncate max-w-2xl">
              {survey.filename}
            </h1>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[12px] text-muted-foreground">
              {detections.filter((d) => d.status === 'pending').length} pending ·{' '}
              {detections.filter((d) => d.status === 'confirmed').length} confirmed ·{' '}
              {detections.filter((d) => d.status === 'false_positive' || d.status === 'dismissed').length} dismissed
            </span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="px-6 lg:px-8 py-3 border-b border-border bg-card flex-shrink-0">
        <div className="max-w-screen-2xl mx-auto">
          <DetectionFilterBar
            filterClass={filterClass}
            filterStatus={filterStatus}
            sortOption={sortOption}
            filterMinConf={filterMinConf}
            onFilterClass={setFilterClass}
            onFilterStatus={setFilterStatus}
            onSortOption={setSortOption}
            onFilterMinConf={setFilterMinConf}
            totalCount={detections.length}
            filteredCount={sorted.length}
          />
        </div>
      </div>

      {/* Main Split Layout */}
      <div className="flex flex-1 overflow-hidden max-w-screen-2xl mx-auto w-full px-6 lg:px-8 py-4 gap-4">
        {/* Map — left panel */}
        <div className="flex-1 min-w-0 rounded-xl overflow-hidden border border-border shadow-card bg-muted relative">
          {loading ? (
            <div className="w-full h-full flex items-center justify-center bg-muted">
              <div className="text-center">
                <div className="skeleton-pulse w-full h-full absolute inset-0 rounded-xl" />
                <FileSearch size={32} className="text-muted-foreground opacity-30 relative z-10" />
              </div>
            </div>
          ) : (
            <DetectionMap
              detections={sorted}
              selectedId={selectedId}
              hoveredId={hoveredId}
              onPinClick={handleCardClick}
            />
          )}
        </div>

        {/* Detection Cards — right panel */}
        <div className="w-[360px] xl:w-[400px] 2xl:w-[420px] flex-shrink-0 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <DetectionCardSkeleton key={`card-skeleton-${i}`} />
              ))
            ) : sorted.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-16 text-center">
                <FileSearch size={36} className="text-muted-foreground opacity-40 mb-3" />
                <p className="text-[15px] font-semibold text-foreground">No contacts match filters</p>
                <p className="text-[13px] text-muted-foreground mt-1 max-w-xs">
                  Adjust confidence threshold or classification filter to see results.
                </p>
              </div>
            ) : (
              <DetectionCardList
                detections={sorted}
                selectedId={selectedId}
                hoveredId={hoveredId}
                onCardClick={handleCardClick}
                onCardHover={setHoveredId}
              />
            )}
          </div>
        </div>
      </div>

      {/* Detail Drawer */}
      {drawerOpen && selectedDetection && (
        <DetectionDrawer
          detection={selectedDetection}
          onClose={handleDrawerClose}
          onUpdateStatus={updateDetectionStatus}
        />
      )}
    </div>
  );
}