export type SurveyStatus = 'processing' | 'pending_review' | 'reviewed' | 'exported';
export type DetectionStatus = 'pending' | 'confirmed' | 'false_positive' | 'dismissed';
export type DetectionClass = 'Shipwreck' | 'Pipe' | 'Cylinder' | 'Entangled Net' | 'Unknown Object';

export interface Survey {
  id: string;
  filename: string;
  uploadDate: string;
  areaCovered: string;
  contactsDetected: number;
  status: SurveyStatus;
  processingTime: string;
  vessel: string;
  operator: string;
}

export interface Detection {
  id: string;
  surveyId: string;
  index: number;
  classification: DetectionClass;
  confidence: number;
  lat: number;
  lng: number;
  depth: string;
  estimatedLength: string;
  estimatedWidth: string;
  status: DetectionStatus;
  note: string;
  thumbnailColor: string;
  bboxTop: string;
  bboxLeft: string;
  bboxWidth: string;
  bboxHeight: string;
  bboxColor: string;
  detectedAt: string;
}

export const SURVEYS: Survey[] = [
  {
    id: 'survey-001',
    filename: 'SS_HMAS_Canberra_NE_20260914_R01.xtf',
    uploadDate: '2026-09-14T08:22:00Z',
    areaCovered: '4.2 km²',
    contactsDetected: 7,
    status: 'pending_review',
    processingTime: '3m 42s',
    vessel: 'RV Investigator',
    operator: 'M. Okafor',
  },
  {
    id: 'survey-002',
    filename: 'SS_Port_Phillip_S_20260913_R02.xtf',
    uploadDate: '2026-09-13T14:07:00Z',
    areaCovered: '6.8 km²',
    contactsDetected: 12,
    status: 'reviewed',
    processingTime: '5m 18s',
    vessel: 'RV Southern Surveyor',
    operator: 'T. Nakamura',
  },
  {
    id: 'survey-003',
    filename: 'SS_Bass_Strait_W_20260912_R01.xtf',
    uploadDate: '2026-09-12T09:55:00Z',
    areaCovered: '9.1 km²',
    contactsDetected: 4,
    status: 'exported',
    processingTime: '7m 02s',
    vessel: 'RV Investigator',
    operator: 'M. Okafor',
  },
  {
    id: 'survey-004',
    filename: 'SS_Coral_Sea_NW_20260911_R03.xtf',
    uploadDate: '2026-09-11T16:33:00Z',
    areaCovered: '3.5 km²',
    contactsDetected: 9,
    status: 'pending_review',
    processingTime: '2m 57s',
    vessel: 'RV Solander',
    operator: 'P. Bergström',
  },
  {
    id: 'survey-005',
    filename: 'SS_Moreton_Bay_E_20260910_R01.xtf',
    uploadDate: '2026-09-10T11:12:00Z',
    areaCovered: '5.6 km²',
    contactsDetected: 6,
    status: 'reviewed',
    processingTime: '4m 31s',
    vessel: 'RV Solander',
    operator: 'P. Bergström',
  },
  {
    id: 'survey-006',
    filename: 'SS_Darwin_Harbour_20260909_R02.xtf',
    uploadDate: '2026-09-09T07:44:00Z',
    areaCovered: '2.9 km²',
    contactsDetected: 3,
    status: 'exported',
    processingTime: '2m 14s',
    vessel: 'RV Tangaroa',
    operator: 'L. Ferreira',
  },
  {
    id: 'survey-007',
    filename: 'SS_Spencer_Gulf_20260908_R01.xtf',
    uploadDate: '2026-09-08T13:20:00Z',
    areaCovered: '7.3 km²',
    contactsDetected: 5,
    status: 'processing',
    processingTime: '—',
    vessel: 'RV Investigator',
    operator: 'M. Okafor',
  },
  {
    id: 'survey-008',
    filename: 'SS_Fremantle_Outer_20260907_R04.xtf',
    uploadDate: '2026-09-07T10:05:00Z',
    areaCovered: '11.2 km²',
    contactsDetected: 15,
    status: 'exported',
    processingTime: '9m 48s',
    vessel: 'RV Southern Surveyor',
    operator: 'T. Nakamura',
  },
];

