export type Department =
  | 'Cardiology'
  | 'Neurology'
  | 'Pediatrics'
  | 'Orthopedics'
  | 'Oncology'
  | 'General Medicine'
  | 'Emergency'
  | 'Dermatology';

export type DischargeStatus =
  | 'Discharged'
  | 'Admitted'
  | 'Under Observation'
  | 'Transferred'
  | 'Follow-up Scheduled';

export type AgeGroup = '0-18' | '19-35' | '36-50' | '51-65' | '66+';

export interface PatientRecord {
  id: string; // e.g. "PID-1001"
  age: number; // 0 - 120
  ageGroup: AgeGroup;
  visitDate: string; // YYYY-MM-DD
  department: Department;
  diagnosisCategory: string;
  dischargeStatus: DischargeStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PatientRecordFormData {
  id?: string;
  age: number | string;
  visitDate: string;
  department: Department | '';
  diagnosisCategory: string;
  dischargeStatus: DischargeStatus | '';
  notes?: string;
}

export interface ValidationErrors {
  age?: string;
  visitDate?: string;
  department?: string;
  diagnosisCategory?: string;
  dischargeStatus?: string;
  general?: string;
}

export interface AnalyticsSummary {
  totalRecords: number;
  totalVisits: number;
  departmentCounts: Record<string, number>;
  dischargeCounts: Record<string, number>;
  ageGroupCounts: Record<string, number>;
  monthlyVisits: Record<string, number>;
  ageStats: {
    mean: number;
    median: number;
    min: number;
    max: number;
    stdDev: number;
  };
  missingValues: {
    column: string;
    missingCount: number;
    percentage: number;
  }[];
  duplicateCount: number;
  contingencyTable: {
    department: string;
    discharged: number;
    admitted: number;
    observation: number;
    transferred: number;
    followUp: number;
    total: number;
  }[];
}

export const DEPARTMENTS: Department[] = [
  'Cardiology',
  'Neurology',
  'Pediatrics',
  'Orthopedics',
  'Oncology',
  'General Medicine',
  'Emergency',
  'Dermatology',
];

export const DISCHARGE_STATUSES: DischargeStatus[] = [
  'Discharged',
  'Admitted',
  'Under Observation',
  'Transferred',
  'Follow-up Scheduled',
];

export const COMMON_DIAGNOSES: Record<Department, string[]> = {
  Cardiology: [
    'Hypertension Stage 2',
    'Coronary Artery Disease',
    'Atrial Fibrillation',
    'Congestive Heart Failure',
    'Angina Pectoris',
  ],
  Neurology: [
    'Migraine with Aura',
    'Ischemic Stroke',
    'Epilepsy Evaluation',
    'Tension Headache',
    'Peripheral Neuropathy',
  ],
  Pediatrics: [
    'Acute Bronchitis',
    'Viral Gastroenteritis',
    'Febrile Seizure',
    'Asthma Exacerbation',
    'Streptococcal Pharyngitis',
  ],
  Orthopedics: [
    'Lumbar Disc Herniation',
    'Osteoarthritis of Knee',
    'Radial Fracture',
    'Rotator Cuff Tear',
    'ACL Sprain',
  ],
  Oncology: [
    'Breast Carcinoma Monitoring',
    'Colorectal Neoplasm Follow-up',
    'Leukemia Maintenance',
    'Lymphoma Evaluation',
    'Benign Thyroid Nodule',
  ],
  'General Medicine': [
    'Type 2 Diabetes Mellitus',
    'Acute Gastroenteritis',
    'Community-Acquired Pneumonia',
    'Urinary Tract Infection',
    'Vitamin D Deficiency',
  ],
  Emergency: [
    'Acute Blunt Trauma',
    'Severe Dehydration',
    'Anaphylactic Reaction',
    'Acute Abdominal Pain',
    'Hypertensive Crisis',
  ],
  Dermatology: [
    'Atopic Dermatitis',
    'Psoriasis Vulgaris',
    'Contact Dermatitis',
    'Superficial Fungal Infection',
    'Alopecia Areata',
  ],
};

export function getAgeGroup(age: number): AgeGroup {
  if (age <= 18) return '0-18';
  if (age <= 35) return '19-35';
  if (age <= 50) return '36-50';
  if (age <= 65) return '51-65';
  return '66+';
}
