/* ---------- API helper & auth (paste at end of script.js) ---------- */

const API_BASE = "http://127.0.0.1:5000/api";
const AUTH_TOKEN_KEY = "sentinel_token";  // localStorage key we use
// Minimal wrapper that injects Authorization header if token present
async function apiFetch(path, opts = {}) {
  const headers = opts.headers ? {...opts.headers} : {};
  if (!headers['Content-Type'] && !(opts.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }
  const token = localStorage.getItem('sentinel_token');
  if (token) headers['Authorization'] = 'Bearer ' + token;
  const res = await fetch(API_BASE + path, {...opts, headers});
  return res;
}

/* ----- Signup handler ----- */
( function initSignup(){
  const form = document.querySelector('.signup-form .form');
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const firstname = document.getElementById('firstname')?.value?.trim() || '';
    const lastname  = document.getElementById('lastname')?.value?.trim() || '';
    const email     = document.getElementById('signupEmail')?.value?.trim() || '';
    const password  = document.getElementById('signupPassword')?.value || '';
    const confirm   = document.getElementById('signupPasswordConfirm')?.value || '';

    if (!email || !password || password !== confirm) {
      alert('Please provide valid email and matching passwords.');
      return;
    }

    try {
      const r = await fetch(API_BASE + '/register', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
          firstname: firstname,
          lastname: lastname,
          email: email,
          password: password,
          confirm_password: confirm})
      });
      const i = await r.json();
      if (r.ok && i.ok) {
        alert('Signup successful — please sign in.');
        window.location.href = 'sign in.html';
      } else {
        alert('Signup failed: ' + (i.error || JSON.stringify(i)));
      }
    } catch (err) {
      console.error(err);
      alert('Network error during signup.');
    }
  });
})();

/* ----- Login handler ----- */
( function initLogin(){
  const form = document.querySelector('.signin-form .form');
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail')?.value?.trim() || '';
    const password = document.getElementById('loginPassword')?.value || '';
    if (!email || !password) { alert('Enter email and password'); return; }

    try {
      const m = await fetch(API_BASE + '/login', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({email,password})
      });
      const j = await m.json();
      if (m.ok && (j.ok || j.status === 'success')) {
    // Try to get token from various possible fields
    const token = j.token || j.access_token || j.data?.token;

    if (token) {
        localStorage.setItem('sentinel_token', token);
        window.location.href = 'index.html';
    } else {
        // If no token is present, but login was okay, just continue
        console.warn("No token found in response, proceeding anyway:", j);
        window.location.href = 'index.html';
    }
} else {
    alert('Login failed: ' + (j.error || JSON.stringify(j)));
}

    } catch (err) {
      console.error(err);
      alert('Network error during login.');
    }
  });
})();
async function apiPost(path, body = {}) {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = "Bearer " + token;
  const res = await fetch(API_BASE + path, {
    method: "POST",
    headers,
    body: JSON.stringify(body)
  });
  return res.json();
}

async function registerUser(firstname, lastname, email, password) {
  const j = await apiPost("/register", { firstname, lastname, email, password });
  if (j.ok && j.data && j.data.token) {
    localStorage.setItem(AUTH_TOKEN_KEY, j.data.token);
  }
  return j;
}

async function loginUser(email, password) {
  const j = await apiPost("/login", { email, password });
  if (j.ok && j.data && j.data.token) {
    localStorage.setItem(AUTH_TOKEN_KEY, j.data.token);
  }
  return j;
}

function logoutUser() {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  // Optional: call server logout
  fetch(API_BASE + "/logout", {
    method: "POST",
    headers: { "Content-Type":"application/json", "Authorization": "Bearer " + token },
    body: JSON.stringify({ token })
  }).finally(() => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    // redirect to login
  });
}


  const gpsWarning = document.getElementById("auxVal");
  const signal = document.getElementById("signal"); // optional element (not used yet)
  let gpsTimeout;
  let watchId;

  if ("geolocation" in navigator) {
    // Start watching location continuously
    watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        

        // When detected, update status
        hideGPSWarning();

        // Reset timeout (in case GPS signal drops later)
        clearTimeout(gpsTimeout);
        gpsTimeout = setTimeout(() => {
          showGPSWarning();
        }, 10000); // If no update within 10 seconds → "Lost"
      },
      (error) => {
        showGPSWarning();
        switch (error.code) {
          case error.PERMISSION_DENIED:
            console.error("❌ Permission denied");
            break;
          case error.POSITION_UNAVAILABLE:
            console.error("⚠️ Position unavailable");
            break;
          case error.TIMEOUT:
            console.error("⏱️ GPS request timed out");
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5000
      }
    );
  } else {
    alert("❌ Geolocation not supported.");
  }

  // Function to handle GPS signal loss
  function showGPSWarning() {
    gpsWarning.innerHTML = "Lost";
    gpsWarning.style.color = "red";
  }

  // Function to hide the warning
  function hideGPSWarning() {
    gpsWarning.innerHTML = "Detected";
    gpsWarning.style.color = "green";
  }


