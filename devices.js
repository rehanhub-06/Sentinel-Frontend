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
            isConnected ? "Connected ✅" :  "Not Connected ❌";
    }
}



// Add Device
function connectDevice() {
    alert("Opening Wi-Fi / Bluetooth setup...");

    if (navigator.bluetooth) {
        navigator.bluetooth.requestDevice({ acceptAllDevices: true })
            .then(device => {
                console.log("Connected to:", device.name);
                updateDeviceStatus(true);
            })
            .catch(err => {
                console.error(err);
                updateDeviceStatus(false);
            });
    } else {
        alert("Bluetooth not supported in this browser.");
    }
}


