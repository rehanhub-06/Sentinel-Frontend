
document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.getElementById("addGuardianBtn");
  const listEl = document.getElementById("guardianList");
  const nameInput = document.getElementById("guardianName");
  const phoneInput = document.getElementById("guardianPhone");
const API_BASE = "http://127.0.0.1:5000/api";
const AUTH_TOKEN_KEY = "sentinel_token";
  async function renderListFromServer() {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    const res = await fetch(API_BASE + '/guardians', { headers: { 'Authorization': token ? ('Bearer ' + token) : '' }});
    const j = await res.json();
    if (!j.ok) return listEl.innerHTML = '<li>No guardians</li>';
    listEl.innerHTML = '';
    (j.data || []).forEach(g => {
      const li = document.createElement('li');
      li.textContent = `${g.name} — ${g.phone} `;
      const del = document.createElement('button');
      del.textContent = 'Remove';
      del.addEventListener('click', async () => {
        const r = await fetch(API_BASE + '/guardians', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem(AUTH_TOKEN_KEY) },
          body: JSON.stringify({ phone: g.phone })
        });
        const jr = await r.json();
        if (jr.ok) renderListFromServer(); else alert(jr.error || 'Remove failed');
      });
      li.appendChild(del);
      listEl.appendChild(li);
    });
  }

  addBtn?.addEventListener('click', async () => {
    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();
    if (!name || !phone) return alert('Enter both values');
    const r = await fetch(API_BASE + '/guardians', {
      method: 'POST',
      headers: { 'Content-Type':'application/json', 'Authorization': 'Bearer ' + localStorage.getItem(AUTH_TOKEN_KEY) },
      body: JSON.stringify({ name, phone })
    });
    const jr = await r.json();
    if (jr.ok) { nameInput.value=''; phoneInput.value=''; renderListFromServer(); } else alert(jr.error || 'Add failed');
  });

  renderListFromServer();
});

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
    // call back
 document.querySelector(".callback").addEventListener("click", () => {
   alert("📞 Call-back request sent to your guardian!");
 });