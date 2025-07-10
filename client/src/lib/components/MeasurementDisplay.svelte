<script lang="ts">
  import { STATES, type DeviceState } from '$lib/bluetooth';
  import { Gauge, Eye, Thermometer, Coffee, Bluetooth } from 'lucide-svelte';

  export let isConnected: boolean;
  export let agtronLevel: number;
  export let particleSensorValue: number;
  export let meterState: DeviceState;

  function getAgtronColor(level: number): string {
    if (level == 0) return 'from-gray-600 to-gray-700';
    return 'from-yellow-900 to-amber-900';
  }

  function getAgtronDescription(level: number): string {
    if (level == 0) return 'Placez votre échantillon';
    if (level >= 108) return "Very Light";
    if (level >= 93) return "Light";
    if (level >= 79) return "Medium Light";
    if (level >= 64) return "Medium";
    if (level >= 49) return "Medium Dark";
    if (level >= 35) return "Dark";
    return "Very Dark";
  }

  function getGaugePercentage(value: number, max: number): number {
    return Math.min((value / max) * 100, 100);
  }
</script>

{#if !isConnected}
  <div class="mb-6 p-4 bg-red-700 border border-red-800 rounded-lg">
    <div class="flex items-center space-x-2">
      <Bluetooth class="h-5 w-5 text-red-50" />
      <p class="text-sm text-red-50 font-medium"><b>Roast meter</b> non connecté</p>
    </div>
  </div>
{:else}
  {#if meterState === STATES.READY}
    <div class="mb-6 p-4 bg-green-700 border border-green-800 rounded-lg">
      <div class="flex items-center space-x-2">
        <Coffee class="h-5 w-5 text-green-50" />
        <p class="text-sm text-green-50 font-medium">Placez votre échantillon</p>
      </div>
    </div>
  {:else if meterState === STATES.WARMUP || meterState === STATES.SETUP}
    <div class="mb-6 p-4 bg-yellow-700 border border-yellow-800 rounded-lg">
      <div class="flex items-center space-x-2">
        <Thermometer class="h-5 w-5 text-yellow-50" />
        <p class="text-sm text-yellow-50 font-medium">Préchauffage en cours...</p>
      </div>
    </div>
  {:else if meterState === STATES.MEASURED}
    <div class="mb-6 p-4 bg-cyan-700 border border-cyan-800 rounded-lg">
      <div class="flex items-center space-x-2">
        <Gauge class="h-5 w-5 text-cyan-50" />
        <p class="text-sm text-cyan-50 font-medium">Mesure en cours...</p>
      </div>
    </div>
  {/if}
{/if}

<div class="grid grid-cols-1 gap-6">
  <!-- Affichage Agtron -->
  <div class="bg-gradient-to-br {getAgtronColor(agtronLevel)} px-6 py-2 rounded-xl text-white">
    <div class="flex items-center justify-between mb-8">
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
        style="width: {getGaugePercentage(agtronLevel, 125)}%"
      ></div>
    </div>
    
    <div class="flex justify-between text-xs opacity-75 mt-2">
      <span>Dark</span>
      <span>Light</span>
    </div>
  </div>

  <!-- Affichage Capteur IR -->
  <!-- <div class="bg-gradient-to-br from-blue-500 to-indigo-600 px-6 py-2 rounded-xl text-white">
    <div class="flex items-center justify-between mb-8">
      <div class="flex items-center space-x-2">
        <Gauge class="h-6 w-6" />
        <h3 class="text-lg font-semibold">Capteur IR</h3>
      </div>
      <div class="text-right">
        <div class="text-3xl font-bold">{particleSensorValue.toLocaleString()}</div>
        <div class="text-sm opacity-75">Valeur brute</div>
      </div>
    </div>
    
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
  </div> -->
</div>
