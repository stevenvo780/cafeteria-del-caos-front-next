'use client';
export const getCSSVariable = (variable: string): string => {
  return getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
};

export interface CustomEditorProps {
  content: string;
  setContent: (content: string) => void;
  templateType?: string;
  height?: number;
}

export interface BlobInfo {
  filename(): string;
  blob(): Blob;
  base64(): string;
  id(): string;
  uri(): string;
}

export const colorPalette = [
  getCSSVariable('--primary-color'),
  getCSSVariable('--primary-hover'),
  getCSSVariable('--primary-border'),
  getCSSVariable('--primary-text'),
  getCSSVariable('--secondary-color'),
  getCSSVariable('--secondary-hover'),
  getCSSVariable('--secondary-border'),
  getCSSVariable('--secondary-text'),
  getCSSVariable('--info-color'),
  getCSSVariable('--info-hover'),
  getCSSVariable('--info-border'),
  getCSSVariable('--info-text'),
  getCSSVariable('--success-color'),
  getCSSVariable('--success-hover'),
  getCSSVariable('--success-border'),
  getCSSVariable('--success-text'),
  getCSSVariable('--warning-color'),
  getCSSVariable('--warning-hover'),
  getCSSVariable('--warning-border'),
  getCSSVariable('--warning-text'),
  getCSSVariable('--danger-color'),
  getCSSVariable('--danger-hover'),
  getCSSVariable('--danger-border'),
  getCSSVariable('--danger-text'),
  getCSSVariable('--link-color'),
  getCSSVariable('--link-hover'),
  getCSSVariable('--link-border'),
  getCSSVariable('--link-text'),
  getCSSVariable('--discord-color'),
  getCSSVariable('--discord-text'),
  getCSSVariable('--online-color'),
  getCSSVariable('--white-color'),
  getCSSVariable('--font-color'),
  getCSSVariable('--bg-color'),
  getCSSVariable('--border-color'),
  getCSSVariable('--card-color'),
  getCSSVariable('--card-hover'),
  getCSSVariable('--card-border'),
  getCSSVariable('--card-text'),
];
