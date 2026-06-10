
import { TarotReading } from '../types';

const STORAGE_KEY = 'arcanum_readings';

export const StorageManager = {
  getReadings: (): TarotReading[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Failed to load readings", e);
      return [];
    }
  },

  saveReading: (reading: TarotReading): void => {
    const readings = StorageManager.getReadings();
    const exists = readings.findIndex(r => r.id === reading.id);
    if (exists > -1) {
      readings[exists] = reading;
    } else {
      readings.push(reading);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(readings));
  },

  deleteReading: (id: string): void => {
    const readings = StorageManager.getReadings().filter(r => r.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(readings));
  },

  clearAll: (): void => {
    localStorage.removeItem(STORAGE_KEY);
  }
};
