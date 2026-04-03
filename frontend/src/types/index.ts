export interface UploadFormData {
  // Patient context (anonymized)
  patientAge?: number;
  patientSex?: 'male' | 'female' | 'other' | 'prefer_not';
  countryCode?: string;

  // Cancer details
  cancerType: string;
  cancerStage?: string;
  diagnosisDate?: string;

  // This image
  imagingModality: string;
  imagingDate: string;
  bodyRegion: string;
  treatmentContext?: string;

  // Notes
  notes?: string;
  isAnonymous: boolean;
  consentGiven: boolean;

  // Files
  files: File[];
}

export interface Submission {
  id: string;
  cancerType: string;
  imagingModality: string;
  imagingDate: string;
  bodyRegion: string;
  cancerStage?: string;
  notes?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  thumbnailUrl?: string;
  fileCount: number;
}

export interface DatasetEntry {
  id: string;
  cancerType: string;
  cancerTypeLabel: string;
  imagingModality: string;
  imagingModalityLabel: string;
  imagingDate: string;
  bodyRegion: string;
  bodyRegionLabel: string;
  cancerStage?: string;
  treatmentContext?: string;
  thumbnailUrl?: string;
  fileCount: number;
  approvedAt: string;
}

export interface Stats {
  totalSubmissions: number;
  totalPatients: number;
  cancerTypes: number;
  countries: number;
}
