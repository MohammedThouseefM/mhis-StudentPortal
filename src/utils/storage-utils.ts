/**
 * Storage utility functions for browser localStorage
 */

/**
 * Save data to localStorage
 * @param key - The key to store the data under
 * @param data - The data to store
 */
export const saveToStorage = (key: string, data: any): void => {
  try {
    if (typeof window !== 'undefined') {
      const serializedData = JSON.stringify(data);
      localStorage.setItem(key, serializedData);
    }
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

/**
 * Load data from localStorage
 * @param key - The key to retrieve data from
 * @param defaultValue - Default value to return if key doesn't exist
 * @returns The stored data or defaultValue if not found
 */
export const loadFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    if (typeof window !== 'undefined') {
      const serializedData = localStorage.getItem(key);
      if (serializedData === null) {
        return defaultValue;
      }
      return JSON.parse(serializedData) as T;
    }
    return defaultValue;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return defaultValue;
  }
};

/**
 * Get the total storage usage in bytes
 * @returns Total storage usage in bytes
 */
export const getTotalStorageUsage = (): number => {
  try {
    if (typeof window !== 'undefined') {
      let totalSize = 0;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          const value = localStorage.getItem(key) || '';
          totalSize += key.length + value.length;
        }
      }
      return totalSize;
    }
    return 0;
  } catch (error) {
    console.error('Error calculating storage usage:', error);
    return 0;
  }
};

/**
 * Clean up old or unused items from localStorage
 * @param keysToKeep - Array of keys to keep
 */
export const cleanupStorage = (keysToKeep: string[]): void => {
  try {
    if (typeof window !== 'undefined') {
      const keysToRemove: string[] = [];
      
      // Identify keys to remove
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && !keysToKeep.includes(key)) {
          keysToRemove.push(key);
        }
      }
      
      // Remove the identified keys
      keysToRemove.forEach(key => localStorage.removeItem(key));
    }
  } catch (error) {
    console.error('Error cleaning up localStorage:', error);
  }
};