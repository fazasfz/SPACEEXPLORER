// ============================================================
// SpaceExplorer 2.0 — Leaderboard Page
// ============================================================

function initLeaderboard() {
  renderPodium();
  renderLeaderboardTable();
  renderAchievements();
  initPointsSystem();
}

function renderPodium() {
  const lb = getLeaderboard();
  const [gold, silver, bronze] = lb;
  [
    { user: gold, id: 'podium-1', cls: 'podium-place-1' },
    { user: silver, id: 'podium-2', cls: 'podium-place-2' },
    { user: bronze, id: 'podium-3', cls: 'podium-place-3' }
  ].forEach(({ user, id, cls }) => {
    if (!user) return;
    const el = document.getElementById(id);
    if (!el) return;
    el.querySelector('.podium-avatar').textContent = getInitials(user.username.replace(/_/g, ' '));
    el.querySelector('.podium-username').textContent = user.username;
    el.querySelector('.podium-pts').textContent = user.points.toLocaleString() + ' pts';
  });
}

function renderLeaderboardTable() {
  const tbody = document.getElementById('lb-table-body');
  if (!tbody) return;
  const lb = getLeaderboard();
  const medals = ['🥇', '🥈', '🥉'];
  tbody.innerHTML = lb.map((u, i) => {
    const total = u.missions + u.discoveries + u.observations + u.community;
    const mPct = total ? (u.missions / total * 100).toFixed(0) : 25;
    const dPct = total ? (u.discoveries / total * 100).toFixed(0) : 25;
    const oPct = total ? (u.observations / total * 100).toFixed(0) : 25;
    const cPct = total ? (u.community / total * 100).toFixed(0) : 25;
    return `
    <tr class="lb-row" style="animation-delay:${i*50}ms">
      <td class="mono" style="font-weight:700;width:48px">
        ${i < 3 ? medals[i] : `<span style="color:var(--text-dim)">#${i+1}</span>`}
      </td>
      <td>
        <div style="display:flex;align-items:center;gap:var(--space-sm)">
          <div style="width:36px;height:36px;border-radius:50%;background:${hashColorPair(u.username)};display:flex;align-items:center;justify-content:center;font-family:var(--font-heading);font-size:0.65rem;font-weight:700;color:white;flex-shrink:0">${getInitials(u.username.replace(/_/g,' '))}</div>
          <span style="font-weight:500">${u.username}</span>
        </div>
      </td>
      <td class="mono" style="color:var(--accent-gold);font-weight:700">${u.points.toLocaleString()}</td>
      <td>
        <div style="display:flex;height:8px;border-radius:4px;overflow:hidden;width:120px;gap:1px">
          <div class="pts-missions" style="width:${mPct}%"></div>
          <div class="pts-discoveries" style="width:${dPct}%"></div>
          <div class="pts-observations" style="width:${oPct}%"></div>
          <div class="pts-community" style="width:${cPct}%"></div>
        </div>
      </td>
      <td><span class="badge ${u.level}">${u.level.toUpperCase()}</span></td>
      <td style="font-size:0.72rem;color:var(--text-dim);font-family:var(--font-mono)">${u.lastActive}</td>
    </tr>`;
  }).join('');
}

const ACHIEVEMENTS = [
  { icon: '🚀', label: 'First Launch', unlocked: true },
  { icon: '🌟', label: '10 Observations', unlocked: true },
  { icon: '⭐', label: 'Mission Cmdr', unlocked: true },
  { icon: '🔬', label: 'First Discovery', unlocked: true },
  { icon: '🌌', label: 'Deep Space', unlocked: false },
  { icon: '🏆', label: 'Top Explorer', unlocked: false },
  { icon: '🛸', label: 'First Contact', unlocked: false },
  { icon: '🌙', label: 'Lunar Return', unlocked: true },
  { icon: '☄️', label: 'Comet Watcher', unlocked: false },
  { icon: '🪐', label: 'Planet Hunter', unlocked: false },
];

function renderAchievements() {
  const container = document.getElementById('achievements-grid');
  if (!container) return;
  container.innerHTML = ACHIEVEMENTS.map(a => `
    <div class="achievement-hex">
      <div class="hex-shape ${a.unlocked ? '' : 'locked'}">${a.icon}${!a.unlocked ? '<div style="position:absolute;top:2px;right:2px;font-size:0.6rem">🔒</div>' : ''}</div>
      <div class="hex-label">${a.label}</div>
    </div>
  `).join('');
}

function initPointsSystem() {
  const header = document.getElementById('pts-system-header');
  const body = document.getElementById('pts-system-body');
  if (header && body) {
    const toggle = document.getElementById('pts-toggle-icon');
    header.addEventListener('click', () => {
      body.classList.toggle('open');
      if (toggle) toggle.textContent = body.classList.contains('open') ? '▲' : '▼';
    });
  }
}
