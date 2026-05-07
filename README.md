# Terra

Terra is an environmental monitoring system designed for use in remote and unknown environments. This system involves one central device to store and manage all collected data and provide users access to this data over an HTTP API server over Wi-Fi. Three peripheral “recon” nodes gather environmental data, including light, soil moisture, and GPS location, and transmit this data to the central unit using LoRa. Terra has several practical applications, particularly in agriculture and environmental monitoring. Farmers could use the system to remotely monitor soil conditions, track environmental changes, and improve crop management decisions. The system could also support disaster detection and early warning efforts by identifying unusual weather or environmental changes in remote areas where traditional monitoring infrastructure may be limited.

## Run Instructions

### Central Device

1. Open the `P2P_lora` directory in VS Code with the PlatformIO extension installed.

2. Connect the central device to your computer and select the appropriate serial port in PlatformIO.

3. Upload the code to the central device, a Heltec LoRa 32(V3) board with the antenna connected, and open the serial monitor to view the output.

4. If the upload is successful, the central device will start running and will print out its MAC address and IP address in the serial monitor. If the IP address is not printed, ensure that the device is set up to connect correctly to the "wahoo" network using [this link](https://virginia.service-now.com/its?id=itsweb_kb_article&sys_id=ca13d12bdb8153404f32fb671d961969).

5. Once the central device is running and connected to Wi-Fi, you can access the HTTP API server by navigating to `http://<central_device_ip>/data` in your web browser (with your device connected to eduroam), replacing `<central_device_ip>` with the actual IP address of the central device.

### Client

1. Navigate to the `client` directory and install dependencies:

```bash
cd client
npm install
```

2. In the `client` directory, create a `.env` file and add the following line, replacing `<central_device_ip>` with the actual IP address of the central device:

```env
BACKEND_URL=http://<central_device_ip>
```

3. Start the development server:

```bash
npm run dev
```

### Light Sensor Peripheral Device
Hardware setup: 
1. To set up the hardware for this peripheral device, a photoresistor, a 10 kOhm resistor, and a Heltec board are needed. 
2. One leg of the photo resistor must be connected to the 3.3V pin on the Heltec. 
3. The other leg of the photoresistor will be connected to the 10kOhm resistor, which is connected to the GND pin on the other side. 
4. The junction between the photoresistor and the resistor is connected to pin 7 on the Heltec, which is the input signal.

Software setup: 
1. Open the `light` directory in VS Code with the PlatformIO extension installed.
2. Connect the peripheral device to your computer and select the appropriate serial port in PlatformIO.
3. Upload the code to the device, a Heltec LoRa 32(V3) board with the antenna connected and the correct hardware set up, and open the serial monitor to view the output.

### Moisture Sensor Peripheral Device
Hardware setup: 
1. To set up the hardware for this peripheral device, a soil moisture sensor and a Heltec board are required.
2. The VDD pin on the soil sensor needs to be connected to a 5V power pin on the Heltec.
3. Connect the GND pins on both the sensor and the device together.
4. The ACC pin on the soil moisture sensor needs to be connected to GPIO 3 (Pin 14).

Software setup: 
1. Open the `soil` directory in VS Code with the PlatformIO extension installed.
2. Connect the peripheral device to your computer and select the appropriate serial port in PlatformIO.
3. Upload the code to the device, a Heltec LoRa 32(V3) board with the antenna connected and the correct hardware set up, and open the serial monitor to view the output.


### GPS Sensor Peripheral Device
Hardware setup: 
1. To set up the hardware for this peripheral device, a GPS sensor (GT-U7) and a Heltec board are required.
2. The VDD pin on the GPS sensor needs to be connected to a 5V power pin on the Heltec.
3. Connect the GND pins on both the sensor and the device together.
4. The GPS RX pin needs to be connected to pin 45, and the GPS TX pin connected to pin 46.

Software setup: 
1. Open the `gps` directory in VS Code with the PlatformIO extension installed.
2. Connect the peripheral device to your computer and select the appropriate serial port in PlatformIO.
3. Upload the code to the device, a Heltec LoRa 32(V3) board with the antenna connected and the correct hardware set up, and open the serial monitor to view the output.
4. The GPS sensor is a little finicky and requires a clear satellite connection. This means that it will work better if the device is outside without anything blocking it.
