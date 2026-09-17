'use client';

import React from 'react';
import type { Detection } from '@/data/mockData';
import { DetectionStatusBadge } from '@/components/ui/StatusBadge';
import ConfidenceBar from '@/components/ui/ConfidenceBar';
import { MapPin, Ruler } from 'lucide-react';

const CLASS_COLORS: Record<string, string> = {
  'Shipwreck': '#065A82',
  'Pipe': '#1C7293',
  'Cylinder': '#B14C15',
  'Entangled Net': '#1C8C5A',
  'Unknown Object': '#6B7280',
};

const CLASS_BG: Record<string, string> = {
  'Shipwreck': 'bg-[#065A82]/10',
  'Pipe': 'bg-[#1C7293]/10',
  'Cylinder': 'bg-amber-50',
  'Entangled Net': 'bg-green-50',
  'Unknown Object': 'bg-gray-50',
};

interface DetectionCardListProps {
  detections: Detection[];
  selectedId: string | null;
  hoveredId: string | null;
  onCardClick: (id: string) => void;
  onCardHover: (id: string | null) => void;
}

export default function DetectionCardList({
  detections,
  selectedId,
  hoveredId,
  onCardClick,
  onCardHover,
}: DetectionCardListProps) {
  return (
    <>
      {detections.map((det) => {
        const isSelected = selectedId === det.id;
        const isHovered = hoveredId === det.id;
        const classColor = CLASS_COLORS[det.classification] ?? '#6B7280';
        const classBg = CLASS_BG[det.classification] ?? 'bg-gray-50';

        return (
          <div
            key={det.id}
            onClick={() => onCardClick(det.id)}
            onMouseEnter={() => onCardHover(det.id)}
            onMouseLeave={() => onCardHover(null)}
            className={`
              bg-card rounded-xl border cursor-pointer transition-all duration-150
              ${isSelected
                ? 'border-primary shadow-card-hover ring-2 ring-primary/20'
                : isHovered
                ? 'border-primary/40 shadow-card-hover'
                : 'border-border shadow-card hover:border-primary/30 hover:shadow-card-hover'
              }
            `}
          >
            <div className="p-3.5">
              {/* Header row */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span
                    className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                    style={{ backgroundColor: classColor }}
                  >
                    {det.index}
                  </span>
                  <div>
                    <p className="text-[13px] font-semibold text-foreground leading-tight">{det.classification}</p>
                    <p className="text-[11px] text-muted-foreground font-mono">{det.id}</p>
                  </div>
                </div>
                <DetectionStatusBadge status={det.status} />
              </div>

              {/* Thumbnail + details */}
              <div className="flex gap-3">
                {/* Sonar thumbnail with bounding box */}
                <div
                  className="w-[80px] h-[64px] rounded-lg flex-shrink-0 relative overflow-hidden"
                  style={{ backgroundColor: det.thumbnailColor }}
                >
                  {/* Simulated sonar scan lines */}
                  {[20, 35, 50, 65, 80].map((pct) => (
                    <div
                      key={`scan-${det.id}-${pct}`}
                      className="absolute w-full"
                      style={{
                        top: `${pct}%`,
                        height: '1px',
                        background: `rgba(255,255,255,${0.04 + pct * 0.001})`,
                      }}
                    />
                  ))}
                  {/* Bounding box overlay */}
                  <div
                    className="bounding-box-overlay"
                    style={{
                      top: det.bboxTop,
                      left: det.bboxLeft,
                      width: det.bboxWidth,
                      height: det.bboxHeight,
                      borderColor: det.bboxColor,
                    }}
                  />
                  {/* Corner markers */}
                  <div
                    className="absolute w-2 h-2 border-t-2 border-l-2 rounded-sm"
                    style={{
                      top: det.bboxTop,
                      left: det.bboxLeft,
                      borderColor: det.bboxColor,
                    }}
                  />
                </div>

                {/* Metadata */}
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div>
                    <ConfidenceBar value={det.confidence} height="h-1.5" />
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <MapPin size={10} className="flex-shrink-0" />
                    <span className="font-mono truncate">{det.lat.toFixed(4)}°, {det.lng.toFixed(4)}°</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <Ruler size={10} className="flex-shrink-0" />
                    <span>{det.estimatedLength} × {det.estimatedWidth} · {det.depth}</span>
                  </div>
                </div>
              </div>

              {/* Note preview */}
              {det.note && (
                <div className="mt-2.5 pt-2.5 border-t border-border">
                  <p className="text-[11px] text-muted-foreground italic truncate">"{det.note}"</p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </>
  );
}