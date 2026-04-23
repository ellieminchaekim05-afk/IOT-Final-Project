/*
   To successfully receive data, the following settings have to be the same
   on both transmitter and receiver:
    - carrier frequency
    - bandwidth
    - spreading factor
*/

// include the library
#include <RadioLib.h>
#include <math.h>
#include <WiFi.h>
#include <WebServer.h>

WebServer server(80);

/****************Pin assignment for the Heltec V3 board******************/
static const int LORA_CS = 8; // Chip select pin
static const int LORA_MOSI = 10;
static const int LORA_MISO = 11;
static const int LORA_SCK = 9;
static const int LORA_NRST = 12; // Reset pin
static const int LORA_DIO1 = 14; // DIO1 switch
static const int LORA_BUSY = 13;

static const int SOIL_PIN = 2; //for soil moisture sensor


/****************LoRa parameters (you need to fill these params)******************/
static const float FREQ = 905;
static const float BW = 125;
static const uint8_t SF = 5;
static const int8_t TX_PWR = 20;
static const uint8_t CR = 5;
static const uint8_t SYNC_WORD = (uint8_t)0x34;
static const uint16_t PREAMBLE = 8;

/****************Payload******************/
String tx_payload = "We are JED!"; // change this to something unique to your group/something you want to say to each other

/****************transceiver flags******************/
volatile bool tx_flag = false;
volatile bool rx_flag = false;

SX1262 radio = new Module(LORA_CS, LORA_DIO1, LORA_NRST, LORA_BUSY);

// this function is called when a complete packet
// is received by the module
// IMPORTANT: this function MUST be 'void' type
//            and MUST NOT have any arguments!
#if defined(ESP8266) || defined(ESP32)
ICACHE_RAM_ATTR
#endif

//setting up packet structure

struct __attribute__((__packed__)) Packet {
  uint8_t header;   // 1 byte
  float soil;     // 4 bytes
         // 4 bytes
  
};


void setFlag(void)
{
  // we got a packet, set the flag. However, this might cause the interrupt to be called when a transmission takes place too
  // luckily, there is a simple fix. check if the device just transmitted. if it did, then it is probably not the rx interrupt
  // if not, we know it is the rx interrupt and therefore can set the flag
  rx_flag = true;
}

// It is important to remember that ISRs are supposed to be short and are mostly used for triggering flags.
// doing Serial.print() might fail and cause device resets. This is because Serial.print() uses interrupt to read data,
// but in an ISR, all other interrupts are suspended, and therefore the operation fails.

// Helper function to print error messages
void error_message(const char *message, int16_t state)
{
  Serial.printf("ERROR!!! %s with error code %d\n", message, state);
  while (true)
    ; // loop forever
}

void setup()
{
  Serial.begin(115200);
 pinMode(SOIL_PIN, INPUT); //for soil sensor
  // Serial.print(F("MAC Address:\t"));
  // Serial.println(WiFi.macAddress());

  // WiFi.begin("wahoo");
  // while (WiFi.status() != WL_CONNECTED)
  //   delay(500);

  // server.on("/", []()
  //           { server.send(200, "text/plain", "Hello from ESP32!"); });

  // server.begin();

  // initialize SX1262 with default settings
  Serial.print(F("[SX1262] Initializing ... "));
  int state = radio.begin();
  if (state == RADIOLIB_ERR_NONE)
  {
    Serial.println(F("success!"));
  }
  else
  {
    Serial.print(F("failed, code "));
    Serial.println(state);
    while (true)
      ;
  }

  state = radio.setBandwidth(BW);
  if (state != RADIOLIB_ERR_NONE)
  {
    error_message("BW intialization failed", state);
  }
  state = radio.setFrequency(FREQ);
  if (state != RADIOLIB_ERR_NONE)
  {
    error_message("Frequency intialization failed", state);
  }
  state = radio.setSpreadingFactor(SF);
  if (state != RADIOLIB_ERR_NONE)
  {
    error_message("SF intialization failed", state);
  }
  state = radio.setOutputPower(TX_PWR);
  if (state != RADIOLIB_ERR_NONE)
  {
    error_message("Output Power intialization failed", state);
  }

  state = radio.setCurrentLimit(140.0);
  if (state != RADIOLIB_ERR_NONE)
  {
    error_message("Current limit intialization failed", state);
  }
  radio.setDio1Action(setFlag); // callback when the RF interrupt is triggered

  Serial.print(F("[SX1262] Starting to listen ... "));
  state = radio.startReceive();
  if (state == RADIOLIB_ERR_NONE)
  {
    Serial.println(F("success!"));

    Serial.println("Frequency:\t\t" + String(FREQ) + " MHz");
    Serial.println("Bandwidth:\t\t" + String(BW) + " kHz");
    Serial.println("Spreading Factor:\t" + String(SF));
    Serial.println("TX Power:\t\t" + String(TX_PWR));
  }
  else
  {
    Serial.print(F("failed, code "));
    Serial.println(state);
    while (true)
      ;
  }
}

  void loop()
{
  int soilRaw = analogRead(SOIL_PIN);
  Serial.print("Soil Raw: ");
  Serial.println(soilRaw);

  int soilPercent = map(soilRaw, 1200, 2800, 0, 100);
  soilPercent = constrain(soilPercent, 0, 100);

  // ===== BUILD PACKET =====
  Packet pkt;
  pkt.header = 0xAB;
  pkt.soil = (float)soilPercent;

  // ===== TRANSMIT EVERY 2 SECONDS =====
  Serial.println("[SX1262] Transmitting packet...");
  int state = radio.transmit((uint8_t*)&pkt, sizeof(pkt));

  if (state == RADIOLIB_ERR_NONE) {
    Serial.println("Transmit success");
  } else {
    Serial.print("Transmit failed, code ");
    Serial.println(state);
  }

  // go back to receive mode
  radio.startReceive();

  // ===== CHECK FOR RECEIVED PACKET =====
  if (rx_flag) {
    rx_flag = false;

    Packet rx_pkt;
    int state = radio.readData((uint8_t*)&rx_pkt, sizeof(rx_pkt));

    if (state == RADIOLIB_ERR_NONE) {
      Serial.println("[SX1262] Received packet!");

      // validate header
      if (rx_pkt.header != 0xAB) {
        Serial.println("Invalid packet");
        return;
      }

      Serial.print("Soil: ");
      Serial.println(rx_pkt.soil);

      Serial.print("RSSI: ");
      Serial.println(radio.getRSSI());

      Serial.print("SNR: ");
      Serial.println(radio.getSNR());
    }
    else if (state == RADIOLIB_ERR_CRC_MISMATCH) {
      Serial.println("CRC error!");
    }
    else {
      Serial.print("Receive failed, code ");
      Serial.println(state);
    }

    radio.startReceive();
  }

  delay(2000);  // send every 2 seconds
}






