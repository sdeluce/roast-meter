// VERSION 1.0.1-beta
#include <SFE_MicroOLED.h>
#include <Wire.h>

#include "MAX30105.h"

#define PIN_RESET 9
#define DC_JUMPER 1

MAX30105 particleSensor;
MicroOLED oled(PIN_RESET, DC_JUMPER);

long unblockedValue;  // Average IR at power up

String multiplyChar(char c, int n) {
  String result = "";
  for (int i = 0; i < n; i++) {
    result += c;
  }
  return result;
}

void displayMeasurement(int rLevel) {
  oled.clear(PAGE);
  oled.flipVertical(true);
  oled.flipHorizontal(true);
  int yPos = 4;
  oled.setCursor(0, yPos);

  int calibratedReading = f(rLevel);
  int centerPadding = 4 - String(calibratedReading).length();
  String paddingText = multiplyChar(' ', centerPadding);

  if (rLevel == 0) {
    int startX = (64 - 4*6) / 2;
    oled.setCursor(startX, 0 + yPos);
    oled.setFontType(0);  // Taille moyenne (souvent 6x8 ou 7x10 selon la lib)
    oled.print("Load");
    startX = (64 - 6*6) / 2;
    oled.setCursor(startX, 12 + yPos); // Ligne suivante
    oled.print("ground");
    oled.setCursor(startX, 24 + yPos); // Encore une ligne en bas
    oled.print("coffee");
    oled.display();
    return;
  }

  oled.setFontType(2);
  oled.print(paddingText);
  oled.print(calibratedReading);

  String roastText = getSCAName(calibratedReading);
  int textWidth = roastText.length() * 6; // 5 px par caractère + 1 px d'espacement
  int startX = (64 - textWidth) / 2;
  oled.setCursor(startX, 28);
  oled.setFontType(0);
  oled.print(roastText);
  

  Serial.println("real:" + String(rLevel));
  Serial.println("agtron:" + String(calibratedReading));
  Serial.println("===========================");

  oled.display();
}

String getSCAName(int agtronValue) {
  if (agtronValue >= 0 && agtronValue <= 130) {
    if (agtronValue >= 108) return "V.Light";       // Very Light
    if (agtronValue >= 93) return "Light";
    if (agtronValue >= 79) return "M.Light";
    if (agtronValue >= 64) return "Medium";
    if (agtronValue >= 49) return "Med-Dark";      // Medium-Dark
    if (agtronValue >= 35) return "Dark";
    if (agtronValue >= 23) return "V.Dark";        // Very Dark
    return "X.Dark";                               // Extremely Dark
  }
  return "Unknown";
}

int f(int x) {
  int intersectionPoint = 117;
  float deviation = 0.165;

  return round(x - (intersectionPoint - x) * deviation);
}

void setup() {
  Serial.begin(9600);

  Wire.begin();
  oled.begin();      // Initialize the OLED
  oled.clear(ALL);   // Clear the display's internal memory
  oled.clear(PAGE);  // Clear the buffer.
  oled.flipVertical(true);
  oled.flipHorizontal(true);

  delay(100);  // Delay 100 ms
  oled.setFontType(3);

  // Initialize sensor
  if (particleSensor.begin(Wire, I2C_SPEED_FAST) == false)  // Use default I2C port, 400kHz speed
  {
    Serial.println("MAX30105 was not found. Please check wiring/power. ");
    while (1)
      ;
  }

  // The variable below calibrates the LED output on your hardware.
  byte ledBrightness = 133;

  byte sampleAverage = 8;  // Options: 1, 2, 4, 8, 16, --32--
  byte ledMode = 2;        // Options: 1 = Red only, --2 = Red + IR--, 3 = Red + IR + Green
  int sampleRate = 50;     // Options: 50, 100, 200, 400, 800, 1000, 1600, --3200--
  int pulseWidth = 411;    // Options: 69, 118, 215, --411--
  int adcRange = 16384;    // Options: 2048, --4096--, 8192, 16384

  particleSensor.setup(ledBrightness, sampleAverage, ledMode, sampleRate, pulseWidth, adcRange);  // Configure sensor with these settings

  particleSensor.setPulseAmplitudeRed(0);
  particleSensor.setPulseAmplitudeGreen(0);

  particleSensor.disableSlots();
  particleSensor.enableSlot(2, 0x02);  // Enable only SLOT_IR_LED = 0x02

  // Update to ignore readings under 30.000
  unblockedValue = 30000;
}

void loop() {
  int rLevel = particleSensor.getIR();
  long currentDelta = rLevel - unblockedValue;

  if (currentDelta > (long)100) {
    displayMeasurement(rLevel / 1000);
  } else {
    displayMeasurement(0);
  }
  delay(100);
}
