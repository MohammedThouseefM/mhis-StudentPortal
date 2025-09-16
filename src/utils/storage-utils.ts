/**
 * Storage utility functions for managing localStorage with compression support
 */

/**
 * Saves data to localStorage with optional compression for large objects
 * @param key The localStorage key
 * @param data The data to store
 * @returns boolean indicating success
 */
export function saveToStorage<T>(key: string, data: T): boolean {
  try {
    const serialized = JSON.stringify(data);
    localStorage.setItem(key, serialized);
    return true;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    return false;
  }
}

/**
 * Loads data from localStorage with decompression if needed
 * @param key The localStorage key
 * @param defaultValue Default value if key doesn't exist
 * @returns The stored data or default value
 */
export function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const serialized = localStorage.getItem(key);
    if (serialized === null) {
      return defaultValue;
    }
    return JSON.parse(serialized) as T;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return defaultValue;
  }
}

/**
 * Gets the total storage usage in bytes
 * @returns The total storage usage in bytes
 */
export function getTotalStorageUsage(): number {
  let total = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) {
      const value = localStorage.getItem(key) || '';
      total += key.length + value.length;
    }
  }
  return total * 2; // Approximate bytes (2 bytes per character in UTF-16)
}

/**
 * Cleans up storage by removing all items except those in the keepList
 * @param keepList List of keys to keep
 */
export function cleanupStorage(keepList: string[] = []): void {
  const keysToRemove: string[] = [];
  
  // First, collect all keys that aren't in the keepList
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && !keepList.includes(key)) {
      keysToRemove.push(key);
    }
  }
  
  // Then remove them
  keysToRemove.forEach(key => {
    localStorage.removeItem(key);
  });
}