<script lang="ts">
  import { onMount } from 'svelte';
  import { bluetoothService, STATES, type RoastMeterData, type CalibrationSettings } from '$lib/bluetooth';
  import CalibrationPanel from '$lib/components/CalibrationPanel.svelte';
  import MeasurementDisplay from '$lib/components/MeasurementDisplay.svelte';
  import StatusIndicator from '$lib/components/StatusIndicator.svelte';
  import { showSettings } from '$lib/stores';

  let data: RoastMeterData = {
    agtronLevel: 0,
    particleSensorValue: 0,
    meterState: STATES.SETUP
  };

  let calibrationSettings: CalibrationSettings = {
    ledBrightness: 135,
    intersectionPoint: 117,
    deviation: 0.165,
    bleName: 'Roast Meter'
  };

  let isConnected = false;
  let isBluetoothSupported = false;

  onMount(() => {
    isBluetoothSupported = bluetoothService.isBluetoothSupported();
    
    bluetoothService.isConnected.subscribe(value => {
      isConnected = value;
    });
    
    bluetoothService.data.subscribe(value => {
      data = value;
    });
    
    bluetoothService.calibrationSettings.subscribe(value => {
      calibrationSettings = value;
    });
  });

  function getStateText(state: number): string {
    switch (state) {
      case STATES.SETUP: return 'Préchauffage';
      case STATES.WARMUP: return 'Préchauffage';
      case STATES.READY: return 'Prêt';
      case STATES.MEASURED: return 'Mesure';
      default: return 'Inconnu';
    }
  }

  function getStateColor(state: number): string {
    switch (state) {
      case STATES.SETUP: return 'bg-yellow-500';
      case STATES.WARMUP: return 'bg-yellow-500';
      case STATES.READY: return 'bg-green-500';
      case STATES.MEASURED: return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  }
</script>

<svelte:head>
  <title>Roast Pilot BLE</title>
</svelte:head>

{#if !isBluetoothSupported}
  <div class="text-center py-12">
    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl">
      <p class="font-bold">Bluetooth non supporté</p>
      <p>Votre navigateur ne supporte pas l'API Web Bluetooth.</p>
    </div>
  </div>
{:else}
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <!-- Panneau de mesure principal -->
    <div class="lg:col-span-2">
      <div class="bg-gray-800 rounded-xl shadow-lg p-4 px-6 pb-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold text-gray-200">Mesure</h2>
          <StatusIndicator 
            {isConnected} 
            state={data.meterState}
            stateText={getStateText(data.meterState)}
            stateColor={getStateColor(data.meterState)}
          />
        </div>

        <MeasurementDisplay 
          {isConnected}
          agtronLevel={data.agtronLevel}
          particleSensorValue={data.particleSensorValue}
          meterState={data.meterState}
        />
      </div>
    </div>

    <!-- Panneau de statut et info -->
    <div class="space-y-6">
      <!-- Statut de connexion -->
      <div class="bg-gray-800 rounded-xl shadow-lg p-4 px-6">
        <h3 class="text-lg font-semibold text-gray-100 mb-4">Statut</h3>
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-gray-200">Connexion</span>
            <span class="px-2 py-1 rounded-full text-xs font-medium"
                  class:bg-green-100={isConnected}
                  class:text-green-800={isConnected}
                  class:bg-red-100={!isConnected}
                  class:text-red-800={!isConnected}>
              {isConnected ? 'Connecté' : 'Déconnecté'}
            </span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-gray-200">Appareil</span>
            <span class="text-sm text-gray-400">{calibrationSettings.bleName}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-gray-200">État</span>
            {#if !isConnected}
              <span class="text-sm text-gray-400">Non connecté</span>
            {:else}
              <span class="px-2 py-1 rounded-full text-xs font-medium {getStateColor(data.meterState)} text-white">
                {getStateText(data.meterState)}
              </span>
            {/if}
          </div>
        </div>
      </div>

      <!-- Informations sur les mesures -->
      <!-- <div class="bg-white rounded-xl shadow-lg p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">À propos des mesures</h3>
        <div class="space-y-3 text-sm text-gray-600">
          <div>
            <p class="font-medium text-gray-900">Agtron</p>
            <p>Échelle de 0 à 100+ pour mesurer la couleur de torréfaction</p>
          </div>
          <div>
            <p class="font-medium text-gray-900">Capteur IR</p>
            <p>Valeur brute du capteur infrarouge</p>
          </div>
        </div>
      </div> -->
    </div>
    <!-- Panneau de calibration -->
     <h1 class="text-pink-500">{$showSettings}</h1>
    {#if $showSettings}
      <div class="lg:col-span-3">
        <CalibrationPanel {calibrationSettings} {isConnected} />
      </div>
    {/if}
  </div>
{/if}