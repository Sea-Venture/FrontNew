import { API_VERSION } from '@/config/api.config';
import { apiClient } from './apiClient';

export interface WeatherForecastItem {
  time: string;
  status: string;
  wave_height: number;
  wave_period: number;
}

export interface WeatherDetails {
  forecast?: {
    city: string;
    lat: number;
    lon: number;
    verdict?: string;
    items?: WeatherForecastItem[];
  };
  prediction?: any;
  currentWeather?: any;
}

export const weatherService = {
  async getWeatherDetails(city: string): Promise<WeatherDetails> {
    const endpoint = `${API_VERSION.v1}/weather/details?city=${encodeURIComponent(city)}`;
    const resp = await apiClient.get(endpoint);
    return resp;
  },
};
