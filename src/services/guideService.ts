import { API_VERSION } from '../config/api.config';
import { apiClient } from './apiClient';

export interface GuideRequest {
  id: number;
  NIC: string;
  phone: string;
  registrationNumber: string;
  licenceDocumentUrl: string;
  approved: boolean;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface GuideRequestsResponse {
  success?: boolean;
  data?: GuideRequest[];
  requests?: GuideRequest[];
}


export const getAllGuideRequests = async (): Promise<GuideRequest[]> => {
  const data = await apiClient.get(`${API_VERSION.v1}/guides/requests`);
  
  if (Array.isArray(data)) {
    return data;
  }
  
  return data.data || data.requests || [];
};


export const approveGuideRequest = async (
  requestId: number
): Promise<void> => {
  await apiClient.get(`${API_VERSION.v1}/guides/approve?id=${requestId}`);
};


export const rejectGuideRequest = async (
  requestId: number
): Promise<void> => {
  await apiClient.get(`${API_VERSION.v1}/guides/reject?id=${requestId}`);
};


export const updateGuideRequestStatus = async (
  requestId: number,
  approved: boolean
): Promise<void> => {
  if (approved) {
    await approveGuideRequest(requestId);
  } else {
    await rejectGuideRequest(requestId);
  }
};
