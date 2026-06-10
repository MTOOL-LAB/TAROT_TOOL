
import { TarotReading } from '../types';

export const importReadingFromJSON = async (file: File): Promise<TarotReading | TarotReading[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      try {
        const data = JSON.parse(content);
        resolve(data);
      } catch (err) {
        reject(new Error("Invalid JSON format."));
      }
    };
    reader.onerror = () => reject(new Error("Failed to read file."));
    reader.readAsText(file);
  });
};

export const importReadingFromHTML = async (file: File): Promise<TarotReading> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (!content) {
        reject(new Error("File is empty."));
        return;
      }

      try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(content, 'text/html');
        const scriptTag = doc.getElementById('tarot-raw-data');
        
        if (!scriptTag) {
          throw new Error("Invalid file format: No Arcanum metadata found.");
        }

        const jsonData = JSON.parse(scriptTag.textContent || '{}');
        
        // Basic schema verification
        if (!jsonData.id || !jsonData.query || !Array.isArray(jsonData.cards)) {
          throw new Error("The file data appears corrupted or invalid.");
        }

        resolve(jsonData as TarotReading);
      } catch (err) {
        reject(err instanceof Error ? err : new Error("An unknown error occurred during parsing."));
      }
    };

    reader.onerror = () => reject(new Error("Failed to read the file."));
    reader.readAsText(file);
  });
};
