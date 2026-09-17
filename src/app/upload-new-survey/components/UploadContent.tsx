'use client';

import React, { useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import PipelineStepper from './PipelineStepper';
import { Upload, FileImage, X, CheckCircle2 } from 'lucide-react';

type UploadPhase = 'idle' | 'selected' | 'processing' | 'complete' | 'error';

interface SelectedFile {
  name: string;
  size: number;
  type: string;
}

export default function UploadContent() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [phase, setPhase] = useState<UploadPhase>('idle');
  const [dragging, setDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<SelectedFile | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(-1);

  const PIPELINE_STEPS = [
    { id: 'step-preprocess', label: 'Preprocessing', detail: 'Normalising sonar imagery and removing noise artefacts' },
    { id: 'step-detect', label: 'Detection', detail: 'Running YOLO-v8 contact detection model on swath imagery' },
    { id: 'step-filter', label: 'Context Filtering', detail: 'Eliminating false echoes and biological scatter returns' },
    { id: 'step-score', label: 'Confidence Scoring', detail: 'Assigning posterior probability scores to each contact' },
    { id: 'step-geo', label: 'Geotagging', detail: 'Projecting contacts to WGS-84 coordinates via vessel nav data' },
    { id: 'step-report', label: 'Report Ready', detail: 'Contact report compiled and ready for operator review' },
  ];

  const handleFile = useCallback((file: File) => {
    setSelectedFile({ name: file.name, size: file.size, type: file.type });
    setPhase('selected');
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => setDragging(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const startProcessing = () => {
    setPhase('processing');
    setCurrentStep(0);
    // Simulate upload progress
    let prog = 0;
    const progInterval = setInterval(() => {
      prog += 8;
      setUploadProgress(Math.min(prog, 100));
      if (prog >= 100) clearInterval(progInterval);
    }, 80);

    // Step through pipeline with timed delays
    const stepDelays = [0, 1400, 2600, 3800, 5100, 6400];
    stepDelays.forEach((delay, idx) => {
      setTimeout(() => {
        setCurrentStep(idx);
      }, delay);
    });

    // Complete
    setTimeout(() => {
      setPhase('complete');
    }, 7800);
  };

  const reset = () => {
    setPhase('idle');
    setSelectedFile(null);
    setUploadProgress(0);
    setCurrentStep(-1);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="px-6 lg:px-8 xl:px-10 py-8 max-w-screen-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[24px] font-semibold text-foreground tracking-tight">
          New Survey Upload
        </h1>
        <p className="text-[14px] text-muted-foreground mt-1">
          Upload a side-scan sonar image file to begin automated contact detection
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 xl:grid-cols-5 2xl:grid-cols-5 gap-8">
        {/* Left — Upload Zone */}
        <div className="lg:col-span-2 xl:col-span-2 2xl:col-span-2">
          <div className="bg-card rounded-xl border border-border shadow-card p-6">
            <h2 className="text-[16px] font-semibold text-foreground mb-1">Survey File</h2>
            <p className="text-[13px] text-muted-foreground mb-5">
              Accepted formats: .xtf, .jsf, .tif, .png, .jpg, .raw
            </p>

            {phase === 'idle' && (
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                className={`
                  relative border-2 border-dashed rounded-xl p-10 text-center cursor-pointer
                  transition-all duration-200 group
                  ${dragging
                    ? 'border-primary bg-primary/5 scale-[1.01]'
                    : 'border-border hover:border-primary/60 hover:bg-muted/60'
                  }
                `}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,.xtf,.jsf,.raw"
                  onChange={handleInputChange}
                  className="hidden"
                />
                <div className={`w-14 h-14 rounded-xl mx-auto mb-4 flex items-center justify-center transition-colors duration-200 ${dragging ? 'bg-primary/20' : 'bg-muted group-hover:bg-primary/10'}`}>
                  <Upload size={26} className={`transition-colors duration-200 ${dragging ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'}`} />
                </div>
                <p className="text-[15px] font-semibold text-foreground mb-1">
                  {dragging ? 'Drop to upload' : 'Drag & drop survey file'}
                </p>
                <p className="text-[13px] text-muted-foreground mb-4">
                  or click to browse files
                </p>
                <span className="text-[12px] text-muted-foreground bg-muted px-3 py-1.5 rounded-full">
                  Max file size: 2 GB
                </span>
              </div>
            )}

            {(phase === 'selected' || phase === 'processing' || phase === 'complete') && selectedFile && (
              <div className="space-y-4">
                {/* File Info Card */}
                <div className="flex items-start gap-3 p-4 bg-muted rounded-xl border border-border">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <FileImage size={20} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-foreground truncate">{selectedFile.name}</p>
                    <p className="text-[12px] text-muted-foreground mt-0.5">
                      {formatBytes(selectedFile.size)} · {selectedFile.type || 'application/octet-stream'}
                    </p>
                  </div>
                  {phase === 'selected' && (
                    <button
                      onClick={reset}
                      className="text-muted-foreground hover:text-red-500 transition-colors duration-150 p-1 rounded"
                    >
                      <X size={16} />
                    </button>
                  )}
                  {phase === 'complete' && (
                    <CheckCircle2 size={18} className="text-green-600 flex-shrink-0" />
                  )}
                </div>

                {/* Upload Progress */}
                {phase === 'processing' && (
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[12px] text-muted-foreground">Uploading to pipeline…</span>
                      <span className="text-[12px] font-semibold font-tabular text-primary">{uploadProgress}%</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-100"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {phase === 'selected' && (
                  <button
                    onClick={startProcessing}
                    className="w-full py-3 bg-primary text-white text-[14px] font-semibold rounded-xl hover:bg-secondary active:scale-95 transition-all duration-150 shadow-sm"
                  >
                    Begin Processing
                  </button>
                )}

                {phase === 'complete' && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-200 rounded-xl">
                      <CheckCircle2 size={16} className="text-green-600 flex-shrink-0" />
                      <p className="text-[13px] text-green-700 font-medium">
                        7 contacts detected and ready for review
                      </p>
                    </div>
                    <button
                      onClick={() => router.push('/survey-detection-results')}
                      className="w-full py-3 bg-primary text-white text-[14px] font-semibold rounded-xl hover:bg-secondary active:scale-95 transition-all duration-150 shadow-sm"
                    >
                      View Detection Results →
                    </button>
                    <button
                      onClick={reset}
                      className="w-full py-2.5 bg-muted text-muted-foreground text-[13px] font-medium rounded-xl hover:bg-border transition-colors duration-150"
                    >
                      Upload Another Survey
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Guidelines */}
            <div className="mt-5 pt-5 border-t border-border space-y-2">
              <p className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                File Requirements
              </p>
              {[
                'Side-scan sonar imagery in XTF, JSF, or raster format',
                'Navigation data (NMEA) embedded or as sidecar file',
                'Coordinate system: WGS-84 decimal degrees',
                'Minimum resolution: 0.1m/pixel for reliable detection',
              ].map((req, i) => (
                <div key={`req-${i}`} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 flex-shrink-0" />
                  <p className="text-[12px] text-muted-foreground">{req}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right — Pipeline Stepper */}
        <div className="lg:col-span-3 xl:col-span-3 2xl:col-span-3">
          <PipelineStepper
            steps={PIPELINE_STEPS}
            currentStep={currentStep}
            phase={phase}
          />
        </div>
      </div>
    </div>
  );
}