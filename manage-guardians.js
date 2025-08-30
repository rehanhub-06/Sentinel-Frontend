document.addEventListener("DOMContentLoaded", () => {
    const addGuardianBtn = document.getElementById("addGuardianBtn");
    const guardianList = document.getElementById("guardianList");
    const nameInput = document.getElementById("guardianName");
    const phoneInput = document.getElementById("guardianPhone");

    // Add guardian
    addGuardianBtn.addEventListener("click", () => {
        const name = nameInput.value.trim();
        const phone = phoneInput.value.trim();

        if (!name || !phone) {
            alert("Please fill in both fields");
            return;
        }

        const li = document.createElement("li");
        li.innerHTML = `
            <span class="guardian-info">${name} - ${phone}</span>
            <button class="remove-btn">Remove</button>
        `;

        li.querySelector(".remove-btn").addEventListener("click", () => {
            li.remove();
        });

        guardianList.appendChild(li);

        nameInput.value = "";
        phoneInput.value = "";
    });

    // Remove guardian (existing ones)
    document.querySelectorAll(".remove-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.target.closest("li").remove();
        });
    });
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