export const DETECTIONS: Detection[] = [
  {
    id: 'det-001',
    surveyId: 'survey-001',
    index: 1,
    classification: 'Shipwreck',
    confidence: 91,
    lat: -38.1842,
    lng: 144.6217,
    depth: '18.4 m',
    estimatedLength: '42.0 m',
    estimatedWidth: '8.5 m',
    status: 'pending',
    note: '',
    thumbnailColor: '#1a3a4a',
    bboxTop: '28%',
    bboxLeft: '18%',
    bboxWidth: '55%',
    bboxHeight: '38%',
    bboxColor: '#1C8C5A',
    detectedAt: '2026-09-14T08:26:11Z',
  },
  {
    id: 'det-002',
    surveyId: 'survey-001',
    index: 2,
    classification: 'Entangled Net',
    confidence: 74,
    lat: -38.1956,
    lng: 144.6384,
    depth: '12.1 m',
    estimatedLength: '8.3 m',
    estimatedWidth: '3.2 m',
    status: 'pending',
    note: '',
    thumbnailColor: '#1e3d2f',
    bboxTop: '40%',
    bboxLeft: '30%',
    bboxWidth: '35%',
    bboxHeight: '25%',
    bboxColor: '#B14C15',
    detectedAt: '2026-09-14T08:26:18Z',
  },
  {
    id: 'det-003',
    surveyId: 'survey-001',
    index: 3,
    classification: 'Pipe',
    confidence: 88,
    lat: -38.2011,
    lng: 144.6102,
    depth: '22.7 m',
    estimatedLength: '15.6 m',
    estimatedWidth: '0.8 m',
    status: 'pending',
    note: '',
    thumbnailColor: '#162840',
    bboxTop: '35%',
    bboxLeft: '10%',
    bboxWidth: '70%',
    bboxHeight: '12%',
    bboxColor: '#1C8C5A',
    detectedAt: '2026-09-14T08:26:24Z',
  },
  {
    id: 'det-004',
    surveyId: 'survey-001',
    index: 4,
    classification: 'Cylinder',
    confidence: 43,
    lat: -38.1788,
    lng: 144.6501,
    depth: '9.8 m',
    estimatedLength: '2.1 m',
    estimatedWidth: '0.6 m',
    status: 'pending',
    note: '',
    thumbnailColor: '#1c2e38',
    bboxTop: '45%',
    bboxLeft: '42%',
    bboxWidth: '18%',
    bboxHeight: '20%',
    bboxColor: '#DC2626',
    detectedAt: '2026-09-14T08:26:31Z',
  },
  {
    id: 'det-005',
    surveyId: 'survey-001',
    index: 5,
    classification: 'Unknown Object',
    confidence: 61,
    lat: -38.2134,
    lng: 144.6288,
    depth: '31.2 m',
    estimatedLength: '5.4 m',
    estimatedWidth: '2.9 m',
    status: 'pending',
    note: '',
    thumbnailColor: '#182230',
    bboxTop: '32%',
    bboxLeft: '25%',
    bboxWidth: '28%',
    bboxHeight: '22%',
    bboxColor: '#B14C15',
    detectedAt: '2026-09-14T08:26:38Z',
  },
  {
    id: 'det-006',
    surveyId: 'survey-001',
    index: 6,
    classification: 'Entangled Net',
    confidence: 55,
    lat: -38.1901,
    lng: 144.6445,
    depth: '7.3 m',
    estimatedLength: '11.2 m',
    estimatedWidth: '4.8 m',
    status: 'pending',
    note: '',
    thumbnailColor: '#1a3520',
    bboxTop: '38%',
    bboxLeft: '15%',
    bboxWidth: '45%',
    bboxHeight: '28%',
    bboxColor: '#B14C15',
    detectedAt: '2026-09-14T08:26:44Z',
  },
  {
    id: 'det-007',
    surveyId: 'survey-001',
    index: 7,
    classification: 'Pipe',
    confidence: 82,
    lat: -38.2067,
    lng: 144.6163,
    depth: '27.5 m',
    estimatedLength: '22.1 m',
    estimatedWidth: '1.2 m',
    status: 'pending',
    note: '',
    thumbnailColor: '#14253a',
    bboxTop: '42%',
    bboxLeft: '8%',
    bboxWidth: '76%',
    bboxHeight: '10%',
    bboxColor: '#1C8C5A',
    detectedAt: '2026-09-14T08:26:51Z',
  },
];