// Menu toggle

    const menuBtn = document.getElementById('menuBtn');
    const menu    = document.getElementById('menu');
    menuBtn.addEventListener('click', (e)=> {
      e.stopPropagation();
      menu.classList.toggle('show');
    });
    document.addEventListener('click', ()=> menu.classList.remove('show'));

    // Battery API (graceful fallback)
    const batPct = document.getElementById('batteryPct');
    const batFill = document.getElementById('batFill');
    function setBatteryUI(level){
      const pct = Math.round(level * 100);
      batPct.textContent = pct + '%';
      // Fill width from 0 to 18 (max width) proportionally
      const w = Math.max(0.8, Math.min(18, 18 * level));
      batFill.setAttribute('width', w.toFixed(1));
      // Tint based on level
      if(pct < 20){ batFill.setAttribute('fill', '#ff6a5f'); }
      else if(pct < 50){ batFill.setAttribute('fill', '#ffd166'); }
      else { batFill.setAttribute('fill', '#00e5ff'); }
    }
    if (navigator.getBattery) {
      navigator.getBattery().then(b => {
        setBatteryUI(b.level);
        b.addEventListener('levelchange', ()=> setBatteryUI(b.level));
      });
    } else {
      // fallback demo value
      setBatteryUI(0.85);
    }

    // Demo heart rate animation (replace with real sensor later)
 
    
 //video capture
 document.querySelector(".sos").addEventListener("click", () => {
   

   // Simulate captured face evidence
   const capturedList = document.getElementById("captured-list");
   const newCapture = document.createElement("li");

  const timestamp = new Date().toLocaleString();
   newCapture.textContent = `Captured @ ${timestamp}`;
   capturedList.appendChild(newCapture);

   // TODO: Send to backend later for actual storage
 });
 // ---- Fetch SOS Logs ----
async function fetchSosLogs() {
     const capturedList = document.getElementById("captured-list");
  const newCapture = document.createElement("li");
  const timestamp = new Date().toLocaleString();
   newCapture.textContent = `Captured @ ${timestamp}`;
  capturedList.appendChild(newCapture);
  try {
    const res = await fetch(API_BASE + "/sos/logs", {
      headers: {
        "Authorization": "Bearer " + token  // token must be set after login
      }
    });
    const data = await res.json();
    if (data.ok) renderSosLogs(data.data);
  } catch (err) {
    console.error("Failed to fetch logs:", err);
  }
}
   const sosBtn = document.getElementById('sosBtn');
let armed = false;

// ===========================
// 🔹 TELEGRAM BOT CONFIGURATION
// ===========================
const BOT_TOKEN = "8028029484:AAEq3UhylzJvSaydSboAftUoM5MeERikMEQ"; // ← Replace with your actual Bot token
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
const PARENT_ID = 8349041049;  // Parent chat ID
const POLICE_ID = 7221167830;  // Police chat ID

// Function to get current timestamp (formatted)
function getCurrentTime() {
  const now = new Date();
  return now.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
}

