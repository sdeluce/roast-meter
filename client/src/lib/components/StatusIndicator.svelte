<script lang="ts">
  import { Wifi, WifiOff } from 'lucide-svelte';

  export let isConnected: boolean;
  export let state: number;
  export let stateText: string;
  export let stateColor: string;
</script>

<div class="flex items-center space-x-3">
  <div class="flex items-center space-x-2">
    {#if isConnected}
      <Wifi class="h-4 w-4 text-green-500" />
      <span class="text-sm text-green-600">Connecté</span>
    {:else}
      <WifiOff class="h-4 w-4 text-red-500" />
      <span class="text-sm text-red-600">Déconnecté</span>
    {/if}
  </div>
  
  <div class="h-4 w-px bg-gray-300"></div>
  
  <div class="flex items-center space-x-2">
    <div class="h-3 w-3 rounded-full {stateColor}"></div>
    <span class="text-sm text-gray-700">{stateText}</span>
  </div>
</div>