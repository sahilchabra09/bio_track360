#include <Wire.h>
#include <math.h> 
#include <MPU6050.h>
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClientSecure.h>
#include <ArduinoJson.h>

MPU6050 mpu;

const char* ssid = "paras1";         // Wi-Fi SSID
const char* password = "11111111";   // Wi-Fi Password
const char* API_ENDPOINT = "https://rehab360.pythonanywhere.com/api/sensor-data/"; // HTTPS URL

const float FALL_THRESHOLD_LOW = 0.5;   
const float FALL_THRESHOLD_HIGH = 2.5;  
const float RUNNING_THRESHOLD_HIGH = 3.5; 
const unsigned long FALL_DEBOUNCE_TIME = 2000; 
const unsigned long RUN_DETECTION_TIME = 1000; 

int16_t accelX, accelY, accelZ;
int16_t gyroX, gyroY, gyroZ;

unsigned long fallDetectedTime = 0;
bool fallDetected = false;

unsigned long runningStartTime = 0;
bool runningDetected = false;

const int ecgTransistorPin = 13;
const int thermistorPin = A0;   
const int thermistorTransistorPin = 12; 
const float referenceResistance = 1000.0;  
const float nominalResistance = 2600.0;  
const float nominalTemperature = 25.0; 
const float bCoefficient = 3950.0;       
const int adcMaxValue = 1023;          
const float supplyVoltage = 3.3;         
const int alertPin = 2; // GPIO 2 for toggling

void setup() {
  Serial.begin(115200);  // Increased baud rate
  Wire.begin();

  pinMode(ecgTransistorPin, OUTPUT);
  digitalWrite(ecgTransistorPin, LOW); 
  pinMode(thermistorTransistorPin, OUTPUT);
  digitalWrite(thermistorTransistorPin, LOW);
  pinMode(thermistorPin, INPUT);
  pinMode(alertPin, OUTPUT);
  digitalWrite(alertPin, LOW); // Initialize alert pin to LOW

  Serial.println("Initializing MPU6050...");
  mpu.initialize();
  
  // Check MPU6050 connection
  if (mpu.testConnection()) {
    Serial.println("MPU6050 connection successful");
  } else {
    Serial.println("MPU6050 connection failed");
    while (1);
  }

  // Connect to Wi-Fi
  Serial.print("Connecting to Wi-Fi");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nConnected to Wi-Fi");
}

void loop() {
  digitalWrite(thermistorTransistorPin, HIGH);
  digitalWrite(ecgTransistorPin, LOW);
  delay(100);

  float avgTemperature = 0;
  int ecgData[140];
  int ecgIndex = 0;

  // First loop for temperature reading and acceleration
  for (int i = 0; i < 8; i++) { 
    mpu.getMotion6(&accelX, &accelY, &accelZ, &gyroX, &gyroY, &gyroZ);

    float totalAccel = calculateTotalAcceleration(accelX, accelY, accelZ);

    detectRunning(totalAccel);

    if (!runningDetected) {
      detectFall(totalAccel);
    }
    
    int adcValue = analogRead(thermistorPin);
    float voltage = adcValue * supplyVoltage / adcMaxValue;
    float thermistorResistance = referenceResistance * (supplyVoltage / voltage - 1);
    float temperatureC = calculateTemperature(thermistorResistance);

    avgTemperature += temperatureC;

    delay(50);  
  }

  avgTemperature /= 8;  // Calculate average temperature

  digitalWrite(ecgTransistorPin, HIGH); 
  digitalWrite(thermistorTransistorPin, LOW);
  delay(100);

  // Second loop for ECG readings and acceleration
  for (int j = 0; j < 140; j++) {
    mpu.getMotion6(&accelX, &accelY, &accelZ, &gyroX, &gyroY, &gyroZ);

    float totalAccel = calculateTotalAcceleration(accelX, accelY, accelZ);

    detectRunning(totalAccel);

    if (!runningDetected) {
      detectFall(totalAccel);
    }

    ecgData[ecgIndex++] = analogRead(thermistorPin);
    delay(10); 
  }

  // Prepare data in JSON format
  StaticJsonDocument<512> jsonDoc;
  jsonDoc["temperature"] = avgTemperature;
  jsonDoc["fallDetected"] = fallDetected;

  JsonArray ecgArray = jsonDoc.createNestedArray("ecg");
  for (int i = 0; i < 140; i++) {
    ecgArray.add(ecgData[i]);
  }

  // Print only essential data for debugging
  Serial.print("Avg Temperature: ");
  Serial.print(avgTemperature);
  Serial.print(" °C, Fall Detected: ");
  Serial.println(fallDetected ? "Yes" : "No");

  // Check temperature and fall detection for alert condition
  if ((avgTemperature < 34 || avgTemperature > 46) && fallDetected) {
    toggleAlert();
  } else {
    digitalWrite(alertPin, LOW);  // Ensure alert pin is off if conditions are not met
  }

  // Send data to backend
  if (WiFi.status() == WL_CONNECTED) {
    sendToBackend(jsonDoc);
  } else {
    Serial.println("Wi-Fi not connected, skipping data transmission.");
  }

  delay(2000); // Wait before next cycle
}

