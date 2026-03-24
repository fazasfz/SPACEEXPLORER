// ============================================================
// SpaceExplorer 2.0 — Dashboard Page
// ============================================================

function initDashboard() {
  const stats = getStats();

  // Stat counters
  const statEls = {
    'stat-active-missions': { val: stats.activeMissions, suffix: '' },
    'stat-crew-deployed':   { val: stats.crewDeployed, suffix: '' },
    'stat-discoveries':     { val: stats.discoveriesLogged, suffix: '' },
    'stat-success-rate':    { val: stats.launchSuccessRate, suffix: '%' }
  };

  Object.entries(statEls).forEach(([id, { val, suffix }]) => {
    const el = document.getElementById(id);
    if (el) animateCounter(el, val, 1500, suffix);
  });

  // Live Mission Feed
  renderMissionFeed();

  // Discovery Chart
  setTimeout(() => initDiscoveryChart('discovery-chart'), 300);

  // Timeline
  renderTimeline();

  // Mini Crew
  renderMiniCrew();

  // Start countdowns on feed cards
  getMissions().filter(m => m.status !== 'completed' && m.status !== 'failed').forEach(m => {
    startCountdown(`cd-${m.id}`, m.launchDate);
  });
}

function renderMissionFeed() {
  const container = document.getElementById('mission-feed');
  if (!container) return;
  const missions = getMissions().slice(0, 6);
  if (!missions.length) {
    container.innerHTML = '<div class="empty-state"><div class="empty-icon">🚀</div><div class="empty-title">No Missions</div></div>';
    return;
  }
  container.innerHTML = missions.map(m => {
    const gradient = `linear-gradient(135deg, hsl(${Math.abs(m.name.charCodeAt(0) * 7) % 360},60%,15%), hsl(${Math.abs(m.name.charCodeAt(2) * 13) % 360},70%,20%))`;
    const crewNames = getAstronauts().filter(a => a.missionId === m.id);
    const avatarsHTML = crewNames.slice(0,3).map(a =>
      `<span class="crew-avatar" style="background:${hashColor(a.name)}">${getInitials(a.name)}</span>`
    ).join('') + (crewNames.length > 3 ? `<span class="crew-avatar crew-avatar-more">+${crewNames.length - 3}</span>` : '');

    return `
    <div class="mission-feed-card card card-brackets" style="cursor:pointer" onclick="openMissionDetail(${m.id})">
      <div class="card-header-bg" style="background:${gradient}">
        <div style="position:relative;z-index:1;">
          <span class="badge ${m.status}">
            <span class="status-dot ${m.status}"></span>${m.status.toUpperCase()}
          </span>
        </div>
      </div>
      <div class="card-body" style="padding:var(--space-md)">
        <div class="mission-title">${m.name}</div>
        <div class="mission-destination">📍 ${m.destination}</div>
        <div class="progress-bar-wrap"><div class="progress-bar-fill" style="width:${m.progress}%"></div></div>
        <div class="countdown" id="cd-${m.id}">Loading...</div>
        <div class="crew-stack" style="margin-bottom:0">${avatarsHTML}</div>
        <div style="display:flex;gap:var(--space-xs);margin-top:var(--space-sm)">
          <button class="btn btn-primary btn-sm" onclick="event.stopPropagation();openMissionDetail(${m.id})">VIEW DETAILS</button>
        </div>
      </div>
    </div>`;
  }).join('');

  // Restart countdowns
  getMissions().forEach(m => startCountdown(`cd-${m.id}`, m.launchDate));
}

function openMissionDetail(id) {
  const m = getMission(id);
  if (!m) return;
  const crew = getAstronauts().filter(a => a.missionId === id);
  openModal(`${m.name} — Mission Brief`, `
    <div style="display:grid;gap:var(--space-md)">
      <div style="display:flex;gap:var(--space-md);align-items:center">
        <span class="badge ${m.status}"><span class="status-dot ${m.status}"></span>${m.status.toUpperCase()}</span>
        <span class="badge ${m.priority}">${m.priority.toUpperCase()}</span>
      </div>
      <div>
        <div class="form-label">Destination</div>
        <div style="font-family:var(--font-mono);color:var(--accent-primary)">📍 ${m.destination}</div>
      </div>
      <div>
        <div class="form-label">Launch Date</div>
        <div style="font-family:var(--font-mono)">${formatDate(m.launchDate)}</div>
      </div>
      <div>
        <div class="form-label">Duration</div>
        <div>${m.duration}</div>
      </div>
      <div>
        <div class="form-label">Progress</div>
        <div class="progress-bar-wrap" style="margin:4px 0"><div class="progress-bar-fill" style="width:${m.progress}%"></div></div>
        <div style="font-family:var(--font-mono);font-size:0.75rem;color:var(--accent-primary)">${m.progress}% complete</div>
      </div>
      <div>
        <div class="form-label">Objective</div>
        <div style="font-size:0.82rem;color:var(--text-secondary);line-height:1.6">${m.objective}</div>
      </div>
      ${crew.length ? `<div>
        <div class="form-label">Crew (${crew.length})</div>
        <div style="display:flex;flex-wrap:wrap;gap:var(--space-xs)">
          ${crew.map(a => `<span class="badge commander">${a.name.split(' ').pop()}</span>`).join('')}
        </div>
      </div>` : ''}
    </div>
  `, [{ id:'close', label:'Close', class:'btn btn-ghost', handler: closeModal }]);
}

function renderTimeline() {
  const container = document.getElementById('dash-timeline');
  if (!container) return;
  const events = getTimelineEvents();
  if (!events.length) { container.innerHTML = '<div class="empty-state"><div class="empty-icon">📅</div><div class="empty-title">No Events</div></div>'; return; }
  container.innerHTML = events.map(e => `
    <div class="timeline-item">
      <div class="timeline-icon" style="border-color:${e.color}">${e.icon}</div>
      <div class="timeline-content">
        <div class="timeline-text">${e.text}</div>
        <div class="timeline-date">${formatDate(e.date)}</div>
      </div>
    </div>
  `).join('');
}

function renderMiniCrew() {
  const container = document.getElementById('dash-crew');
  if (!container) return;
  const crew = getAstronauts().slice(0, 5);
  if (!crew.length) { container.innerHTML = '<div class="empty-state"><div class="empty-icon">👨‍🚀</div><div class="empty-title">No Crew</div></div>'; return; }
  container.innerHTML = crew.map(a => `
    <div class="mini-crew-row" onclick="navigateTo('crew')">
      <div class="mini-crew-avatar" style="background:${hashColor(a.name)}">${getInitials(a.name)}</div>
      <div class="mini-crew-info">
        <div class="mini-crew-name">${a.name.replace(/^(Commander|Captain|Specialist|Pilot|Lt\.|Dr\.)\s/, '')}</div>
        <div class="mini-crew-role">${a.rank.toUpperCase()} · ${a.specialty}</div>
      </div>
      <span class="badge ${a.status}">${a.status.replace('-', ' ').toUpperCase()}</span>
    </div>
  `).join('');
}
