import { writable, type Writable } from 'svelte/store';

// on Android Chrome
window.matchMedia(
  '(display-mode: standalone)'
).matches


// UUIDs depuis votre code Arduino
const ROAST_METER_SERVICE_UUID = '875a0ee0-03dd-4225-ae06-35e8ae92b84c';
const PARTICLE_SENSOR_UUID = 'c32afdba-e9f2-453e-9612-85fbf4108ab2';
const AGTRON_UUID = 'ce216811-0ad9-4aff-ae29-8b171093a95f';
const METER_STATE_UUID = '8ace2828-996f-48e4-8e9c-8284678b4b57';

const SETTING_SERVICE_UUID = '59021473-dfc6-425a-9729-09310ebe535e';
const LED_BRIGHTNESS_UUID = '8313695f-3ea1-458b-bd2a-df4aee218514';
const INTERSECTION_POINT_UUID = '69548c4b-87d0-4e3e-ac6c-b143c7b2ab30';
const DEVIATION_UUID = 'd17234fa-0f48-429a-9e9b-f5db774ef682';
const BLE_NAME_UUID = 'cde44fd7-4c1e-42a0-8368-531dc87f6b56';

// États du device
export const STATES = {
  SETUP: 0,
  WARMUP: 1,
  READY: 2,
  MEASURED: 3
} as const;

export type DeviceState = typeof STATES[keyof typeof STATES];

export interface RoastMeterData {
  agtronLevel: number;
  particleSensorValue: number;
  meterState: DeviceState;
}

export interface CalibrationSettings {
  ledBrightness: number;
  intersectionPoint: number;
  deviation: number;
  bleName: string;
}

class BluetoothService {
  private device: BluetoothDevice | null = null;
  private server: BluetoothRemoteGATTServer | null = null;
  private roastMeterService: BluetoothRemoteGATTService | null = null;
  private settingService: BluetoothRemoteGATTService | null = null;
  
  // Stores Svelte
  public isConnected: Writable<boolean> = writable(false);
  public data: Writable<RoastMeterData> = writable({
    agtronLevel: 0,
    particleSensorValue: 0,
    meterState: STATES.SETUP
  });
  public calibrationSettings: Writable<CalibrationSettings> = writable({
    ledBrightness: 135,
    intersectionPoint: 117,
    deviation: 0.165,
    bleName: 'Roast Meter'
  });

  async connect(): Promise<void> {
    console.log('Tentative de connexion Bluetooth...');
    try {
      console.log('Vérification de la compatibilité Bluetooth...');
      if (!navigator.bluetooth) {
        throw new Error('Bluetooth API non disponible dans ce navigateur');
      }

      console.log('Demande de l’appareil Bluetooth...');
      // Demander l'appareil Bluetooth
      this.device = await navigator.bluetooth.requestDevice({
        filters: [{ services: [ROAST_METER_SERVICE_UUID] }],
        optionalServices: [SETTING_SERVICE_UUID]
      });

      console.log('Appareil Bluetooth sélectionné:', this.device.name);
      if (!this.device.gatt) {
        throw new Error('GATT non disponible sur cet appareil');
      }

      // Connexion au serveur GATT
      this.server = await this.device.gatt!.connect();
      console.log('Connexion GATT établie avec succès');

      // Vérifier que la connexion est établie
      if (!this.server.connected) {
        throw new Error('Échec de la connexion GATT');
      }
      
      // Obtenir les services
      this.roastMeterService = await this.server.getPrimaryService(ROAST_METER_SERVICE_UUID);
      this.settingService = await this.server.getPrimaryService(SETTING_SERVICE_UUID);

      // Configurer les notifications
      await this.setupNotifications();
      
      // Charger les paramètres de calibration
      await this.loadCalibrationSettings();

      // Gérer la déconnexion
      this.device.addEventListener('gattserverdisconnected', () => {
        this.isConnected.set(false);
        this.device = null;
        this.server = null;
        this.roastMeterService = null;
        this.settingService = null;
      });

      this.isConnected.set(true);
    } catch (error) {
      this.isConnected.set(false);
      console.error('Erreur de connexion Bluetooth:', error);
      throw error;
    }
  }

