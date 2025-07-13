<script lang="ts">
  import '../app.css';
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { showSettings } from '$lib/stores';
  import { bluetoothService } from '$lib/bluetooth';
  import { Bluetooth, BluetoothConnected, Settings, BadgeHelp, Undo2} from 'lucide-svelte';

  let isConnected = false;

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
    console.log('Toggling settings visibility', showSettings);
		showSettings.toggle();
  }

  $: active = $page.url.pathname;
  $: isManual = active === '/manual';
  $: isHome = active === '/';
</script>

<div class="bg-gray-900">
  <!-- Header -->
  <header class="bg-gray-900">
    <div class="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center py-6">
        <div class="flex items-center space-x-3">
          <h1 class="text-2xl text-gray-200">
            <a href="/">Roast Pilot</a>
          </h1>
        </div>
        
        <div class="flex items-center space-x-4">
          {#if isConnected && isHome}
            <button
              on:click={toggleSettings}
              class="p-2 rounded-lg hover:bg-gray-700 transition-colors"
              class:bg-amber-800={$showSettings}
            >
              <Settings class="h-5 w-5 text-gray-200" />
            </button>
          {/if}
          
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
          {#if !isHome}
            <a href="/" aria-current={active === "/" ? true : undefined} class:active
              class="p-2 rounded-lg bg-green-800 hover:bg-green-700 transition-colors"
              class:bg-cyan-600={!isHome}
            >
              <Undo2 class="h-5 w-5 text-white"/>
            </a>
          {:else}
            <a href="/manual" aria-current={active === "/manual" ? true : undefined} class:active
                class="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
                class:bg-cyan-600={isManual}
              >
                <BadgeHelp class="h-5 w-5 text-white" />
            </a>
          {/if}
        </div>
      </div>
    </div>
  </header>

  <!-- Main Content -->
  <main class="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 py-8 pt-2">
    <slot />
  </main>
</div>