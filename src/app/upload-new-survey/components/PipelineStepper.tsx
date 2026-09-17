'use client';

import React from 'react';
import { CheckCircle2, Circle, Loader2 } from 'lucide-react';

interface PipelineStep {
  id: string;
  label: string;
  detail: string;
}

type UploadPhase = 'idle' | 'selected' | 'processing' | 'complete' | 'error';

interface PipelineStepperProps {
  steps: PipelineStep[];
  currentStep: number;
  phase: UploadPhase;
}

export default function PipelineStepper({ steps, currentStep, phase }: PipelineStepperProps) {
  const isIdle = phase === 'idle' || phase === 'selected';

  return (
    <div className="bg-card rounded-xl border border-border shadow-card p-6 h-full">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-[16px] font-semibold text-foreground">Detection Pipeline</h2>
        {phase === 'processing' && (
          <span className="flex items-center gap-1.5 text-[12px] text-primary font-medium">
            <Loader2 size={13} className="animate-spin" />
            Running…
          </span>
        )}
        {phase === 'complete' && (
          <span className="flex items-center gap-1.5 text-[12px] text-green-600 font-medium">
            <CheckCircle2 size={13} />
            Complete
          </span>
        )}
      </div>
      <p className="text-[13px] text-muted-foreground mb-6">
        {isIdle
          ? 'Upload a survey file to begin the 6-stage AI detection pipeline'
          : phase === 'processing'
          ? `Running stage ${currentStep + 1} of ${steps.length}…`
          : 'All pipeline stages completed successfully'}
      </p>

      {/* Overall progress bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[12px] text-muted-foreground">Overall progress</span>
          <span className="text-[12px] font-semibold font-tabular text-foreground">
            {phase === 'complete'
              ? '100%'
              : phase === 'processing'
              ? `${Math.round(((currentStep + 1) / steps.length) * 100)}%`
              : '0%'}
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
            style={{
              width:
                phase === 'complete'
                  ? '100%'
                  : phase === 'processing'
                  ? `${((currentStep + 1) / steps.length) * 100}%`
                  : '0%',
            }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-0">
        {steps.map((step, idx) => {
          const isDone = phase === 'complete' || (phase === 'processing' && idx < currentStep);
          const isActive = phase === 'processing' && idx === currentStep;
          const isPending = isIdle || (phase === 'processing' && idx > currentStep);

          return (
            <div key={step.id} className="relative">
              {/* Connector line */}
              {idx < steps.length - 1 && (
                <div
                  className={`absolute left-[19px] top-[38px] w-0.5 h-[calc(100%-8px)] transition-colors duration-500 ${isDone ? 'bg-primary' : 'bg-border'}`}
                />
              )}

              <div
                className={`
                  flex items-start gap-4 p-3 rounded-xl transition-all duration-200 mb-1
                  ${isActive ? 'bg-primary/5 border border-primary/20' : ''}
                  ${isDone ? 'opacity-100' : ''}
                  ${isPending ? 'opacity-50' : ''}
                `}
              >
                {/* Icon */}
                <div className="flex-shrink-0 mt-0.5 relative z-10">
                  {isDone ? (
                    <div className="step-complete">
                      <CheckCircle2 size={22} className="text-primary" />
                    </div>
                  ) : isActive ? (
                    <Loader2 size={22} className="text-primary animate-spin" />
                  ) : (
                    <Circle size={22} className="text-border" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pb-4">
                  <div className="flex items-center gap-2">
                    <p
                      className={`text-[14px] font-semibold transition-colors duration-200 ${
                        isDone || isActive ? 'text-foreground' : 'text-muted-foreground'
                      }`}
                    >
                      {step.label}
                    </p>
                    <span className="text-[11px] text-muted-foreground">
                      Stage {idx + 1}/{steps.length}
                    </span>
                    {isActive && (
                      <span className="text-[10px] font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                        Active
                      </span>
                    )}
                    {isDone && (
                      <span className="text-[10px] font-semibold bg-green-50 text-green-600 px-2 py-0.5 rounded-full">
                        Done
                      </span>
                    )}
                  </div>
                  <p className="text-[12px] text-muted-foreground mt-0.5">{step.detail}</p>

                  {/* Active progress shimmer */}
                  {isActive && (
                    <div className="mt-2 h-1 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full skeleton-pulse" style={{ width: '60%' }} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Info Panel */}
      {isIdle && (
        <div className="mt-4 p-4 bg-muted rounded-xl border border-border">
          <p className="text-[12px] text-muted-foreground leading-relaxed">
            <span className="font-semibold text-foreground">How it works:</span> Each uploaded sonar image is processed through a 6-stage AI pipeline. Preprocessing removes noise, Detection identifies anomalous contacts, Context Filtering removes biological returns, Confidence Scoring assigns posterior probabilities, Geotagging projects to WGS-84, and finally a structured report is compiled for operator review.
          </p>
        </div>
      )}
    </div>
  );
}