// Function to toggle alert on GPIO 2
void toggleAlert() {
  for (int i = 0; i < 20; i++) { // Toggle 20 times for visibility
    digitalWrite(alertPin, HIGH);
    delay(150);
    digitalWrite(alertPin, LOW);
    delay(150);
  }
}

// Function to calculate total acceleration
float calculateTotalAcceleration(int16_t accelX, int16_t accelY, int16_t accelZ) {
  float ax = accelX / 16384.0;
  float ay = accelY / 16384.0;
  float az = accelZ / 16384.0;

  return sqrt(ax * ax + ay * ay + az * az);
}

// Function to detect fall based on acceleration thresholds
void detectFall(float totalAccel) {
  unsigned long currentTime = millis();

  if (totalAccel < FALL_THRESHOLD_LOW || totalAccel > FALL_THRESHOLD_HIGH) {
    if (!fallDetected) {
      fallDetected = true;
      fallDetectedTime = currentTime;
      Serial.println("Fall detected!");
    }
  }

  if (fallDetected && (currentTime - fallDetectedTime >= FALL_DEBOUNCE_TIME)) {
    if (abs(gyroX) < 50 && abs(gyroY) < 50 && abs(gyroZ) < 50) {
      Serial.println("Person/object is stationary after the fall.");
      fallDetected = false;
    } else {
      fallDetected = false;
      Serial.println("Movement detected, fall reset.");
    }
  }
}

// Function to detect running based on acceleration
void detectRunning(float totalAccel) {
  unsigned long currentTime = millis();

  if (totalAccel > RUNNING_THRESHOLD_HIGH) {
    if (!runningDetected) {
      runningStartTime = currentTime;
      runningDetected = true;
    } else {
      if (currentTime - runningStartTime >= RUN_DETECTION_TIME) {
        Serial.println("Running detected, ignoring fall detection.");
      }
    }
  } else {
    runningDetected = false;
  }
}

// Function to calculate temperature from thermistor resistance
float calculateTemperature(float resistance) {
  float steinhart;
  steinhart = nominalResistance / resistance;
  steinhart = log(steinhart);  
  steinhart /= bCoefficient;  
  steinhart += 1.0 / (nominalTemperature + 273.15);  
  steinhart = 1.0 / steinhart; 
  return (steinhart - 280.15);  // Convert Kelvin to Celsius
}

// Function to send data to backend
void sendToBackend(const JsonDocument& jsonDoc) {
  WiFiClientSecure client;  // Use WiFiClientSecure for HTTPS
  client.setInsecure();     // Insecure connection (bypasses certificate validation)

  HTTPClient http;

  if (WiFi.status() == WL_CONNECTED) {  // Double-check Wi-Fi connection before sending
    http.begin(client, API_ENDPOINT);  // Initialize HTTP connection with HTTPS

    String jsonData;
    serializeJson(jsonDoc, jsonData);
    
    http.addHeader("Content-Type", "application/json");
    
    // Set timeout for the request to prevent hanging
    http.setTimeout(5000);  // Set a 5-second timeout (5000 ms)

    int httpResponseCode = http.POST(jsonData);

    if (httpResponseCode > 0) {
      Serial.println("Data sent successfully.");
    } else {
      Serial.print("Error in POST request. HTTP response code: ");
      Serial.println(httpResponseCode);
    }

    http.end();  // Properly close the HTTP connection
  } else {
    Serial.println("Wi-Fi not connected, retrying connection.");
    WiFi.reconnect();  // Attempt to reconnect if disconnected
  }
}
//gpio 2 is getting toggle but not perfectly wanna use it then corrrect toggle part