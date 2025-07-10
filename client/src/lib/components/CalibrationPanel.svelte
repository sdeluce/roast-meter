<script lang="ts">
  import { bluetoothService, type CalibrationSettings } from '$lib/bluetooth';
  import { Save, Undo2 } from 'lucide-svelte';

  export let calibrationSettings: CalibrationSettings;
  export let isConnected: boolean;

  let tempSettings = { ...calibrationSettings };
  let isSaving = false;

  // Réactiver tempSettings quand calibrationSettings change
  $: if (calibrationSettings) {
    tempSettings = { ...calibrationSettings };
  }

  async function saveSettings() {
    if (!isConnected) return;
    
    isSaving = true;
    
    try {
      await bluetoothService.updateLedBrightness(tempSettings.ledBrightness);
      // await bluetoothService.updateIntersectionPoint(tempSettings.intersectionPoint);
      // await bluetoothService.updateDeviation(tempSettings.deviation);
      // await bluetoothService.updateBleName(tempSettings.bleName);
      
      alert('Paramètres sauvegardés avec succès !');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde des paramètres');
    } finally {
      isSaving = false;
    }
  }

  function resetSettings() {
    tempSettings = { ...calibrationSettings };
  }

  // Fonction pour mettre à jour
  function updateLedBrightness(event: any) {
    tempSettings.ledBrightness = event.target.value;
    // tempSettings = { ...tempSettings }; // Forcer la réactivité
  }

  function hasChanges(): boolean {
    return JSON.stringify(tempSettings) !== JSON.stringify(calibrationSettings);
  }
</script>

<div class="bg-red-900/30 border-2 border-red-500 rounded-xl shadow-lg px-4 py-3">
  <div class="flex items-center justify-between mb-6">
    <div class="flex items-center space-x-2">
      <!-- <Settings class="h-6 w-6 text-gray-100" /> -->
      <h2 class="text-xl font-semibold text-gray-50">Calibration</h2>
    </div>
    
    <!-- {#if hasChanges()} -->
      <div class="flex items-center space-x-2">
        <button
          on:click={resetSettings}
          class="px-3 py-1 text-sm bg-gray-800 text-gray-50 rounded hover:bg-gray-900 transition-colors"
        >
          <Undo2 class="h-4 w-4" />
        </button>
        <button
          on:click={saveSettings}
          disabled={!isConnected}
          class="flex items-center text-sm space-x-2 px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Save class="h-4 w-4" />
          <span>{isSaving ? 'Sauvegarde...' : 'Sauvegarder'}</span>
        </button>
      </div>
    <!-- {/if} -->
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
     <!-- Luminosité LED -->
    <div class="space-y-2">
      <label for="deviation" class="block text-sm font-medium text-gray-100">
        Luminosité LED
      </label>
      <input
        id="deviation"
        type="number"
        step="1"
        min="0"
        max="255"
        value={tempSettings.ledBrightness}
        on:input={updateLedBrightness}
        disabled={!isConnected}
        class="input w-full text-black bg-white"
      />
      <p class="text-xs text-gray-200">Valeur entre 0 et 255</p>
    </div>

    <!-- Point d'intersection -->
     <div class="space-y-2">
      <label for="deviation" class="block text-sm font-medium text-gray-100">
        Point d'intersection
      </label>
      <input
        id="deviation"
        type="number"
        step="1"
        min="0"
        max="255"
        bind:value={tempSettings.intersectionPoint}
        disabled={true}
        class="input w-full bg-gray-300 text-gray-600"
      />
      <p class="text-xs text-gray-200">Valeur entre 50 et 200</p>
    </div>

    <!-- Déviation -->
    <div class="space-y-2">
      <label for="deviation" class="block text-sm font-medium text-gray-100">
        Déviation
      </label>
      <input
        id="deviation"
        type="number"
        step="0.001"
        min="0"
        max="1"
        bind:value={tempSettings.deviation}
        disabled={true}
        class="input w-full bg-gray-300 text-gray-600"
      />
      <p class="text-xs text-gray-200">Valeur entre 0 et 1</p>
    </div>

    <!-- Nom BLE -->
    <div class="space-y-2 mb-2">
      <label for="bleName" class="block text-sm font-medium text-gray-100">
        Nom Bluetooth
      </label>
      <input
        id="bleName"
        type="text"
        maxlength="63"
        bind:value={tempSettings.bleName}
        disabled={true}
        class="input w-full bg-gray-300 text-gray-600"
      />
    </div>
  </div>

  {#if !isConnected}
    <div class="mt-6 p-4 bg-red-800 border border-red-900 rounded-lg">
      <p class="text-sm text-red-50">
        Connectez-vous à votre roast meter pour modifier les paramètres de calibration.
      </p>
    </div>
  {/if}
</div>