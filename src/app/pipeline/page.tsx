'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { SURVEYS, STATS } from '@/data/mockData';
import type { SurveyStatus } from '@/data/mockData';
import { Activity, CheckCircle2, Clock, Loader2, AlertCircle, XCircle } from 'lucide-react';

const PIPELINE_STAGES = [
  'Preprocessing',
  'Detection',
  'Context Filtering',
  'Confidence Scoring',
  'Geotagging',
  'Report Ready',
];

const STATUS_CONFIG: Record<SurveyStatus, { label: string; color: string; icon: React.ElementType }> = {
  processing: { label: 'Processing', color: 'text-blue-600 bg-blue-50 border-blue-200', icon: Loader2 },
  pending_review: { label: 'Pending Review', color: 'text-amber-600 bg-amber-50 border-amber-200', icon: AlertCircle },
  reviewed: { label: 'Reviewed', color: 'text-green-700 bg-green-50 border-green-200', icon: CheckCircle2 },
  exported: { label: 'Exported', color: 'text-purple-600 bg-purple-50 border-purple-200', icon: CheckCircle2 },
};

function getSurveyStageProgress(status: SurveyStatus): number {
  if (status === 'processing') return 2;
  return PIPELINE_STAGES.length;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-AU', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function PipelineActivityPage() {
  const [filterStatus, setFilterStatus] = useState<SurveyStatus | 'All'>('All');

  const filtered = SURVEYS.filter((s) => filterStatus === 'All' || s.status === filterStatus);

  const statuses: Array<SurveyStatus | 'All'> = ['All', 'processing', 'pending_review', 'reviewed', 'exported'];
  const statusLabels: Record<SurveyStatus | 'All', string> = {
    All: 'All',
    processing: 'Processing',
    pending_review: 'Pending Review',
    reviewed: 'Reviewed',
    exported: 'Exported',
  };

  return (
    <AppLayout>
      <div className="p-6 max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <Activity size={18} className="text-primary" />
          </div>
          <div>
            <h1 className="text-[20px] font-bold text-foreground">Pipeline Activity</h1>
            <p className="text-[13px] text-muted-foreground">Survey processing history and pipeline stage status</p>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Surveys', value: STATS.totalSurveys, icon: Activity },
            { label: 'Processing', value: SURVEYS.filter((s) => s.status === 'processing').length, icon: Loader2 },
            { label: 'Pending Review', value: SURVEYS.filter((s) => s.status === 'pending_review').length, icon: AlertCircle },
            { label: 'Completed', value: SURVEYS.filter((s) => s.status === 'reviewed' || s.status === 'exported').length, icon: CheckCircle2 },
          ].map((stat) => (
            <div key={stat.label} className="bg-card rounded-xl border border-border shadow-card p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                <stat.icon size={16} className="text-primary" />
              </div>
              <div>
                <p className="text-[12px] text-muted-foreground">{stat.label}</p>
                <p className="text-[20px] font-bold text-foreground">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filter chips */}
        <div className="flex items-center gap-2 flex-wrap mb-4">
          {statuses.map((s) => (
            <button
              key={`filter-${s}`}
              suppressHydrationWarning
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1 rounded-full text-[12px] font-medium border transition-all duration-150 ${
                filterStatus === s
                  ? 'bg-primary text-white border-primary' :'bg-muted text-muted-foreground border-border hover:border-primary/50 hover:text-foreground'
              }`}
            >
              {statusLabels[s]}
            </button>
          ))}
          <span className="ml-auto text-[12px] text-muted-foreground">{filtered.length} surveys</span>
        </div>

        {/* Survey pipeline cards */}
        <div className="space-y-4">
          {filtered.map((survey) => {
            const cfg = STATUS_CONFIG[survey.status];
            const StatusIcon = cfg.icon;
            const stagesDone = getSurveyStageProgress(survey.status);
            const isProcessing = survey.status === 'processing';

            return (
              <div key={survey.id} className="bg-card rounded-xl border border-border shadow-card p-5">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="min-w-0">
                    <p className="text-[14px] font-semibold text-foreground truncate">{survey.filename}</p>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <span className="text-[12px] text-muted-foreground">{formatDate(survey.uploadDate)}</span>
                      <span className="text-[12px] text-muted-foreground">·</span>
                      <span className="text-[12px] text-muted-foreground">{survey.vessel}</span>
                      <span className="text-[12px] text-muted-foreground">·</span>
                      <span className="text-[12px] text-muted-foreground">{survey.operator}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
                      <Clock size={12} />
                      <span>{survey.processingTime}</span>
                    </div>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${cfg.color}`}>
                      <StatusIcon size={11} className={isProcessing ? 'animate-spin' : ''} />
                      {cfg.label}
                    </span>
                  </div>
                </div>

                {/* Pipeline stages */}
                <div className="flex items-center gap-0">
                  {PIPELINE_STAGES.map((stage, idx) => {
                    const done = idx < stagesDone;
                    const active = isProcessing && idx === stagesDone - 1;
                    return (
                      <React.Fragment key={stage}>
                        <div className="flex flex-col items-center gap-1 flex-1 min-w-0">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                            done
                              ? active
                                ? 'bg-blue-500 border-2 border-blue-300' :'bg-green-500' :'bg-muted border-2 border-border'
                          }`}>
                            {done ? (
                              active ? (
                                <Loader2 size={12} className="text-white animate-spin" />
                              ) : (
                                <CheckCircle2 size={12} className="text-white" />
                              )
                            ) : (
                              <XCircle size={12} className="text-muted-foreground opacity-30" />
                            )}
                          </div>
                          <span className={`text-[10px] font-medium text-center leading-tight px-0.5 ${done ? 'text-foreground' : 'text-muted-foreground opacity-50'}`}>
                            {stage}
                          </span>
                        </div>
                        {idx < PIPELINE_STAGES.length - 1 && (
                          <div className={`h-0.5 flex-1 mx-1 mb-4 rounded-full transition-all duration-300 ${idx < stagesDone - 1 ? 'bg-green-400' : 'bg-border'}`} />
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>

                {/* Contacts detected */}
                {survey.status !== 'processing' && (
                  <div className="mt-3 pt-3 border-t border-border flex items-center gap-4 text-[12px] text-muted-foreground">
                    <span><span className="font-semibold text-foreground">{survey.contactsDetected}</span> contacts detected</span>
                    <span><span className="font-semibold text-foreground">{survey.areaCovered}</span> area covered</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
