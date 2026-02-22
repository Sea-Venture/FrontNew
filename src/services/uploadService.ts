import { API_VERSION } from '../config/api.config';
import { apiClient } from './apiClient';

export interface UploadResponse {
  data: any;
  data: any;
  success: boolean;
  url: string;
  filename: string;
  message?: string;
}

export const uploadFile = async (
  file: File,
  folder: string = 'guide-licences'
): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', folder);

  return apiClient.postFormData(`${API_VERSION.v1}/upload`, formData);
};
