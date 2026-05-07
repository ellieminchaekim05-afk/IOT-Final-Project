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

### Moisture Sensor Peripheral Device

### GPS Sensor Peripheral Device
