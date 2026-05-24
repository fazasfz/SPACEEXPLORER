// ============================================================
// SpaceExplorer 2.0 — Launches Page
// ============================================================

function initLaunches() {
  renderLaunchHero();
  renderLaunchCards();
  renderRecentLaunches();
  renderLaunchCalendar();
}

function renderLaunchHero() {
  const upcoming = getUpcomingLaunches().sort((a, b) => new Date(a.netDate) - new Date(b.netDate));
  const next = upcoming[0];
  if (!next) {
    const nameEl = document.getElementById('hero-mission-name');
    if (nameEl) nameEl.textContent = 'No Upcoming Launches';
    return;
  }
  const nameEl = document.getElementById('hero-mission-name');
  const rocketEl = document.getElementById('hero-rocket');
  if (nameEl) nameEl.textContent = next.mission;
  if (rocketEl) rocketEl.textContent = `${next.rocket} · ${next.site}`;
  startHeroCountdown(next.netDate);
}

function renderLaunchCards() {
  const container = document.getElementById('launch-cards');
  if (!container) return;
  const launches = getLaunches().filter(l => l.status !== 'launched');
  if (!launches.length) {
    renderEmptyState('launch-cards', 'No Upcoming Launches', 'All scheduled launches have been completed.');
    return;
  }
  container.innerHTML = launches.map((l, i) => {
    const initials = l.provider.split(' ').map(w => w[0]).slice(0, 2).join('');
    const isNear = (new Date(l.netDate) - new Date()) < 7 * 86400000;
    const followed = isFollowed(l.id);
    return `
    <div class="card card-brackets animate-in" style="animation-delay:${i*60}ms">
      <div class="launch-card-provider" style="background:${hashColorPair(l.provider)}">${initials}</div>
      <div class="launch-mission-name">${l.mission}</div>
      <div class="launch-rocket-name">🚀 ${l.rocket}</div>
      <div class="launch-site">📍 ${l.site}</div>
      <div style="display:flex;align-items:center;gap:var(--space-sm);margin-bottom:var(--space-sm)">
        <span class="badge ${l.status.replace(' ','-')}"><span class="status-dot ${l.status}"></span>${l.status.toUpperCase().replace('-',' ')}</span>
        <span class="badge low">${l.missionType}</span>
      </div>
      <div class="launch-net">${formatDate(l.netDate)}</div>
      ${isNear && l.status !== 'scrubbed' ? `<div class="countdown" style="margin-bottom:var(--space-sm)">${getCountdownString(l.netDate)}</div>` : ''}
      <button class="follow-btn ${followed?'followed':''}" onclick="toggleFollow(${l.id},this)">
        ${followed ? '★ Following' : '☆ Follow Launch'}
      </button>
    </div>`;
  }).join('');
}

function toggleFollow(id, btn) {
  toggleFollowLaunch(id);
  const followed = isFollowed(id);
  btn.classList.toggle('followed', followed);
  btn.textContent = followed ? '★ Following' : '☆ Follow Launch';
  showToast(followed ? 'Launch added to watchlist' : 'Removed from watchlist', followed ? 'success' : 'info');
}

function renderRecentLaunches() {
  const container = document.getElementById('recent-launches');
  if (!container) return;
  const recent = getRecentLaunches();
  if (!recent.length) { container.innerHTML = '<div style="color:var(--text-secondary);font-size:0.82rem">No recent launches.</div>'; return; }
  container.innerHTML = recent.map(l => {
    const initials = l.provider.split(' ').map(w => w[0]).slice(0, 2).join('');
    return `
    <div class="card" style="min-width:260px;padding:var(--space-md)">
      <div style="display:flex;gap:var(--space-sm);align-items:center;margin-bottom:var(--space-sm)">
        <div style="width:36px;height:36px;border-radius:var(--radius-md);background:${hashColorPair(l.provider)};display:flex;align-items:center;justify-content:center;font-family:var(--font-heading);font-size:0.65rem;font-weight:700;color:white;flex-shrink:0">${initials}</div>
        <div>
          <div style="font-family:var(--font-heading);font-size:0.82rem">${l.mission}</div>
          <div style="font-size:0.68rem;color:var(--text-secondary)">${l.rocket}</div>
        </div>
      </div>
      <span class="badge launched">✓ LAUNCHED</span>
      <div style="font-size:0.75rem;color:var(--text-secondary);margin-top:var(--space-sm);line-height:1.5">${l.outcome || 'Mission completed.'}</div>
      <div style="font-family:var(--font-mono);font-size:0.65rem;color:var(--text-dim);margin-top:4px">${formatDate(l.netDate)}</div>
    </div>`;
  }).join('');
}

function renderLaunchCalendar() {
  const container = document.getElementById('launch-calendar-grid');
  if (!container) return;
  const now = new Date('2026-03-24');
  const year = now.getFullYear();
  const month = now.getMonth();
  const titleEl = document.getElementById('cal-month-title');
  if (titleEl) titleEl.textContent = now.toLocaleString('default', { month: 'long', year: 'numeric' });

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const launches = getLaunches();
  const launchDays = {};
  launches.forEach(l => {
    const d = new Date(l.netDate);
    if (d.getMonth() === month && d.getFullYear() === year) {
      launchDays[d.getDate()] = launchDays[d.getDate()] || [];
      launchDays[d.getDate()].push(l);
    }
  });

  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  let html = days.map(d => `<div class="cal-day-name">${d}</div>`).join('');
  for (let i = 0; i < firstDay; i++) html += `<div class="cal-day empty"></div>`;
  for (let d = 1; d <= daysInMonth; d++) {
    const isToday = d === now.getDate();
    const hasLaunch = launchDays[d];
    const launchNames = hasLaunch ? hasLaunch.map(l => l.mission).join(', ') : '';
    html += `<div class="cal-day${isToday?' today':''}${hasLaunch?' has-launch':''}" title="${launchNames}">
      ${d}${hasLaunch ? '<div class="cal-launch-dot"></div>' : ''}
    </div>`;
  }
  container.innerHTML = html;
}
