const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");

const card = document.getElementById("card");
const title = document.getElementById("title");
const subtitle = document.getElementById("subtitle");
const hint = document.getElementById("hint");
const btnRow = document.getElementById("btnRow");

// ----------------------------
// NO BUTTON = IMPOSSIBLE MODE
// ----------------------------

function teleportNo(forceFar = false, wiggle = true) {
  const pad = 16;

  const vw = document.documentElement.clientWidth;
  const vh = document.documentElement.clientHeight;

  const rect = noBtn.getBoundingClientRect();
  const maxX = vw - rect.width - pad;
  const maxY = vh - rect.height - pad;

  let x = Math.random() * maxX;
  let y = Math.random() * maxY;

  if (forceFar) {
    const topBand = Math.random() < 0.5;
    y = topBand
      ? Math.random() * (maxY * 0.25)
      : (maxY * 0.75) + Math.random() * (maxY * 0.25);
  }

  x = clamp(x, pad, maxX);
  y = clamp(y, pad, maxY);

  noBtn.style.left = `${x}px`;
  noBtn.style.top  = `${y}px`;

  if (wiggle) {
    noBtn.animate(
      [
        { transform: "scale(1) rotate(0deg)" },
        { transform: "scale(1.06) rotate(-8deg)" },
        { transform: "scale(1) rotate(6deg)" },
        { transform: "scale(1) rotate(0deg)" }
      ],
      { duration: 180 }
    );
  }
}



// run when cursor gets CLOSE
document.addEventListener("mousemove", (e) => {
  const rect = noBtn.getBoundingClientRect();

  const dx = e.clientX - (rect.left + rect.width / 2);
  const dy = e.clientY - (rect.top + rect.height / 2);

  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance < 120) {
    teleportNo();
  }
});

// mobile: teleport on touch anywhere near
document.addEventListener(
  "touchstart",
  () => teleportNo(),
  { passive: true }
);

// emergency backup if click somehow happens
noBtn.addEventListener("click", (e) => {
  e.preventDefault();
  teleportNo();
});

// initial position
window.addEventListener("load", () => {
  // Start in the top-left corner and DO NOT wiggle
  noBtn.style.left = "12px";
  noBtn.style.top  = "12px";
});


// ----------------------------
// YES BUTTON SUCCESS STATE
// ----------------------------

yesBtn.addEventListener("click", () => {
  card.classList.add("success", "pop");

  title.textContent = "YAY!! 💖💖💖";
  subtitle.textContent =
    "Okay… it’s official. You’re my Valentine now 😌🌹";
  hint.textContent = "I’m smiling way too hard right now.";

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
