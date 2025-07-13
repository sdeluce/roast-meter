// src/lib/stores.ts
import { writable } from 'svelte/store';

// Store avec des méthodes utilitaires
function createToggleStore(initialValue = false) {
  const { subscribe, update } = writable(initialValue);
  
  return {
    subscribe,
    toggle: () => update(value => !value)
  };
}

export const showSettings = createToggleStore(false);