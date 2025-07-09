<script lang="ts">
  import { STATES, type DeviceState } from '$lib/bluetooth';
  import { Gauge, Eye, Thermometer } from 'lucide-svelte';

  export let agtronLevel: number;
  export let particleSensorValue: number;
  export let meterState: DeviceState;

  function getAgtronColor(level: number): string {
    if (level < 30) return 'from-yellow-800 to-amber-900';
    if (level < 50) return 'from-amber-700 to-yellow-700';
    if (level < 70) return 'from-yellow-600 to-amber-600';
    if (level < 90) return 'from-amber-500 to-yellow-500';
    return 'from-yellow-400 to-amber-400';
  }

  function getAgtronDescription(level: number): string {
    if (level < 30) return 'Torréfaction très foncée';
    if (level < 50) return 'Torréfaction foncée';
    if (level < 70) return 'Torréfaction moyenne';
    if (level < 90) return 'Torréfaction claire';
    return 'Torréfaction très claire';
  }

  function getGaugePercentage(value: number, max: number): number {
    return Math.min((value / max) * 100, 100);
  }
</script>

<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
  <!-- Affichage Agtron -->
  <div class="bg-gradient-to-br {getAgtronColor(agtronLevel)} p-6 rounded-xl text-white">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center space-x-2">
        <Eye class="h-6 w-6" />
        <h3 class="text-lg font-semibold">Agtron</h3>
      </div>
      <div class="text-right">
        <div class="text-3xl font-bold">{agtronLevel}</div>
        <div class="text-sm opacity-75">{getAgtronDescription(agtronLevel)}</div>
      </div>
    </div>
    
    <!-- Barre de progression Agtron -->
    <div class="bg-white/20 rounded-full h-3 overflow-hidden">
      <div 
        class="h-full bg-white/60 transition-all duration-300 ease-out"
        style="width: {getGaugePercentage(agtronLevel, 100)}%"
      ></div>
    </div>
    
    <div class="flex justify-between text-xs opacity-75 mt-2">
      <span>Foncé</span>
      <span>Clair</span>
    </div>
  </div>

  <!-- Affichage Capteur IR -->
  <div class="bg-gradient-to-br from-blue-500 to-indigo-600 p-6 rounded-xl text-white">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center space-x-2">
        <Gauge class="h-6 w-6" />
        <h3 class="text-lg font-semibold">Capteur IR</h3>
      </div>
      <div class="text-right">
        <div class="text-3xl font-bold">{particleSensorValue.toLocaleString()}</div>
        <div class="text-sm opacity-75">Valeur brute</div>
      </div>
    </div>
    
    <!-- Barre de progression Capteur -->
    <div class="bg-white/20 rounded-full h-3 overflow-hidden">
      <div 
        class="h-full bg-white/60 transition-all duration-300 ease-out"
        style="width: {getGaugePercentage(particleSensorValue, 65535)}%"
      ></div>
    </div>
    
    <div class="flex justify-between text-xs opacity-75 mt-2">
      <span>0</span>
      <span>65535</span>
    </div>
  </div>
</div>

{#if meterState === STATES.READY}
  <div class="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
    <div class="flex items-center space-x-2">
      <Thermometer class="h-5 w-5 text-green-600" />
      <p class="text-sm text-green-800 font-medium">Appareil prêt - Placez votre échantillon</p>
    </div>
  </div>
{:else if meterState === STATES.WARMUP}
  <div class="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
    <div class="flex items-center space-x-2">
      <Thermometer class="h-5 w-5 text-yellow-600" />
      <p class="text-sm text-yellow-800 font-medium">Préchauffage en cours...</p>
    </div>
  </div>
{:else if meterState === STATES.SETUP}
  <div class="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
    <div class="flex items-center space-x-2">
      <Gauge class="h-5 w-5 text-gray-600" />
      <p class="text-sm text-gray-800 font-medium">Configuration en cours...</p>
    </div>
  </div>
{/if}