sosBtn.addEventListener('click', () => {
  armed = !armed;
  sosBtn.setAttribute('aria-pressed', String(armed));
  sosBtn.querySelector('.sos__label').textContent = armed ? 'ARMED' : 'SOS';

  // Quick flash animation feedback
  sosBtn.animate([
    { filter: 'brightness(1)' },
    { filter: 'brightness(1.25)' },
    { filter: 'brightness(1)' }
  ], { duration: 260, easing: 'ease-out' });

  // ====================================
  // 🚨 SOS ACTIVATION SECTION
  // ====================================
  if (armed) {
    alert("🚨 SOS Activated! Emergency actions initiated.");

   
    

    fetchSosLogs();

    // ====================================
    // 📍 GET LOCATION AND SEND TELEGRAM ALERT
    // ====================================


const locationName = "VIT-AP University, Inavolu, Amaravati, 522241";
const latitude = 16.545123;
const longitude = 80.523345;
const locationURL = `https://www.google.com/maps?q=${latitude},${longitude}`;
const currentTime = getCurrentTime();
alert(`📍 Static Location Sent:\n${locationName}\nLat: ${latitude}\nLong: ${longitude}`);

// 🆘 Construct SOS message with emojis and formatting
const sosMessage = `🚨 *SOS ALERT TRIGGERED!* 🚨\n\n` +
  `👤 *User:* Sentinel Device\n` +
  `🕒 *Time:* ${currentTime}\n\n` +
  `📍 *Last Seen:* ${locationName}\n` +
  `🌐 *GPS Lock:* (${latitude}, ${longitude})\n` +
  `[View on Map](${locationURL})\n\n` +
  `⚠️ Immediate action required!`;

// Send message to both Parent & Police
[PARENT_ID, POLICE_ID].forEach(id => {
  fetch(TELEGRAM_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: id,
      text: sosMessage,
      parse_mode: "Markdown"
    })
  })
    .then(res => res.json())
    .then(data => console.log("Telegram SOS sent:", data))
    .catch(err => console.error("Telegram error:", err));
});


    // 🔊 Play alert sound
    document.getElementById("sos-alert-sound").play();

  } else {
    // ====================================
    // 🛑 SOS DEACTIVATION SECTION
    // ====================================
    alert("SOS Deactivated. Emergency stopped.");

    fetch(API_BASE + "/sos/stop", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + token
      }
    })
      .then(res => res.json())
      .then(data => {
        console.log("SOS stopped:", data);
      })
      .catch(err => {
        console.error("Failed to stop SOS:", err);
      });

    fetchSosLogs();
  }
});


// ====================================
// 📞 CALL-BACK BUTTON FUNCTIONALITY
// ====================================
document.querySelector(".callback").addEventListener("click", () => {
  alert("📞 Call-back request sent to your guardian!");

  const currentTime = getCurrentTime();

  // 📢 Telegram message for parent only
  const callbackMsg = `📞 *CALL-BACK REQUEST*\n\n` +
    `🕒 *Time:* ${currentTime}\n` +
    `👤 *From:* Sentinel Device\n\n` +
    `Please call back immediately.`;

  fetch(TELEGRAM_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: PARENT_ID,
      text: callbackMsg,
      parse_mode: "Markdown"
    })
  })
    .then(res => res.json())
    .then(data => console.log("Telegram callback sent:", data))
    .catch(err => console.error("Telegram error:", err));
});

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

function updateDeviceStatus(isConnected) {
  const status = document.getElementById("deviceStatus");

  if (status) {
    if (isConnected) {
      status.textContent = "🟢 Connected";
      localStorage.setItem("connection", "connected");
      localStorage.setItem("connectedAt", Date.now().toString());
    } else {
      status.textContent = "🔴 Disconnected";
      localStorage.setItem("connection", "disconnected");
    }
  }
}

// 🩺 Check connection and show BPM after 5 sec
function checkConnection() {
  const connection = localStorage.getItem("connection");
  const connectedAt = parseInt(localStorage.getItem("connectedAt") || "0");
  const now = Date.now();

  if (connection === "connected") {
    if (now - connectedAt >= 5000) {
      startBPM(); // show immediately if already connected for >5s
    } else {
      setTimeout(() => {
        if (localStorage.getItem("connection") === "connected") {
          startBPM();
        }
      }, 5000 - (now - connectedAt));
    }
  } else {
    stopBPM();
  }
}

// 💓 BPM visualization
let bpmInterval = null;
function startBPM() {
  if (bpmInterval) return;
  const hrVal = document.getElementById('hrVal');
  const hrProg = document.getElementById('hrProg');
  const CIRC = 2 * Math.PI * 46;

  let bpm = 80;
  bpmInterval = setInterval(() => {
    bpm += Math.round((Math.random() - 0.5) * 4);
    bpm = Math.max(67, Math.min(87, bpm));
    hrVal.textContent = bpm;
    const norm = Math.max(40, Math.min(160, bpm));
    const ratio = (norm - 40) / (160 - 40);
    const dash = CIRC * (1 - ratio);
    hrProg.setAttribute('stroke-dashoffset', dash.toFixed(1));
  }, 1000);

  document.getElementById("bpmContainer").style.display = "block";
}

function stopBPM() {
  clearInterval(bpmInterval);
  bpmInterval = null;
  document.getElementById("bpmContainer").style.display = "none";
}

// 🧠 Auto check every second
setInterval(checkConnection, 1000);
checkConnection();




