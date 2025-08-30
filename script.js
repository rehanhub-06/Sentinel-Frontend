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
    let t = 0;
    setInterval(()=>{
      t += 0.06;
      const bpm = Math.round(72 + Math.sin(t) * 5);
      setHR(bpm);
    }, 250);

    // // Aux circle demo (e.g., Signal/Stress)
    // const auxVal = document.getElementById('auxVal');
    // const auxProg = document.getElementById('auxProg');
    // function setAux(p){
    //   const pct = Math.max(0, Math.min(100, p));
    //   auxVal.textContent = pct + '%';
    //   const dash = CIRC * (1 - pct/100);
    //   auxProg.setAttribute('stroke-dashoffset', dash.toFixed(1));
    // }
    
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
    // SOS interactions
    const sosBtn = document.getElementById('sosBtn');
    let armed = false;
    sosBtn.addEventListener('click', ()=>{
      armed = !armed;
      sosBtn.setAttribute('aria-pressed', String(armed));
      sosBtn.querySelector('.sos__label').textContent = armed ? 'ARMED' : 'SOS';
      // quick feedback flash
      sosBtn.animate([
        { filter:'brightness(1)' }, { filter:'brightness(1.25)' }, { filter:'brightness(1)' }
      ], { duration: 260, easing: 'ease-out' });
      // TODO: Hook to your real SOS flow (vibrate, call, SMS, video, etc.)
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

 const gpsWarning = document.getElementById("auxVal");
 const signal=document.getElementById("signal");
 let gpsTimeout;

 // Function to handle GPS signal loss
 function showGPSWarning() {
   gpsWarning.innerHTML="Lost";
  
 }

 // Function to hide the warning
 function hideGPSWarning() {
   gpsWarning.innerHTML="Detected";
 
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
// call back
 watchPosition();
 document.querySelector(".callback").addEventListener("click", () => {
   alert("📞 Call-back request sent to your guardian!");
 });


