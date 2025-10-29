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
    const hrVal = document.getElementById('hrVal');
    const hrProg = document.getElementById('hrProg');
    const CIRC = 2 * Math.PI * 46; // circumference for r=46
    function setHR(bpm){
      hrVal.textContent = bpm;
      // map bpm to progress (40-160 bpm typical)
      const norm = Math.max(40, Math.min(160, bpm));
      const ratio = (norm - 40) / (160 - 40); // 0..1
      const dash = CIRC * (1 - ratio);
      hrProg.setAttribute('stroke-dashoffset', dash.toFixed(1));
    }
    // subtle breathing bpm variation
   let bpm = 72;
setInterval(() => {
  bpm += Math.round((Math.random() - 0.5) * 4); // change by -2 to +2
  bpm = Math.max(67, Math.min(77, bpm)); // keep within limits
  setHR(bpm);
}, 250);
    
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









 



