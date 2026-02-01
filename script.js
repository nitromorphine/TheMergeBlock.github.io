const yesBtn = document.getElementById("yesBtn");
const noBtn  = document.getElementById("noBtn");

const card = document.getElementById("card");
const title = document.getElementById("title");
const subtitle = document.getElementById("subtitle");
const hint = document.getElementById("hint");
const btnRow = document.getElementById("btnRow");

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function setNoPos(px, py) {
  // We move the button with CSS variables -> transform translate()
  noBtn.style.setProperty("--nx", `${px}px`);
  noBtn.style.setProperty("--ny", `${py}px`);
}

function getNoCenter() {
  const r = noBtn.getBoundingClientRect();
  return { cx: r.left + r.width / 2, cy: r.top + r.height / 2, r };
}

function flee(wiggle = true) {
  const pad = 16;

  const vw = document.documentElement.clientWidth;
  const vh = document.documentElement.clientHeight;

  const rect = noBtn.getBoundingClientRect();

  // usable bounds for placing the button fully on screen
  const maxX = vw - rect.width - pad;
  const maxY = vh - rect.height - pad;

  // Bias vertical movement strongly so it goes UP/DOWN a lot
  const topBand = Math.random() < 0.5;
  let y = topBand
    ? Math.random() * (maxY * 0.25)
    : (maxY * 0.75) + Math.random() * (maxY * 0.25);

  let x = Math.random() * maxX;

  x = clamp(x, pad, maxX);
  y = clamp(y, pad, maxY);

  setNoPos(x, y);

  if (wiggle) {
    noBtn.animate(
      [
        { transform: `translate(${x}px, ${y}px) scale(1) rotate(0deg)` },
        { transform: `translate(${x}px, ${y}px) scale(1.07) rotate(-10deg)` },
        { transform: `translate(${x}px, ${y}px) scale(1) rotate(8deg)` },
        { transform: `translate(${x}px, ${y}px) scale(1) rotate(0deg)` }
      ],
      { duration: 180 }
    );
  }
}

// Start top-left (but pretty)
window.addEventListener("DOMContentLoaded", () => {
  setNoPos(12, 12);
});

// Use pointer events (mouse + touch + pen)
document.addEventListener("pointermove", (e) => {
  const { cx, cy } = getNoCenter();
  const dist = Math.hypot(e.clientX - cx, e.clientY - cy);

  // bigger number = runs away sooner
  if (dist < 220) flee(true);
});

// Mobile-proof: any press makes it flee
document.addEventListener("pointerdown", () => flee(true));

// If somehow clicked, still flee
noBtn.addEventListener("click", (e) => {
  e.preventDefault();
  flee(true);
});

// ----------------------------
// YES BUTTON SUCCESS STATE
// ----------------------------
yesBtn.addEventListener("click", () => {
  card.classList.add("success", "pop");

  title.textContent = "YAY!! 💖💖💖";
  subtitle.textContent = "Okay… it’s official. You’re my Valentine now 😌🌹";
  hint.textContent = "You chose correctly 😌💘";

  btnRow.innerHTML = `
    <div style="display:flex; flex-direction:column; gap:12px; align-items:center;">
      <div style="font-size:18px; font-weight:800;">💌 Date idea:</div>
      <div class="small">🍕 Pizza • 🍦 Ice cream • 🎬 Movie • 🌮 Tacos • 🌙 Night drive</div>
      <button class="btn yes" id="cuteBtn" type="button">Send a hug 🫶</button>
    </div>
  `;

  spawnHeartsConfetti(40);

  const cuteBtn = document.getElementById("cuteBtn");
  cuteBtn.addEventListener("click", () => {
    spawnHeartsConfetti(20);
    cuteBtn.textContent = "HUG DELIVERED ✅";
    cuteBtn.disabled = true;
    cuteBtn.style.filter = "brightness(0.98)";
    cuteBtn.style.cursor = "default";
  });
});

// Falling emoji confetti
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

    requestAnimationFrame(() => {
      const fall = 80 + Math.random() * 40;
      s.style.transform = `translateY(${fall}vh) rotate(${Math.random() * 360}deg)`;
      s.style.opacity = "0";
    });
  }

  setTimeout(() => layer.remove(), 1800);
}
