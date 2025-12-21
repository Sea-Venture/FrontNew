import { API_BASE_URL } from './env.config';

export const API_BASE = API_BASE_URL;

export const API_VERSION = {
  v1: `${API_BASE}/v1`,
  v2: `${API_BASE}/v2`,

} as const;


export const CURRENT_API_VERSION = API_VERSION.v1;

export type ApiVersion = keyof typeof API_VERSION;
