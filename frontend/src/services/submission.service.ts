import api from './api';
import type { UploadFormData } from '../types';

export interface SubmissionResponse {
  id: string;
  sessionToken: string;
  fileCount: number;
  message: string;
}

export interface SubmissionListItem {
  id: string;
  cancer_type: string;
  imaging_modality: string;
  imaging_date: string;
  body_region: string;
  cancer_stage?: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  file_count: number;
}

export interface DatasetEntry {
  id: string;
  cancer_type: string;
  cancer_stage?: string;
  imaging_modality: string;
  imaging_date: string;
  body_region: string;
  treatment_context?: string;
  patient_age?: number;
  patient_sex?: string;
  notes?: string;
  file_count: number;
  approved_at: string;
}

export interface Stats {
  totalSubmissions: number;
  cancerTypes: number;
  imagingModalities?: number;
  countries?: number;
}

export const submissionService = {
  async submit(form: UploadFormData, onProgress?: (pct: number) => void): Promise<SubmissionResponse> {
    const fd = new FormData();

    // Append metadata fields
    fd.append('cancerType', form.cancerType);
    if (form.cancerStage) fd.append('cancerStage', form.cancerStage);
    if (form.diagnosisDate) fd.append('diagnosisDate', form.diagnosisDate);
    if (form.imagingModality) fd.append('imagingModality', form.imagingModality);
    fd.append('imagingDate', form.imagingDate);
    fd.append('bodyRegion', form.bodyRegion);
    if (form.treatmentContext) fd.append('treatmentContext', form.treatmentContext);
    if (form.notes) fd.append('notes', form.notes);
    if (form.patientAge != null) fd.append('patientAge', String(form.patientAge));
    if (form.patientSex) fd.append('patientSex', form.patientSex);
    if (form.countryCode) fd.append('countryCode', form.countryCode);
    fd.append('isAnonymous', String(form.isAnonymous));
    fd.append('consentGiven', String(form.consentGiven));

    // Append files
    for (const file of form.files) {
      fd.append('files', file);
    }

    const { data } = await api.post<SubmissionResponse>('/submissions', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (e) => {
        if (onProgress && e.total) {
          onProgress(Math.round((e.loaded / e.total) * 100));
        }
      },
    });

    return data;
  },

  async listMine(): Promise<SubmissionListItem[]> {
    const { data } = await api.get<{ submissions: SubmissionListItem[] }>('/submissions');
    return data.submissions;
  },

  async getDataset(params: {
    page?: number;
    limit?: number;
    cancerType?: string;
    modality?: string;
    stage?: string;
    search?: string;
  } = {}): Promise<{ entries: DatasetEntry[]; total: number }> {
    const { data } = await api.get<{ entries: DatasetEntry[]; total: number }>('/submissions/dataset', { params });
    return data;
  },

  async getStats(): Promise<Stats> {
    const { data } = await api.get<Stats>('/stats');
    return data;
  },
};
