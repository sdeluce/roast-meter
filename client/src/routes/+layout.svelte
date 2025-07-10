<script lang="ts">
  import '../app.css';
  import { onMount, setContext } from 'svelte';
	import { writable } from 'svelte/store';
  import { bluetoothService } from '$lib/bluetooth';
  import { Bluetooth, BluetoothConnected, Settings, Coffee } from 'lucide-svelte';

  let isConnected = false;
  let showSettings = writable(false);
	
	setContext('showSettings', showSettings);

  onMount(() => {
		bluetoothService.isConnected.subscribe(value => {
			isConnected = value;
    });
  });
	
  async function connectBluetooth() {
		try {
			await bluetoothService.connect();
    } catch (error) {
      console.error('Erreur de connexion:', error);
      alert('Erreur de connexion Bluetooth');
    }
  }

  function disconnect() {
		bluetoothService.disconnect();
  }
	
  function toggleSettings() {
		$showSettings = !$showSettings;
  }
</script>

<div class="bg-gray-900">
  <!-- Header -->
  <header class="bg-gray-900">
    <div class="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center py-6">
        <div class="flex items-center space-x-3">
          <h1 class="text-2xl text-gray-200">Roast Pilot</h1>
        </div>
        
        <div class="flex items-center space-x-4">
          <button
            on:click={toggleSettings}
            class="p-2 rounded-lg hover:bg-gray-700 transition-colors"
            class:bg-amber-800={$showSettings}
          >
            <Settings class="h-5 w-5 text-gray-200" />
          </button>
          
          {#if isConnected}
            <button
              on:click={disconnect}
              class="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <BluetoothConnected class="h-4 w-4" />
              <span>Déconnecter</span>
            </button>
          {:else}
            <button
              on:click={connectBluetooth}
              class="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Bluetooth class="h-4 w-4" />
              <span>Connecter</span>
            </button>
          {/if}
        </div>
      </div>
    </div>
  </header>

  <!-- Main Content -->
  <main class="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 py-8 pt-2">
    <slot {showSettings} />
  </main>
</div>