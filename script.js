const yesBtn = document.getElementById("yesBtn");
const noBtn  = document.getElementById("noBtn");

const card = document.getElementById("card");
const title = document.getElementById("title");
const subtitle = document.getElementById("subtitle");
const hint = document.getElementById("hint");
const btnRow = document.getElementById("btnRow");

if (!noBtn) {
  // If this triggers, your HTML still has the wrong id or duplicate files.
  alert('NO button not found. Make sure there is exactly one element with id="noBtn".');
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function setTopLeft() {
  noBtn.style.position = "fixed";
  noBtn.style.left = "12px";
  noBtn.style.top = "12px";
  noBtn.style.zIndex = "99999";
}

function flee(wiggle = true) {
  const pad = 16;
  const vw = document.documentElement.clientWidth;
  const vh = document.documentElement.clientHeight;

  const r = noBtn.getBoundingClientRect();
  const maxX = vw - r.width - pad;
  const maxY = vh - r.height - pad;

  // Ensure it moves vertically a lot: choose top 25% OR bottom 25%
  const topBand = Math.random() < 0.5;
  let y = topBand
    ? Math.random() * (maxY * 0.25)
    : (maxY * 0.75) + Math.random() * (maxY * 0.25);

  let x = Math.random() * maxX;

  x = clamp(x, pad, maxX);
  y = clamp(y, pad, maxY);

  noBtn.style.left = `${x}px`;
  noBtn.style.top  = `${y}px`;

  if (wiggle) {
    noBtn.animate(
      [
        { transform: "scale(1) rotate(0deg)" },
        { transform: "scale(1.07) rotate(-10deg)" },
        { transform: "scale(1) rotate(8deg)" },
        { transform: "scale(1) rotate(0deg)" }
      ],
      { duration: 180 }
    );
  }
}

// Show that JS is running (you’ll see the hint change)
window.addEventListener("DOMContentLoaded", () => {
  setTopLeft();
  hint.textContent = "JS loaded ✅ (try to click NO 😈)";
});

// Use pointer events (covers mouse + touch + pen)
document.addEventListener("pointermove", (e) => {
  const r = noBtn.getBoundingClientRect();
  const cx = r.left + r.width / 2;
  const cy = r.top + r.height / 2;
  const dist = Math.hypot(e.clientX - cx, e.clientY - cy);

  // Flee sooner = harder to catch
  if (dist < 220) flee(true);
});

// If you try to press anywhere, it flees (mobile-proof)
document.addEventListener("pointerdown", () => flee(true));

// If somehow clicked, still flees
noBtn.addEventListener("click", (e) => {
  e.preventDefault();
  flee(true);
});

// YES button success state
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

    requestAnimationFrame(() => {
      const fall = 80 + Math.random() * 40;
      s.style.transform = `translateY(${fall}vh) rotate(${Math.random() * 360}deg)`;
      s.style.opacity = "0";
    });
  }

  setTimeout(() => layer.remove(), 1800);
}