export const CONFIRMED_CONTACTS_ALL = [
  { id: 'cc-001', surveyId: 'survey-002', classification: 'Shipwreck' as DetectionClass, confidence: 94, lat: -37.9824, lng: 144.8821, depth: '23.1 m', length: '38.5 m', width: '7.2 m', date: '2026-09-13', status: 'confirmed' as DetectionStatus },
  { id: 'cc-002', surveyId: 'survey-002', classification: 'Pipe' as DetectionClass, confidence: 87, lat: -37.9941, lng: 144.8654, depth: '15.4 m', length: '28.0 m', width: '1.0 m', date: '2026-09-13', status: 'confirmed' as DetectionStatus },
  { id: 'cc-003', surveyId: 'survey-002', classification: 'Entangled Net' as DetectionClass, confidence: 79, lat: -38.0102, lng: 144.8732, depth: '8.7 m', length: '9.4 m', width: '3.8 m', date: '2026-09-13', status: 'confirmed' as DetectionStatus },
  { id: 'cc-004', surveyId: 'survey-003', classification: 'Cylinder' as DetectionClass, confidence: 91, lat: -39.1244, lng: 146.3321, depth: '44.2 m', length: '3.2 m', width: '0.9 m', date: '2026-09-12', status: 'confirmed' as DetectionStatus },
  { id: 'cc-005', surveyId: 'survey-003', classification: 'Shipwreck' as DetectionClass, confidence: 96, lat: -39.1388, lng: 146.3498, depth: '51.8 m', length: '67.3 m', width: '12.1 m', date: '2026-09-12', status: 'confirmed' as DetectionStatus },
  { id: 'cc-006', surveyId: 'survey-005', classification: 'Pipe' as DetectionClass, confidence: 83, lat: -27.3841, lng: 153.1624, depth: '6.2 m', length: '19.7 m', width: '0.7 m', date: '2026-09-10', status: 'confirmed' as DetectionStatus },
  { id: 'cc-007', surveyId: 'survey-006', classification: 'Unknown Object' as DetectionClass, confidence: 68, lat: -12.4634, lng: 130.8421, depth: '11.3 m', length: '4.8 m', width: '2.1 m', date: '2026-09-09', status: 'confirmed' as DetectionStatus },
  { id: 'cc-008', surveyId: 'survey-008', classification: 'Shipwreck' as DetectionClass, confidence: 98, lat: -32.1247, lng: 115.7382, depth: '34.6 m', length: '54.2 m', width: '9.8 m', date: '2026-09-07', status: 'confirmed' as DetectionStatus },
  { id: 'cc-009', surveyId: 'survey-008', classification: 'Entangled Net' as DetectionClass, confidence: 85, lat: -32.1389, lng: 115.7514, depth: '18.9 m', length: '14.1 m', width: '5.3 m', date: '2026-09-07', status: 'confirmed' as DetectionStatus },
];

export const STATS = {
  totalSurveys: 8,
  pendingReview: 2,
  highConfidenceHazards: 5,
  avgProcessingTime: '4m 22s',
  totalDetections: 61,
  falsePositiveRate: 12,
};