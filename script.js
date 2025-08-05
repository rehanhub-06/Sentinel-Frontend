// Start with initial coordinates
let lat = 17.385044;
let lng = 78.486671;

const map = L.map('map').setView([lat, lng], 15);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19
}).addTo(map);

const marker = L.marker([lat, lng]).addTo(map)
  .bindPopup("Rehan's Current Location")
  .openPopup();

// Function to simulate location updates
function updateLocation() {
  // Simulate small random movement
  lat += (Math.random() - 0.5) * 0.0005;
  lng += (Math.random() - 0.5) * 0.0005;

  // Update marker position
  marker.setLatLng([lat, lng]);

  // Update map view to center on new position
  map.panTo([lat, lng]);

  // Update text in the UI
  const gpsText = document.getElementById('gps-coordinates');
  gpsText.textContent = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
}

// Update every 5 seconds
setInterval(updateLocation, 5000);

const iconSection = document.querySelector('.dropdown');

iconSection.addEventListener('click', () => {
  iconSection.classList.toggle('expanded');
  document.querySelector('body').style(padding,0);

});
