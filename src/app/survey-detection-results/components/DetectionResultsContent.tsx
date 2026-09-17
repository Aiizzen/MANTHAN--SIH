'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock3,
} from 'lucide-react';

type DetectionStatus =
  | 'pending'
  | 'confirmed'
  | 'false_positive';

interface Detection {
  id: string;
  surveyId: string;
  index: number;
  classification: string;
  confidence: number;
  lat: number;
  lng: number;
  depth: string;
  estimatedLength: string;
  estimatedWidth: string;
  status: DetectionStatus;
  note: string;
  thumbnailColor?: string;
  bboxTop?: string;
  bboxLeft?: string;
  bboxWidth?: string;
  bboxHeight?: string;
  bboxColor?: string;
  detectedAt: string;
}

interface Survey {
  id: string;
  filename: string;
  uploadDate: string;
  areaCovered: string;
  contactsDetected: number;
  status: string;
  processingTime: string;
  vessel: string;
  operator: string;
}

interface LiveReport {
  survey: Survey;
  detections: Detection[];
}

export default function DetectionResultsContent() {
  const router = useRouter();

  const [survey, setSurvey] = useState<Survey | null>(null);
  const [detections, setDetections] = useState<Detection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filter, setFilter] = useState<
    'all' | 'pending' | 'confirmed' | 'false_positive'
  >('all');

  useEffect(() => {
    try {
      const raw = localStorage.getItem(
        'sonarshield_last_results'
      );

      console.log(
        'SONARSHIELD RESULTS RAW:',
        raw
      );

      if (!raw) {
        setError(
          'No uploaded survey result found. Please upload a survey first.'
        );
        return;
      }

      const parsed = JSON.parse(raw) as LiveReport;

      if (
        !parsed ||
        !parsed.survey ||
        !parsed.survey.filename ||
        !Array.isArray(parsed.detections)
      ) {
        throw new Error(
          'Invalid detection result received.'
        );
      }

      console.log(
        'SONARSHIELD LIVE SURVEY:',
        parsed.survey
      );

      console.log(
        'SONARSHIELD LIVE DETECTIONS:',
        parsed.detections
      );

      setSurvey(parsed.survey);
      setDetections(parsed.detections);
    } catch (err) {
      console.error(
        'SONARSHIELD RESULTS ERROR:',
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load detection results.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const filteredDetections = useMemo(() => {
    if (filter === 'all') {
      return detections;
    }

    return detections.filter(
      (detection) => detection.status === filter
    );
  }, [detections, filter]);

  const pendingCount = detections.filter(
    (detection) => detection.status === 'pending'
  ).length;

  const confirmedCount = detections.filter(
    (detection) => detection.status === 'confirmed'
  ).length;

  const falsePositiveCount = detections.filter(
    (detection) => detection.status === 'false_positive'
  ).length;

  if (loading) {
    return (
      <div className="px-6 lg:px-8 xl:px-10 py-8 max-w-screen-2xl mx-auto">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              Loading detection results…
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !survey) {
    return (
      <div className="px-6 lg:px-8 xl:px-10 py-8 max-w-screen-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <button
            type="button"
            onClick={() =>
              router.push('/upload-new-survey')
            }
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <ArrowLeft size={18} />
          </button>

          <div>
            <h1 className="text-[24px] font-semibold text-foreground">
              Detection Results
            </h1>

            <p className="text-[14px] text-muted-foreground mt-1">
              No live survey loaded
            </p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-8 text-center">
          <AlertTriangle
            size={32}
            className="mx-auto mb-3 text-amber-600"
          />

          <p className="text-sm text-foreground font-medium">
            {error ||
              'No detection result is available.'}
          </p>

          <button
            type="button"
            onClick={() =>
              router.push('/upload-new-survey')
            }
            className="mt-5 px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold"
          >
            Upload a Survey
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 lg:px-8 xl:px-10 py-8 max-w-screen-2xl mx-auto">

      <div className="flex items-center gap-3 mb-6">
        <button
          type="button"
          onClick={() =>
            router.push('/upload-new-survey')
          }
          className="p-2 rounded-lg hover:bg-muted transition-colors"
        >
          <ArrowLeft size={18} />
        </button>

        <div className="min-w-0">
          <h1 className="text-[24px] font-semibold text-foreground">
            Detection Results
          </h1>

          <p className="text-[14px] text-muted-foreground mt-1 truncate">
            {survey.filename}
          </p>
        </div>

        <span className="ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-50 border border-green-200 text-green-700 text-[12px] font-medium whitespace-nowrap">
          <CheckCircle2 size={14} />
          Live Pipeline Result
        </span>
      </div>

      <div className="bg-card border border-border rounded-xl p-5 mb-6">
        <div className="flex flex-wrap items-center gap-x-8 gap-y-4">

          <div>
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
              Survey File
            </p>
            <p className="text-[14px] font-semibold mt-1 break-all">
              {survey.filename}
            </p>
          </div>

          <div>
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
              Contacts
            </p>
            <p className="text-[18px] font-semibold mt-1">
              {detections.length}
            </p>
          </div>

          <div>
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
              Area
            </p>
            <p className="text-[14px] font-semibold mt-1">
              {survey.areaCovered || '—'}
            </p>
          </div>

          <div>
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
              Vessel
            </p>
            <p className="text-[14px] font-semibold mt-1">
              {survey.vessel || '—'}
            </p>
          </div>

          <div>
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
              Operator
            </p>
            <p className="text-[14px] font-semibold mt-1">
              {survey.operator || '—'}
            </p>
          </div>

        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">

        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <AlertTriangle size={16} />
            <span className="text-[12px]">
              Total
            </span>
          </div>
          <p className="text-2xl font-semibold">
            {detections.length}
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Clock3 size={16} />
            <span className="text-[12px]">
              Pending
            </span>
          </div>
          <p className="text-2xl font-semibold">
            {pendingCount}
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <CheckCircle2 size={16} />
            <span className="text-[12px]">
              Confirmed
            </span>
          </div>
          <p className="text-2xl font-semibold">
            {confirmedCount}
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <XCircle size={16} />
            <span className="text-[12px]">
              False Positive
            </span>
          </div>
          <p className="text-2xl font-semibold">
            {falsePositiveCount}
          </p>
        </div>

      </div>

      <div className="flex flex-wrap gap-2 mb-5">

        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg text-[12px] font-medium border ${
            filter === 'all'
              ? 'bg-primary text-white border-primary'
              : 'bg-card border-border text-muted-foreground hover:bg-muted'
          }`}
        >
          All
        </button>

        <button
          type="button"
          onClick={() => setFilter('pending')}
          className={`px-4 py-2 rounded-lg text-[12px] font-medium border ${
            filter === 'pending'
              ? 'bg-primary text-white border-primary'
              : 'bg-card border-border text-muted-foreground hover:bg-muted'
          }`}
        >
          Pending
        </button>

        <button
          type="button"
          onClick={() => setFilter('confirmed')}
          className={`px-4 py-2 rounded-lg text-[12px] font-medium border ${
            filter === 'confirmed'
              ? 'bg-primary text-white border-primary'
              : 'bg-card border-border text-muted-foreground hover:bg-muted'
          }`}
        >
          Confirmed
        </button>

        <button
          type="button"
          onClick={() =>
            setFilter('false_positive')
          }
          className={`px-4 py-2 rounded-lg text-[12px] font-medium border ${
            filter === 'false_positive'
              ? 'bg-primary text-white border-primary'
              : 'bg-card border-border text-muted-foreground hover:bg-muted'
          }`}
        >
          False Positive
        </button>

      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">

        <div className="px-5 py-4 border-b border-border">
          <h2 className="text-[15px] font-semibold">
            Detected Contacts
          </h2>

          <p className="text-[12px] text-muted-foreground mt-1">
            {filteredDetections.length} result
            {filteredDetections.length === 1
              ? ''
              : 's'}
          </p>
        </div>

        {filteredDetections.length === 0 ? (
          <div className="py-16 text-center">
            <AlertTriangle
              size={28}
              className="mx-auto mb-3 text-muted-foreground"
            />

            <p className="text-sm text-muted-foreground">
              No detections match this filter.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">

            {filteredDetections.map(
              (detection) => (
                <div
                  key={detection.id}
                  className="px-5 py-5 hover:bg-muted/40 transition-colors"
                >

                  <div className="flex items-start justify-between gap-4">

                    <div className="min-w-0">

                      <div className="flex items-center gap-3">

                        <p className="text-[14px] font-semibold">
                          {detection.classification}
                        </p>

                        <span
                          className={`px-2.5 py-1 rounded-full text-[11px] font-medium ${
                            detection.status ===
                            'confirmed'
                              ? 'bg-green-50 text-green-700'
                              : detection.status ===
                                'false_positive'
                              ? 'bg-red-50 text-red-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          {detection.status.replace(
                            '_',
                            ' '
                          )}
                        </span>

                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-2 mt-3">

                        <p className="text-[12px] text-muted-foreground">
                          <span className="font-medium text-foreground">
                            Confidence:
                          </span>{' '}
                          {detection.confidence}%
                        </p>

                        <p className="text-[12px] text-muted-foreground">
                          <span className="font-medium text-foreground">
                            Position:
                          </span>{' '}
                          {detection.lat.toFixed(6)},{' '}
                          {detection.lng.toFixed(6)}
                        </p>

                        <p className="text-[12px] text-muted-foreground">
                          <span className="font-medium text-foreground">
                            Depth:
                          </span>{' '}
                          {detection.depth}
                        </p>

                        <p className="text-[12px] text-muted-foreground">
                          <span className="font-medium text-foreground">
                            Size:
                          </span>{' '}
                          {detection.estimatedLength}{' '}
                          ×{' '}
                          {detection.estimatedWidth}
                        </p>

                      </div>

                      {detection.note && (
                        <p className="text-[12px] text-muted-foreground mt-3">
                          <span className="font-medium text-foreground">
                            Note:
                          </span>{' '}
                          {detection.note}
                        </p>
                      )}

                    </div>

                    <div className="text-[11px] text-muted-foreground whitespace-nowrap">
                      #{detection.index}
                    </div>

                  </div>

                </div>
              )
            )}

          </div>
        )}

      </div>
    </div>
  );
}