  private async setupNotifications(): Promise<void> {
    if (!this.roastMeterService) return;

    try {
      // Notification pour Agtron
      const agtronCharacteristic = await this.roastMeterService.getCharacteristic(AGTRON_UUID);
      await agtronCharacteristic.startNotifications();
      agtronCharacteristic.addEventListener('characteristicvaluechanged', (event) => {
        const value = (event.target as BluetoothRemoteGATTCharacteristic).value!;
        const agtronLevel = value.getUint8(0);
        this.data.update(d => ({ ...d, agtronLevel }));
      });

      // Notification pour le capteur de particules
      const particleSensorCharacteristic = await this.roastMeterService.getCharacteristic(PARTICLE_SENSOR_UUID);
      await particleSensorCharacteristic.startNotifications();
      particleSensorCharacteristic.addEventListener('characteristicvaluechanged', (event) => {
        const value = (event.target as BluetoothRemoteGATTCharacteristic).value!;
        const particleSensorValue = value.getUint32(0, true);
        this.data.update(d => ({ ...d, particleSensorValue }));
      });

      // Notification pour l'état du mètre
      const meterStateCharacteristic = await this.roastMeterService.getCharacteristic(METER_STATE_UUID);
      await meterStateCharacteristic.startNotifications();
      meterStateCharacteristic.addEventListener('characteristicvaluechanged', (event) => {
        const value = (event.target as BluetoothRemoteGATTCharacteristic).value!;
        const meterState = value.getUint8(0) as DeviceState;
        this.data.update(d => ({ ...d, meterState }));
      });
    } catch (error) {
      console.error('Erreur configuration notifications:', error);
    }
  }

  private async loadCalibrationSettings(): Promise<void> {
    if (!this.settingService) return;

    try {
      const ledBrightnessChar = await this.settingService.getCharacteristic(LED_BRIGHTNESS_UUID);
      const ledBrightnessValue = await ledBrightnessChar.readValue();
      const ledBrightness = ledBrightnessValue.getUint8(0);

      const intersectionPointChar = await this.settingService.getCharacteristic(INTERSECTION_POINT_UUID);
      const intersectionPointValue = await intersectionPointChar.readValue();
      const intersectionPoint = intersectionPointValue.getUint8(0);

      const deviationChar = await this.settingService.getCharacteristic(DEVIATION_UUID);
      const deviationValue = await deviationChar.readValue();
      const deviation = deviationValue.getFloat32(0, true);

      const bleNameChar = await this.settingService.getCharacteristic(BLE_NAME_UUID);
      const bleNameValue = await bleNameChar.readValue();
      const bleName = new TextDecoder().decode(bleNameValue);

      this.calibrationSettings.set({
        ledBrightness,
        intersectionPoint,
        deviation,
        bleName
      });
    } catch (error) {
      console.error('Erreur chargement paramètres:', error);
    }
  }

  async updateLedBrightness(value: number): Promise<void> {
    if (!this.settingService) throw new Error('Service non connecté');
    
    try {
      const characteristic = await this.settingService.getCharacteristic(LED_BRIGHTNESS_UUID);
      const buffer = new ArrayBuffer(1);
      const view = new DataView(buffer);
      view.setUint8(0, value);
      await characteristic.writeValue(buffer);
      
      this.calibrationSettings.update(s => ({ ...s, ledBrightness: value }));
    } catch (error) {
      console.error('Erreur mise à jour LED brightness:', error);
      throw error;
    }
  }

  async updateIntersectionPoint(value: number): Promise<void> {
    if (!this.settingService) throw new Error('Service non connecté');
    
    try {
      const characteristic = await this.settingService.getCharacteristic(INTERSECTION_POINT_UUID);
      const buffer = new ArrayBuffer(1);
      const view = new DataView(buffer);
      view.setUint8(0, value);
      await characteristic.writeValue(buffer);
      
      this.calibrationSettings.update(s => ({ ...s, intersectionPoint: value }));
    } catch (error) {
      console.error('Erreur mise à jour intersection point:', error);
      throw error;
    }
  }

  async updateDeviation(value: number): Promise<void> {
    if (!this.settingService) throw new Error('Service non connecté');
    
    try {
      const characteristic = await this.settingService.getCharacteristic(DEVIATION_UUID);
      const buffer = new ArrayBuffer(4);
      const view = new DataView(buffer);
      view.setFloat32(0, value, true);
      await characteristic.writeValue(buffer);
      
      this.calibrationSettings.update(s => ({ ...s, deviation: value }));
    } catch (error) {
      console.error('Erreur mise à jour deviation:', error);
      throw error;
    }
  }

  async updateBleName(value: string): Promise<void> {
    if (!this.settingService) throw new Error('Service non connecté');
    
    try {
      const characteristic = await this.settingService.getCharacteristic(BLE_NAME_UUID);
      const encoder = new TextEncoder();
      const buffer = encoder.encode(value);
      await characteristic.writeValue(buffer);
      
      this.calibrationSettings.update(s => ({ ...s, bleName: value }));
    } catch (error) {
      console.error('Erreur mise à jour BLE name:', error);
      throw error;
    }
  }

  disconnect(): void {
    if (this.device?.gatt?.connected) {
      this.device.gatt.disconnect();
    }
  }

  isBluetoothSupported(): boolean {
    return 'bluetooth' in navigator;
  }
}

export const bluetoothService = new BluetoothService();