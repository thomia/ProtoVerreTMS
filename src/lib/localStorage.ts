/**
 * Utilitaire pour gérer localStorage de manière sécurisée et éviter les boucles d'update
 */

// Vérifier si le code s'exécute dans un navigateur
const isBrowser = typeof window !== 'undefined';

/**
 * Récupérer une valeur du localStorage
 * @param key Clé de la valeur à récupérer
 * @returns La valeur récupérée, ou null si elle n'existe pas
 */
export function getLocalStorage(key: string): string | null {
  if (!isBrowser) return null;
  
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.error(`Erreur lors de la récupération de ${key} dans localStorage:`, error);
    return null;
  }
}

/**
 * Enregistrer une valeur dans le localStorage
 * @param key Clé pour stocker la valeur
 * @param value Valeur à stocker
 */
export function setLocalStorage(key: string, value: string): void {
  if (!isBrowser) return;
  
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.error(`Erreur lors de l'enregistrement de ${key} dans localStorage:`, error);
  }
}

/**
 * Supprimer une valeur du localStorage
 * @param key Clé de la valeur à supprimer
 */
export function removeLocalStorage(key: string): void {
  if (!isBrowser) return;
  
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Erreur lors de la suppression de ${key} du localStorage:`, error);
  }
}

/**
 * Effacer tout le localStorage
 */
export function clearLocalStorage(): void {
  if (!isBrowser) return;
  
  try {
    localStorage.clear();
  } catch (error) {
    console.error('Erreur lors de la suppression du localStorage:', error);
  }
}

/**
 * Émettre un événement 'storage' pour notifier d'un changement
 * @param key Clé qui a été modifiée
 */
export function emitStorageEvent(key: string = 'custom-storage-event'): void {
  if (!isBrowser) return;
  
  try {
    // Émettre l'événement storage standard
    window.dispatchEvent(new Event('storage'));
    
    // Émettre des événements personnalisés en fonction de la clé
    if (key.includes('flowRate') || key === 'custom-storage-event') {
      const flowRateValue = getLocalStorage('flowRate');
      if (flowRateValue) {
        const flowRate = Math.round(parseFloat(flowRateValue));
        const event = new CustomEvent('tapFlowRateUpdated', { 
          detail: { flowRate } 
        });
        window.dispatchEvent(event);
      }
    }
    
    if (key.includes('glassCapacity') || key === 'custom-storage-event') {
      const capacityValue = getLocalStorage('glassCapacity');
      if (capacityValue) {
        const capacity = Math.round(parseFloat(capacityValue));
        const event = new CustomEvent('glassCapacityUpdated', { 
          detail: { capacity } 
        });
        window.dispatchEvent(event);
      }
    }
    
    if (key.includes('stormIntensity') || key === 'custom-storage-event') {
      const intensityValue = getLocalStorage('stormIntensity');
      if (intensityValue) {
        const intensity = Math.round(parseFloat(intensityValue));
        const event = new CustomEvent('stormIntensityUpdated', { 
          detail: { intensity } 
        });
        window.dispatchEvent(event);
      }
    }
  } catch (error) {
    console.error('Erreur lors de l\'émission de l\'événement storage:', error);
  }
}