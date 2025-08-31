// === Map setup ===
const map = L.map('map').setView([20.5937, 78.9629], 5);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19, attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

let blackoutZones = null;
let routeLayer = null;
let directions = [];
let startCoords = null;

// Helpers for readable instructions
const ordinal = n => {
  const s = ["th","st","nd","rd"], v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};
const addRoad = step => {
  const name = (step.name && step.name.trim()) || (step.ref && step.ref.trim()) || "";
  return name ? ` onto ${name}` : "";
};
function makeInstruction(step) {
  const { type, modifier, exit } = step.maneuver || {};
  const road = addRoad(step);
  const mod = modifier ? modifier.replace("_", " ") : "";

  switch (type) {
    case "depart":        return `Head ${mod || "out"}${road}`.trim();
    case "arrive":        return "Arrive at your destination";
    case "turn":          return `Turn ${mod || ""}${road}`.replace("  ", " ").trim();
    case "new name":      return `Continue${road}`;
    case "continue":      return `Continue ${mod || ""}${road}`.replace("  ", " ").trim();
    case "merge":         return `Merge ${mod || ""}${road}`.replace("  ", " ").trim();
    case "on ramp":       return `Take the ramp ${mod || ""}${road}`.replace("  ", " ").trim();
    case "off ramp":      return `Exit ${mod || ""}${road}`.replace("  ", " ").trim();
    case "fork":          return `Keep ${mod || ""}${road}`.replace("  ", " ").trim();
    case "end of road":   return `Turn ${mod || ""} at the end of the road${road}`.replace("  ", " ").trim();
    case "roundabout":
    case "rotary": {
      const ex = exit || (step.maneuver && step.maneuver.exit);
      const exitTxt = ex ? ` and take the ${ordinal(ex)} exit` : "";
      return `Enter the roundabout${exitTxt}${road}`;
    }
    case "notification":  return step.name ? `Proceed on ${step.name}` : "Continue";
    default:              return step.name ? `Proceed on ${step.name}` : "Continue";
  }
}

// Load blackout zones
async function loadBlackoutZones() {
  try {
    const res = await fetch("blackout_zones_india.geojson");
    blackoutZones = await res.json();
    L.geoJSON(blackoutZones, { style: { color: "red", fillOpacity: 0.3 } }).addTo(map);
  } catch (err) {
    console.error("Failed to load blackout zones:", err);
  }
}
loadBlackoutZones();

// User location
navigator.geolocation.getCurrentPosition(pos => {
  startCoords = [pos.coords.latitude, pos.coords.longitude];
  L.marker(startCoords).addTo(map).bindPopup("Start Location").openPopup();
  map.setView(startCoords, 14);
}, err => alert("Unable to get your location. Please enable GPS."));

// Clear route
document.getElementById("clear-btn").addEventListener("click", () => {
  if (routeLayer) map.removeLayer(routeLayer);
  document.getElementById("instruction-text").textContent = "No directions yet.";
});

// Routing with blackout check
document.getElementById("route-btn").addEventListener("click", async () => {
  const dest = document.getElementById("destination").value;
  if (!startCoords || !dest) return alert("Please enter destination.");

  // Geocode destination
  const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(dest)}`);
  const geoData = await geoRes.json();
  if (!geoData.length) return alert("Destination not found.");
  const destCoords = [parseFloat(geoData[0].lat), parseFloat(geoData[0].lon)];

  // Get route
  const routeUrl = `https://router.project-osrm.org/route/v1/driving/${startCoords[1]},${startCoords[0]};${destCoords[1]},${destCoords[0]}?overview=full&geometries=geojson&steps=true`;
  const routeRes = await fetch(routeUrl);
  const routeData = await routeRes.json();
  if (!routeData.routes || !routeData.routes.length) return alert("No route found.");

  const route = routeData.routes[0];

  if (routeLayer) map.removeLayer(routeLayer);
  routeLayer = L.geoJSON(route.geometry, { color: "blue" }).addTo(map);
  map.fitBounds(routeLayer.getBounds());

  // Check blackout intersections
  if (blackoutZones) {
    const routeLine = turf.lineString(route.geometry.coordinates);
    const zones = turf.featureCollection(blackoutZones.features);
    zones.features.forEach(zone => {
      if (turf.booleanIntersects(routeLine, zone)) {
        L.geoJSON(zone, { color: "orange", fillOpacity: 0.5 }).addTo(map)
          .bindPopup("Blackout Zone - Try alternate path");
      }
    });
  }

  // Build directions list
  directions = route.legs[0].steps.map((step, i) => `Step ${i + 1}: ${makeInstruction(step)}`);
  document.getElementById("instruction-text").textContent = directions.join("\n");
});
