// Save device name
function saveDeviceName() {
    const name = document.getElementById("deviceName").value;
    if (!name) {
        alert("Please enter a device name.");
        return;
    }
    localStorage.setItem("deviceName", name);
    alert("Device name saved!");
}

// Load device name on page load
window.addEventListener("load", () => {
    const savedName = localStorage.getItem("deviceName");
    if (savedName && document.getElementById("deviceName")) {
        document.getElementById("deviceName").value = savedName;
    }
});

// Update status
function updateDeviceStatus(isConnected) {
    if (document.getElementById("deviceStatus")) {
        document.getElementById("deviceStatus").textContent =
            isConnected ? "Connected ✅" : "Not Connected ❌";
    }
}



// Add Device
async function connectDevice() {
  alert("Opening Wi-Fi / Bluetooth setup...");

  if (!navigator.bluetooth) {
    alert("❌ Bluetooth not supported in this browser.");
    return;
  }

  try {
    // 1️⃣ Ask user to select a Bluetooth device
    const device = await navigator.bluetooth.requestDevice({
      acceptAllDevices: true,
      optionalServices: ['battery_service'] // Example, use your own UUID
    });

    console.log("Device selected:", device.name);
    updateDeviceStatus(true);

    // 2️⃣ Connect to GATT server
    const server = await device.gatt.connect();
    console.log("✅ Connected to GATT server");

    // 3️⃣ Get primary service
    const service = await server.getPrimaryService('battery_service');

    // 4️⃣ Get characteristic
    const characteristic = await service.getCharacteristic('battery_level');

    // 5️⃣ Read initial value
    const value = await characteristic.readValue();
    const battery = value.getUint8(0);
    console.log(`🔋 Battery: ${battery}%`);

    // 6️⃣ Subscribe to notifications for real-time updates
    characteristic.addEventListener('characteristicvaluechanged', (event) => {
      const newVal = event.target.value.getUint8(0);
      console.log(`⚡ Updated Battery: ${newVal}%`);
    });
    await characteristic.startNotifications();

    // Optional: handle disconnection
    device.addEventListener('gattserverdisconnected', () => {
      console.log("❌ Device disconnected");
      updateDeviceStatus(false);
    });

  } catch (error) {
    console.error("❌ Bluetooth connection failed:", error);
    updateDeviceStatus(false);
  }
}

