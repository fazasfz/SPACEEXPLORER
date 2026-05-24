// ============================================================
// SpaceExplorer 2.0 — Countdown & Mission Clock
// ============================================================

// ── Mission Clock ─────────────────────────────────────────────
// Counts up from a fixed launch date (Artemis IX)
const MISSION_EPOCH = new Date('2026-01-01T00:00:00Z').getTime();

function startMissionClock() {
  const el = document.getElementById('mission-clock-value');
  if (!el) return;
  function tick() {
    const now = Date.now();
    const elapsed = now - MISSION_EPOCH;
    const d = Math.floor(elapsed / 86400000);
    const h = Math.floor((elapsed % 86400000) / 3600000);
    const m = Math.floor((elapsed % 3600000) / 60000);
    const s = Math.floor((elapsed % 60000) / 1000);
    el.textContent = `MET ${String(d).padStart(3,'0')}:${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  }
  tick();
  setInterval(tick, 1000);
}

// ── Countdown Timers on Mission Cards ─────────────────────────
const countdownIntervals = {};

function startCountdown(elId, targetDate) {
  if (countdownIntervals[elId]) clearInterval(countdownIntervals[elId]);
  const el = document.getElementById(elId);
  if (!el) return;
  function tick() {
    el.textContent = getCountdownString(targetDate);
  }
  tick();
  countdownIntervals[elId] = setInterval(tick, 1000);
}

function clearAllCountdowns() {
  Object.values(countdownIntervals).forEach(clearInterval);
  Object.keys(countdownIntervals).forEach(k => delete countdownIntervals[k]);
}

// ── Hero Launch Countdown (Launches Page) ─────────────────────
let heroCDInterval = null;

function startHeroCountdown(targetDate) {
  if (heroCDInterval) clearInterval(heroCDInterval);
  function tick() {
    const now = new Date();
    const target = new Date(targetDate);
    let diff = target - now;
    if (diff < 0) diff = 0;
    const days  = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins  = Math.floor((diff % 3600000) / 60000);
    const secs  = Math.floor((diff % 60000) / 1000);

    const update = (id, val) => {
      const el = document.getElementById(id);
      if (el) {
        const str = String(val).padStart(2, '0');
        if (el.textContent !== str) {
          el.style.animation = 'none';
          requestAnimationFrame(() => {
            el.style.animation = 'flip-digit 0.3s ease';
          });
          el.textContent = str;
        }
      }
    };

    update('cd-days',  days);
    update('cd-hours', hours);
    update('cd-mins',  mins);
    update('cd-secs',  secs);
  }
  tick();
  heroCDInterval = setInterval(tick, 1000);
}
