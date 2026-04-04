// Lightweight DICOM header reader using dicom-parser
// Extracts only non-PHI fields needed to auto-fill form fields

import dicomParser from 'dicom-parser';

export interface DicomHints {
  modality?: string;       // (0008,0060)
  studyDate?: string;      // (0008,0020) — YYYYMMDD
  bodyPartExamined?: string; // (0018,0015)
  seriesDescription?: string; // (0008,103E)
}

const MODALITY_MAP: Record<string, string> = {
  CT: 'ct',
  MR: 'mri',
  PT: 'pet_ct',
  CR: 'xray',
  DX: 'xray',
  MG: 'mammogram',
  US: 'ultrasound',
  NM: 'bone_scan',
  XA: 'angiography',
  RF: 'fluoroscopy',
  SC: 'other',
};

const BODY_PART_MAP: Record<string, string> = {
  BRAIN: 'brain',
  HEAD: 'head',
  NECK: 'neck',
  CHEST: 'chest',
  LUNG: 'chest',
  BREAST: 'breast_left',
  ABDOMEN: 'abdomen',
  LIVER: 'liver',
  PANCREAS: 'pancreas',
  PELVIS: 'pelvis',
  PROSTATE: 'prostate',
  COLON: 'colon',
  SPINE: 'spine',
  WHOLEBODY: 'whole_body',
  SKULL: 'head',
};

export async function parseDicomHints(file: File): Promise<DicomHints | null> {
  if (!file.name.toLowerCase().match(/\.(dcm|dicom)$/) && file.type !== 'application/dicom') {
    return null;
  }

  try {
    const buffer = await file.arrayBuffer();
    const byteArray = new Uint8Array(buffer);
    const dataSet = dicomParser.parseDicom(byteArray, { untilTag: '0020,0013' });

    const getString = (tag: string) => {
      try { return dataSet.string(tag)?.trim() ?? undefined; } catch { return undefined; }
    };

    const rawDate = getString('x00080020');
    let studyDate: string | undefined;
    if (rawDate && rawDate.length >= 6) {
      // Format: YYYYMMDD → YYYY-MM (strip day for privacy)
      studyDate = `${rawDate.slice(0, 4)}-${rawDate.slice(4, 6)}`;
    }

    const rawModality = getString('x00080060');
    const modality = rawModality ? (MODALITY_MAP[rawModality] ?? 'other') : undefined;

    const rawBodyPart = getString('x00180015')?.toUpperCase();
    const bodyRegion = rawBodyPart ? (BODY_PART_MAP[rawBodyPart] ?? undefined) : undefined;

    return {
      modality,
      studyDate,
      bodyPartExamined: bodyRegion,
      seriesDescription: getString('x0008103e'),
    };
  } catch {
    // Not a valid DICOM or parse error — silently ignore
    return null;
  }
}
