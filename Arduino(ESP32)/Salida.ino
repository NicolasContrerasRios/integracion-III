#include <WiFi.h>
#include <HTTPClient.h>
#include <SPI.h>
#include <MFRC522.h>
#include "time.h"

// ===== WIFI =====
const char* ssid = "POCO C75";
const char* password = "Alexsandro3*";

// ===== API =====
const char* server = "http://10.114.110.137:5087/api/registro";

// ===== NTP =====
const char* ntpServer = "south-america.pool.ntp.org";
const long gmtOffset_sec = -4 * 3600;
const int daylightOffset_sec = 0;

// ===== RFID =====
#define SS_PIN 5
#define RST_PIN 22

MFRC522 rfid(SS_PIN, RST_PIN);

// ===== LEDS =====
#define LED_VERDE 26
#define LED_ROJO  25

// ===== TIPO =====
String tipo = "Salida";

// ===== UID → PATENTE =====
String obtenerPatente(String uid) {

  if (uid == "D4C2172A") return "AA111AA";
  if (uid == "14E7E02B") return "ABCD12";
  if (uid == "E92FBAC2") return "ABCD23";
  if (uid == "1945E8C1") return "NCNC12";

  return "DESCONOCIDO";
}

// ===== FECHA Y HORA =====
void obtenerFechaHora(String &fecha, String &hora) {
  struct tm timeinfo;

  if (!getLocalTime(&timeinfo)) {
    fecha = "0000-00-00";
    hora = "00:00:00";
    return;
  }

  char f[11];
  char h[9];

  strftime(f, sizeof(f), "%Y-%m-%d", &timeinfo);
  strftime(h, sizeof(h), "%H:%M:%S", &timeinfo);

  fecha = String(f);
  hora = String(h);
}

void setup() {
  Serial.begin(115200);

  // LEDS
  pinMode(LED_VERDE, OUTPUT);
  pinMode(LED_ROJO, OUTPUT);

  digitalWrite(LED_ROJO, HIGH); // 🔴 por defecto

  // WIFI
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) delay(500);

  Serial.println("WiFi conectado");

  // NTP
  configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);

  // RFID
  SPI.begin(18, 19, 23);
  rfid.PCD_Init();
}

void loop() {

  if (rfid.PICC_IsNewCardPresent() && rfid.PICC_ReadCardSerial()) {

    String uid = "";

    for (byte i = 0; i < rfid.uid.size; i++) {
      if (rfid.uid.uidByte[i] < 0x10) uid += "0";
      uid += String(rfid.uid.uidByte[i], HEX);
    }

    uid.toUpperCase();

    String patente = obtenerPatente(uid);

    String fecha, hora;
    obtenerFechaHora(fecha, hora);

    String json = "{";
    json += "\"patente\":\"" + patente + "\",";
    json += "\"fecha\":\"" + fecha + "\",";
    json += "\"hora\":\"" + hora + "\",";
    json += "\"tipoRegistro\":\"" + tipo + "\"";
    json += "}";

    Serial.println("Enviando:");
    Serial.println(json);

    bool exito = false;

    if (WiFi.status() == WL_CONNECTED) {
      HTTPClient http;

      http.begin(server);
      http.addHeader("Content-Type", "application/json");

      int httpCode = http.POST(json);

      Serial.print("HTTP: ");
      Serial.println(httpCode);

      if (httpCode == 200 || httpCode == 201) {
        exito = true;
      }

      http.end();
    }

    // ===== LOGICA LEDS =====
    if (patente != "DESCONOCIDO" && exito) {
      digitalWrite(LED_ROJO, LOW);
      digitalWrite(LED_VERDE, HIGH);
    } else {
      digitalWrite(LED_VERDE, LOW);
      digitalWrite(LED_ROJO, HIGH);
    }

    delay(2000);

    // volver al estado inicial
    digitalWrite(LED_VERDE, LOW);
    digitalWrite(LED_ROJO, HIGH);

    rfid.PICC_HaltA();
    rfid.PCD_StopCrypto1();
  }
}