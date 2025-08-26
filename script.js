

// // Start with initial coordinates
// let lat = 17.385044;
// let lng = 78.486671;

// const map = L.map('map').setView([lat, lng], 15);

// L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//   maxZoom: 19
// }).addTo(map);

// const marker = L.marker([lat, lng]).addTo(map)
//   .bindPopup("Rehan's Current Location")
//   .openPopup();

// // Function to simulate location updates
// function updateLocation() {
//   // Simulate small random movement
//   lat += (Math.random() - 0.5) * 0.0005;
//   lng += (Math.random() - 0.5) * 0.0005;

//   // Update marker position
//   marker.setLatLng([lat, lng]);

//   // Update map view to center on new position
//   map.panTo([lat, lng]);

//   // Update text in the UI
//   const gpsText = document.getElementById('gps-coordinates');
//   gpsText.textContent = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
// }

// // Update every 5 seconds
// setInterval(updateLocation, 5000);

// const iconSection = document.querySelector('.dropdown');

// iconSection.addEventListener('click', () => {
//   iconSection.classList.toggle('expanded');
//   document.querySelector('body').style(padding,0);

// });
// Dummy heart rate simulation
setInterval(() => {
  document.getElementById("bpm").innerText = Math.floor(60 + Math.random() * 40);
}, 2000);

// Dummy location for map
const map = L.map('map').setView([20.5937, 78.9629], 5);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 18,
}).addTo(map);

// Marker that updates
const marker = L.marker([20.5937, 78.9629]).addTo(map);
setInterval(() => {
  const lat = 20.5 + Math.random();
  const lng = 78.5 + Math.random();
  marker.setLatLng([lat, lng]);
  map.setView([lat, lng]);
}, 5000);
const iconSection = document.querySelector('.dropdown');

 iconSection.addEventListener('click', () => {
   iconSection.classList.toggle('expanded');
   document.querySelector('body').style(padding,0);

 });

//video capture
document.querySelector(".sos").addEventListener("click", () => {
  alert("SOS triggered!");

  // Simulate captured face evidence
  const capturedList = document.getElementById("captured-list");
  const newCapture = document.createElement("li");

  const timestamp = new Date().toLocaleString();
  newCapture.textContent = `Captured @ ${timestamp}`;
  capturedList.appendChild(newCapture);

  // TODO: Send to backend later for actual storage
});

//sos button
document.querySelector(".sos").addEventListener("click", () => {
  // Visual Feedback
  alert("🚨 SOS Activated! Emergency actions initiated.");

  // Capture Timestamp Log
  const capturedList = document.getElementById("captured-list");
  const newCapture = document.createElement("li");
  const timestamp = new Date().toLocaleString();
  newCapture.textContent = `Captured @ ${timestamp}`;
  capturedList.appendChild(newCapture);

  // Get Location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      alert(`📍 Location Sent:\nLat: ${latitude}\nLong: ${longitude}`);
    });
  } else {
    alert("Geolocation not supported.");
  }

  // Play Alert Sound
  document.getElementById("sos-alert-sound").play();

  // Future Backend API call
  // fetch('/api/emergency', { method: 'POST', body: JSON.stringify({...}) });
});

//battery percentage
function updateBatteryStatus(battery) {
  const batteryDiv = document.getElementById("battery-status");
  const level = Math.round(battery.level * 100);
  batteryDiv.textContent = `🔋 ${level}%`;

  // Optional: add a warning for low battery
  if (level < 20) {
    batteryDiv.style.color = "red";
  } else {
    batteryDiv.style.color = "white";
  }
}

// Use browser battery API for now
if (navigator.getBattery) {
  navigator.getBattery().then((battery) => {
    updateBatteryStatus(battery);
    battery.addEventListener("levelchange", () => updateBatteryStatus(battery));
  });
} else {
  document.getElementById("battery-status").textContent = "Battery info not supported";
}

const gpsWarning = document.getElementById("gps-warning");
let gpsTimeout;

// Function to handle GPS signal loss
function showGPSWarning() {
  gpsWarning.style.display = "block";
}

// Function to hide the warning
function hideGPSWarning() {
  gpsWarning.style.display = "none";
}

// Track location updates
function watchPosition() {
  if ("geolocation" in navigator) {
    navigator.geolocation.watchPosition(
      (position) => {
        hideGPSWarning(); // Signal available
        clearTimeout(gpsTimeout); // Reset timeout

        // Restart timeout if no update in 10 seconds
        gpsTimeout = setTimeout(() => {
          showGPSWarning();
        }, 10000); // 10 seconds without update = possible blackout
      },
      (error) => {
        showGPSWarning(); // If permission denied or signal lost
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  } else {
    gpsWarning.textContent = "Geolocation not supported.";
    gpsWarning.style.display = "block";
  }
}

watchPosition();

//call back
document.getElementById("callbackBtn").addEventListener("click", () => {
  alert("📞 Call-back request sent to your guardian!");
});

// Show Guardians Section on click
document.getElementById("manageGuardiansBtn").addEventListener("click", function () {
    document.getElementById("guardiansSection").style.display = "block";
    document.getElementById("map").style.display = "none"; // Hide map temporarily
    // Hide other sections if needed
    loadGuardians();
});




