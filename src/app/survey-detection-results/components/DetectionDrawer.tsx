'use client';

import React, { useState, useRef, useEffect } from 'react';
import type { Detection, DetectionStatus } from '@/data/mockData';
import { DetectionStatusBadge } from '@/components/ui/StatusBadge';
import ConfidenceBar from '@/components/ui/ConfidenceBar';
import { X, CheckCircle2, XCircle, MapPin, Ruler, Layers, Clock, MessageSquare, AlertTriangle,  } from 'lucide-react';
import Icon from '@/components/ui/AppIcon';


const CLASS_COLORS: Record<string, string> = {
  'Shipwreck': '#065A82',
  'Pipe': '#1C7293',
  'Cylinder': '#B14C15',
  'Entangled Net': '#1C8C5A',
  'Unknown Object': '#6B7280',
};

interface DetectionDrawerProps {
  detection: Detection;
  onClose: () => void;
  onUpdateStatus: (id: string, status: DetectionStatus, note?: string) => void;
}

export default function DetectionDrawer({ detection, onClose, onUpdateStatus }: DetectionDrawerProps) {
  const [note, setNote] = useState(detection.note);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const classColor = CLASS_COLORS[detection.classification] ?? '#6B7280';

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return `${d.getDate().toString().padStart(2, '0')} Sep ${d.getFullYear()} ${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')} UTC`;
  };

  const handleAction = (status: DetectionStatus) => {
    setSaving(true);
    // Backend integration point: PATCH /api/detections/{id}/status
    setTimeout(() => {
      onUpdateStatus(detection.id, status, note);
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 600);
  };

  const handleSaveNote = () => {
    setSaving(true);
    // Backend integration point: PATCH /api/detections/{id}/note
    setTimeout(() => {
      onUpdateStatus(detection.id, detection.status, note);
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 400);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-foreground/20 z-40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-[460px] xl:w-[500px] bg-card border-l border-border shadow-drawer z-50 flex flex-col drawer-slide-in overflow-hidden">
        {/* Drawer Header */}
        <div className="flex items-start justify-between px-5 py-4 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-[14px] font-bold"
              style={{ backgroundColor: classColor }}
            >
              {detection.index}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-[16px] font-semibold text-foreground">{detection.classification}</h2>
                <DetectionStatusBadge status={detection.status} />
              </div>
              <p className="text-[12px] font-mono text-muted-foreground">{detection.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-150"
          >
            <X size={18} />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto">
          {/* Sonar thumbnail — enlarged */}
          <div
            className="w-full relative overflow-hidden"
            style={{ height: 200, backgroundColor: detection.thumbnailColor }}
          >
            {/* Scan lines */}
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={`scan-drawer-${i}`}
                className="absolute w-full"
                style={{
                  top: `${(i + 1) * 5}%`,
                  height: '1px',
                  background: `rgba(255,255,255,${0.03 + i * 0.003})`,
                }}
              />
            ))}
            {/* Vertical swath variation */}
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={`swath-${i}`}
                className="absolute h-full"
                style={{
                  left: `${i * 13}%`,
                  width: '1px',
                  background: 'rgba(255,255,255,0.02)',
                }}
              />
            ))}
            {/* Bounding box */}
            <div
              className="bounding-box-overlay"
              style={{
                top: detection.bboxTop,
                left: detection.bboxLeft,
                width: detection.bboxWidth,
                height: detection.bboxHeight,
                borderColor: detection.bboxColor,
                borderWidth: '2px',
              }}
            />
            {/* Label inside bbox */}
            <div
              className="absolute text-[10px] font-bold text-white px-1.5 py-0.5 rounded"
              style={{
                top: detection.bboxTop,
                left: detection.bboxLeft,
                backgroundColor: detection.bboxColor,
                transform: 'translateY(-100%)',
              }}
            >
              {detection.classification} {detection.confidence}%
            </div>
            {/* Sonar metadata overlay */}
            <div className="absolute bottom-2 left-3 right-3 flex items-end justify-between">
              <span className="text-[10px] text-white/60 font-mono">SS SWATH L · {detection.depth}</span>
              <span className="text-[10px] text-white/60 font-mono">Gain: AUTO · Range: 50m</span>
            </div>
          </div>

          {/* Confidence */}
          <div className="px-5 py-4 border-b border-border">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              AI Confidence Score
            </p>
            <ConfidenceBar value={detection.confidence} height="h-2.5" />
            <p className="text-[12px] text-muted-foreground mt-1.5">
              {detection.confidence >= 80
                ? 'High confidence — strong spectral and morphological match for classification'
                : detection.confidence >= 50
                ? 'Moderate confidence — review recommended before actioning'
                : 'Low confidence — significant ambiguity, manual inspection advised'}
            </p>
          </div>

          {/* Metadata Grid */}
          <div className="px-5 py-4 border-b border-border">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Contact Metadata
            </p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: MapPin, label: 'Latitude', value: `${detection.lat.toFixed(6)}°` },
                { icon: MapPin, label: 'Longitude', value: `${detection.lng.toFixed(6)}°` },
                { icon: Layers, label: 'Depth', value: detection.depth },
                { icon: Clock, label: 'Detected', value: formatDate(detection.detectedAt) },
                { icon: Ruler, label: 'Est. Length', value: detection.estimatedLength },
                { icon: Ruler, label: 'Est. Width', value: detection.estimatedWidth },
              ].map(({ icon: Icon, label, value }) => (
                <div key={`meta-${label}`} className="bg-muted rounded-lg p-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Icon size={12} className="text-muted-foreground" />
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {label}
                    </span>
                  </div>
                  <p className="text-[13px] font-semibold text-foreground font-mono">{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Operator Note */}
          <div className="px-5 py-4 border-b border-border">
            <div className="flex items-center gap-1.5 mb-2">
              <MessageSquare size={13} className="text-muted-foreground" />
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Operator Note
              </p>
            </div>
            <textarea
              ref={textareaRef}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note about this contact (e.g. cross-referenced with chart datum, requires dive survey)"
              rows={3}
              className="w-full text-[13px] bg-muted border border-input rounded-lg px-3 py-2.5 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none transition-all duration-150"
            />
            <button
              onClick={handleSaveNote}
              disabled={saving}
              className="mt-2 px-3 py-1.5 text-[12px] font-medium bg-muted border border-border rounded-lg text-foreground hover:bg-border transition-all duration-150 disabled:opacity-50"
            >
              {saving ? 'Saving…' : saved ? '✓ Saved' : 'Save Note'}
            </button>
          </div>

          {/* Warning for low confidence */}
          {detection.confidence < 50 && detection.status === 'pending' && (
            <div className="mx-5 mt-4 flex items-start gap-2.5 p-3 bg-amber-50 border border-amber-200 rounded-xl">
              <AlertTriangle size={15} className="text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-[12px] text-amber-700">
                Low confidence detection. Recommend cross-referencing with original sonar imagery before confirming.
              </p>
            </div>
          )}
        </div>

        {/* Drawer Footer — Operator Actions */}
        <div className="px-5 py-4 border-t border-border flex-shrink-0 bg-card">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Operator Decision
          </p>
          {detection.status === 'confirmed' || detection.status === 'false_positive' || detection.status === 'dismissed' ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2 p-3 bg-muted rounded-xl border border-border">
                <DetectionStatusBadge status={detection.status} />
                <span className="text-[13px] text-muted-foreground">Decision recorded</span>
              </div>
              <button
                onClick={() => onUpdateStatus(detection.id, 'pending', note)}
                className="w-full py-2.5 text-[13px] font-medium text-muted-foreground border border-border rounded-xl hover:bg-muted transition-colors duration-150"
              >
                Reset to Pending
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleAction('confirmed')}
                disabled={saving}
                className="flex items-center justify-center gap-2 py-3 bg-primary text-white text-[13px] font-semibold rounded-xl hover:bg-secondary active:scale-95 transition-all duration-150 disabled:opacity-60"
              >
                {saving ? (
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <CheckCircle2 size={15} />
                )}
                Confirm Hazard
              </button>
              <button
                onClick={() => handleAction('false_positive')}
                disabled={saving}
                className="flex items-center justify-center gap-2 py-3 bg-muted border border-border text-[13px] font-semibold text-muted-foreground rounded-xl hover:bg-red-50 hover:border-red-200 hover:text-red-600 active:scale-95 transition-all duration-150 disabled:opacity-60"
              >
                <XCircle size={15} />
                False Positive
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}