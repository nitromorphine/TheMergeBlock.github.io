const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const noZone = document.getElementById("noZone");

const card = document.getElementById("card");
const title = document.getElementById("title");
const subtitle = document.getElementById("subtitle");
const hint = document.getElementById("hint");
const btnRow = document.getElementById("btnRow");

// --- "No" button dodge logic ---
function placeNoRandom() {
  const zoneRect = noZone.getBoundingClientRect();
  const btnRect = noBtn.getBoundingClientRect();

  // Available space inside zone
  const maxX = Math.max(0, zoneRect.width - btnRect.width);
  const maxY = Math.max(0, zoneRect.height - btnRect.height);

  // Random position
  const x = Math.random() * maxX;
  const y = Math.random() * maxY;

  noBtn.style.left = `${x}px`;
  noBtn.style.top = `${y}px`;
}

function dodge() {
  // Make it feel playful: move a couple times quickly
  placeNoRandom();
  setTimeout(placeNoRandom, 70);
}

noBtn.addEventListener("mouseenter", dodge);

// Mobile: if they try to tap near it, it scoots away
noZone.addEventListener("touchstart", (e) => {
  e.preventDefault();
  dodge();
}, { passive: false });

// Just in case someone manages to click it: ignore
noBtn.addEventListener("click", (e) => {
  e.preventDefault();
  dodge();
});

// Initial random placement after layout
window.addEventListener("load", () => {
  placeNoRandom();
});

// --- Yes button success state ---
yesBtn.addEventListener("click", () => {
  card.classList.add("success", "pop");

  title.textContent = "YAY!! 💖💖💖";
  subtitle.textContent = "Okay… it’s official. You’re my Valentine now 😌🌹";
  hint.textContent = "I’m smiling like an idiot right now.";

  btnRow.innerHTML = `
    <div style="display:flex; flex-direction:column; gap:10px; align-items:center;">
      <div style="font-size:18px; font-weight:800;">💌 Date idea:</div>
      <div class="small">Pick one: 🍕 Pizza • 🍦 Ice cream • 🎬 Movie • 🌮 Tacos • 🌙 Night drive</div>
      <button class="btn yes" id="cuteBtn" type="button">Send a hug 🫶</button>
    </div>
  `;

  // small confetti hearts
  spawnHeartsConfetti(36);

  const cuteBtn = document.getElementById("cuteBtn");
  cuteBtn.addEventListener("click", () => {
    spawnHeartsConfetti(18);
    cuteBtn.textContent = "HUG DELIVERED ✅";
    cuteBtn.disabled = true;
    cuteBtn.style.filter = "brightness(0.98)";
    cuteBtn.style.cursor = "default";
  });
});

function spawnHeartsConfetti(count = 30) {
  const layer = document.createElement("div");
  layer.className = "confetti";
  document.body.appendChild(layer);

  const emojis = ["💖","💘","💕","💞","🌸","✨","🍓","🫶"];

  for (let i = 0; i < count; i++) {
    const s = document.createElement("span");
    s.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    s.style.position = "absolute";
    s.style.left = `${Math.random() * 100}vw`;
    s.style.top = `-10px`;
    s.style.fontSize = `${14 + Math.random() * 20}px`;
    s.style.opacity = `${0.75 + Math.random() * 0.25}`;
    s.style.transform = `translateY(0) rotate(${Math.random() * 90 - 45}deg)`;
    s.style.transition = "transform 1.6s ease, opacity 1.6s ease";
    layer.appendChild(s);

    // Kick off the fall
    requestAnimationFrame(() => {
      const fall = 80 + Math.random() * 40; // vh
      s.style.transform = `translateY(${fall}vh) rotate(${Math.random() * 360}deg)`;
      s.style.opacity = "0";
    });
  }

  setTimeout(() => layer.remove(), 1800);
}
