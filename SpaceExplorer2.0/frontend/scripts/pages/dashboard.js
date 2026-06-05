// ============================================================
// SpaceExplorer 2.0 — Dashboard Page
// ============================================================

// Add variable array container at top scope level of dashboard.js to keep reference 
let liveDashboardLaunches = [];

async function initDashboard() {
  // 1. Fetch live launch metrics prior to populating charts
  liveDashboardLaunches = await fetchUpcomingLaunchesAPI();

  // 2. Fetch and apply NASA APOD background / banner
  const apodData = await fetchNasaApod();
  applyDashboardApod(apodData);

  const stats = getStats();
  stats.activeMissions = liveDashboardLaunches.length;

  // Stat counters layout engine injection
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

  renderMissionFeed();
  setTimeout(() => initDiscoveryChart('discovery-chart'), 300);
  renderTimeline();
  renderMiniCrew();
}

/**
 * Visually injects NASA APOD image and details into the dashboard panel
 */
function applyDashboardApod(apod) {
  // Option A: Look for a dedicated preview container id
  const apodContainer = document.getElementById('dashboard-hero-banner');
  if (apodContainer) {
    apodContainer.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.5), rgba(10,12,18,1)), url('${apod.url}')`;
    apodContainer.style.backgroundSize = 'cover';
    apodContainer.style.backgroundPosition = 'center';
  }
  
  // Option B: Safely inject APOD title text into an allocation block if present
  const apodTitleEl = document.getElementById('apod-title');
  if (apodTitleEl) {
    apodTitleEl.innerHTML = `🪐 <b>Astronomy Picture of the Day:</b> ${apod.title}`;
    apodTitleEl.title = apod.explanation; // Shows technical description tooltip on hover
  }
}

// Rewriting renderMissionFeed to serve live launch objects seamlessly
function renderMissionFeed() {
  const container = document.getElementById('mission-feed');
  if (!container) return;

  if (!liveDashboardLaunches.length) {
    container.innerHTML = '<div class="empty-state"><div class="empty-icon">🚀</div><div class="empty-title">No Active Launch Chains</div></div>';
    return;
  }

  container.innerHTML = liveDashboardLaunches.slice(0, 4).map(m => {
    const gradient = `linear-gradient(135deg, #111424 0%, #1a2238 100%)`;
    const badgeClass = m.status ? m.status.replace(' ', '-') : 'go';

    return `
    <div class="mission-feed-card card card-brackets" style="cursor:pointer" onclick="navigateTo('launches')">
      <div class="card-header-bg" style="background:${gradient}; border-bottom: 1px solid var(--border-subtle); padding: 8px var(--space-md);">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span class="badge ${badgeClass}">
            <span class="status-dot ${badgeClass}"></span>${badgeClass.toUpperCase()}
          </span>
          <span style="font-size:0.65rem; font-family:var(--font-mono); color:var(--accent-primary)">LIVE T-MINUS</span>
        </div>
      </div>
      <div class="card-body" style="padding:var(--space-md)">
        <div class="mission-title" style="font-weight:bold; font-size:0.95rem; line-height:1.3; height:40px; overflow:hidden;">${m.mission}</div>
        <div class="mission-destination" style="font-size:0.8rem; margin: 4px 0;">🚀 ${m.rocket}</div>
        <div class="countdown dash-live-ticker" id="dash-ticker-${m.id.replace(/[^a-zA-Z0-9]/g, '')}" data-target="${m.netDate}" style="color:var(--accent-pulse); font-family:var(--font-mono); font-size:0.85rem; margin-top:8px;">Syncing sequence...</div>
      </div>
    </div>`;
  }).join('');

  // Start internal dashboard clock cycle loops
  if (window.activeDashboardInterval) clearInterval(window.activeDashboardInterval);
  window.activeDashboardInterval = setInterval(() => {
    document.querySelectorAll('.dash-live-ticker').forEach(el => {
      const target = el.getAttribute('data-target');
      if (target) el.textContent = getCountdownString(target);
    });
  }, 1000);
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
