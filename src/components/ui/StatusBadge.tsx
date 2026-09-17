import type { SurveyStatus, DetectionStatus } from '@/data/mockData';

interface SurveyStatusBadgeProps {
  status: SurveyStatus;
}

interface DetectionStatusBadgeProps {
  status: DetectionStatus;
}

const SURVEY_STATUS_CONFIG: Record<
  SurveyStatus,
  { label: string; className: string }
> = {
  processing: {
    label: 'Processing',
    className: 'status-processing',
  },
  pending_review: {
    label: 'Pending Review',
    className: 'status-pending',
  },
  reviewed: {
    label: 'Reviewed',
    className: 'status-confirmed',
  },
  exported: {
    label: 'Exported',
    className: 'status-dismissed',
  },
};

const DETECTION_STATUS_CONFIG: Record<
  DetectionStatus,
  { label: string; className: string }
> = {
  pending: {
    label: 'Pending',
    className: 'status-pending',
  },
  confirmed: {
    label: 'Confirmed',
    className: 'status-confirmed',
  },
  false_positive: {
    label: 'False Positive',
    className: 'status-dismissed',
  },
  dismissed: {
    label: 'Dismissed',
    className: 'status-dismissed',
  },
};

export function SurveyStatusBadge({
  status,
}: SurveyStatusBadgeProps) {
  const config = SURVEY_STATUS_CONFIG[status];

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${config.className}`}
    >
      {config.label}
    </span>
  );
}

export function DetectionStatusBadge({
  status,
}: DetectionStatusBadgeProps) {
  const config = DETECTION_STATUS_CONFIG[status];

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${config.className}`}
    >
      {config.label}
    </span>
  );
}

interface StatusBadgeProps {
  status: DetectionStatus;
}

const StatusBadge = ({
  status,
}: StatusBadgeProps) => {
  const config = DETECTION_STATUS_CONFIG[status];

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${config.className}`}
    >
      {config.label}
    </span>
  );
};

export default StatusBadge;