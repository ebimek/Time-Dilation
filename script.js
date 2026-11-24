const C = 299792458;
const SVG_NS = "http://w3.org";

function drawTicks(groupId) {
  const g = document.getElementById(groupId);
  for (let i = 0; i < 60; i++) {
    const angle = (i * 6 * Math.PI) / 180;
    const isMajor = i % 5 === 0;
    const rInner = isMajor ? 69 : 73;
    const rOuter = 77;
    const x1 = 140 + rInner * Math.sin(angle);
    const y1 = 112 - rInner * Math.cos(angle);
    const x2 = 140 + rOuter * Math.sin(angle);
    const y2 = 112 - rOuter * Math.cos(angle);

    const line = document.createElementNS(SVG_NS, "line");
    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);
    line.setAttribute("stroke", isMajor ? "#cbd5e1" : "#646b7a");
    line.setAttribute("stroke-width", isMajor ? "1.6" : "1");
    g.appendChild(line);
  }
}

drawTicks("ticks-rest");
drawTicks("ticks-mov");

const betaSlider = document.getElementById("beta");
const betaReadout = document.getElementById("beta-readout");
const t0Input = document.getElementById("t0");
const l0Input = document.getElementById("l0");
const m0Input = document.getElementById("m0");

const handRest = document.getElementById("hand-rest");
const handMov = document.getElementById("hand-mov");
const photonRest = document.getElementById("photon-rest");
const photonMov = document.getElementById("photon-mov");
const diagPath = document.getElementById("diag-path");
const pauseBtn = document.getElementById("pause-btn");
const pauseIcon = document.getElementById("pause-icon");

let beta = 0.8;
let gamma = 1 / Math.sqrt(1 - beta * beta);
let restTime = 8.5;
let movTime = restTime / gamma;
let paused = false;
let lastFrame = performance.now();

function formatScientificCaret(val) {
  if (val === 0) return "0 kg·m/s";
  const exp = Math.floor(Math.log10(Math.abs(val)));
  const mantissa = (val / Math.pow(10, exp)).toFixed(2);
  return `${mantissa}×10^${exp} kg·m/s`;
}

function formatEnergySI(joules) {
  if (joules === 0) return "0.00 J";
  const units = [
    { limit: 1e18, suffix: "EJ" },
    { limit: 1e15, suffix: "PJ" },
    { limit: 1e12, suffix: "TJ" },
    { limit: 1e9, suffix: "GJ" },
    { limit: 1e6, suffix: "MJ" },
    { limit: 1e3, suffix: "kJ" },
    { limit: 1, suffix: "J" }
  ];
  for (const u of units) {
    if (Math.abs(joules) >= u.limit) {
      return `${(joules / u.limit).toFixed(2)} ${u.suffix}`;
    }
  }
  return `${joules.toExponential(2)} J`;
}

function updateUI() {
  beta = parseFloat(betaSlider.value) || 0;
  const t0 = Math.max(0, parseFloat(t0Input.value) || 0);
  const l0 = Math.max(0, parseFloat(l0Input.value) || 0);
  const m0 = Math.max(0, parseFloat(m0Input.value) || 0);

  gamma = 1 / Math.sqrt(1 - beta * beta);
  const v = beta * C;
  const dt = gamma * t0;
  const L = l0 / gamma;
  const p = gamma * m0 * v;
  const K = (gamma - 1) * m0 * C * C;
  const E = gamma * m0 * C * C;
  const pct = Math.round((1 / gamma) * 100);

  const sliderPct = (beta / parseFloat(betaSlider.max)) * 100;
  betaSlider.style.background = `linear-gradient(to right, #8ab4f8 0%, #8ab4f8 ${sliderPct}%, #3a3f4b ${sliderPct}%, #3a3f4b 100%)`;

  betaReadout.textContent = `${beta.toFixed(3)} c`;
  document.getElementById("moving-title").textContent = `Moving (${beta.toFixed(2)} c)`;
  document.getElementById("moving-len-caption").textContent = `L = L₀/γ (${pct}%)`;
  document.getElementById("rod-contracted").style.width = `${(100 / gamma).toFixed(2)}%`;

  const visOpacity = beta > 0.01 ? Math.min(1, 0.25 + beta) : 0;
  document.getElementById("speed-lines").style.opacity = visOpacity;
  document.getElementById("motion-arrow").style.opacity = visOpacity;

  const spread = 42 * beta;
  diagPath.setAttribute("points", `${65 - spread},31 65,4 ${65 + spread},31`);

  document.getElementById("out-gamma").textContent = gamma.toFixed(3);
  document.getElementById("out-time").textContent = `${dt.toFixed(2)} s`;
  document.getElementById("out-length").textContent = `${L.toFixed(2)} m`;
  document.getElementById("out-momentum").textContent = formatScientificCaret(p);
  document.getElementById("out-ke").textContent = formatEnergySI(K);
  document.getElementById("out-te").textContent = formatEnergySI(E);
}

function animate(now) {
  const dt = (now - lastFrame) / 1000;
  lastFrame = now;

  if (!paused) {
    restTime += dt;
    movTime += dt / gamma;
  }

  const restDeg = (restTime / 60) * 360;
  const movDeg = (movTime / 60) * 360;

  handRest.setAttribute("transform", `rotate(${restDeg} 140 112)`);
  handMov.setAttribute("transform", `rotate(${movDeg} 140 112)`);

  const restPhase = (restTime * 0.8) % 2;
  const restNorm = restPhase <= 1 ? restPhase : 2 - restPhase;
  photonRest.setAttribute("cy", 29 - restNorm * 24);

  const movPhase = (movTime * 0.8) % 2;
  const movNorm = movPhase <= 1 ? movPhase : 2 - movPhase;
  const spread = 42 * beta;
  const px = movPhase <= 1
    ? (65 - spread) + movNorm * spread
    : 65 + (1 - movNorm) * spread;
  const py = 29 - movNorm * 24;
  photonMov.setAttribute("cx", px);
  photonMov.setAttribute("cy", py);

  requestAnimationFrame(animate);
}

pauseBtn.addEventListener("click", () => {
  paused = !paused;
  pauseIcon.innerHTML = paused
    ? '<polygon points="3,1.5 10.5,6 3,10.5" />'
    : '<rect x="2" y="1.5" width="3" height="9" rx="0.8" /><rect x="7" y="1.5" width="3" height="9" rx="0.8" />';
});

document.querySelectorAll(".step-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const input = document.getElementById(btn.dataset.target);
    const step = parseFloat(btn.dataset.step);
    const current = parseFloat(input.value) || 0;
    const next = Math.max(0, current + step);
    input.value = Number.isInteger(next) ? next : next.toFixed(2);
    updateUI();
  });
});

[betaSlider, t0Input, l0Input, m0Input].forEach((el) =>
  el.addEventListener("input", updateUI)
);

updateUI();
requestAnimationFrame(animate);
