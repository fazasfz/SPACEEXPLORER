// ============================================================
// SpaceExplorer 2.0 — Final Integrated Dashboard Controller
// ============================================================

let liveDashboardLaunches = [];

// 1. APOD Helper
function applyDashboardApod(apod) {
  const apodContainer = document.getElementById('dashboard-hero-banner');
  if (apodContainer) {
    apodContainer.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.5), rgba(10,12,18,1)), url('${apod.url}')`;
    apodContainer.style.backgroundSize = 'cover';
    apodContainer.style.backgroundPosition = 'center';
  }
}

// 2. Timeline Helper
function renderTimeline() {
  const container = document.getElementById('dash-timeline');
  if (!container) return;
  container.innerHTML = '<div class="timeline-item">System Operational</div>';
}

// 3. Main Initialization Logic
async function initDashboard() {
  try {
    const [launches, stats, apodData] = await Promise.all([
      fetchUpcomingLaunchesAPI(),
      getStats(),
      fetchNasaApod()
    ]);

    liveDashboardLaunches = launches;
    applyDashboardApod(apodData);

    const safeStats = {
      activeMissions: liveDashboardLaunches.length || 0,
      crewDeployed: stats.crewDeployed || 0,
      discoveriesLogged: stats.discoveriesLogged || 0,
      launchSuccessRate: stats.launchSuccessRate || 0
    };

    const statEls = {
      'stat-active-missions': { val: safeStats.activeMissions, suffix: '' },
      'stat-crew-deployed':   { val: safeStats.crewDeployed, suffix: '' },
      'stat-discoveries':     { val: safeStats.discoveriesLogged, suffix: '' },
      'stat-success-rate':    { val: safeStats.launchSuccessRate, suffix: '%' }
    };

    Object.entries(statEls).forEach(([id, { val, suffix }]) => {
      const el = document.getElementById(id);
      if (el) animateCounter(el, val, 1500, suffix);
    });

    renderMissionFeed();
    renderTimeline();
    await renderMiniCrew();
    setTimeout(() => initDiscoveryChart('discovery-chart'), 300);

  } catch (error) {
    console.error("Dashboard initialization error:", error);
  }
}

// 4. Mission Feed Rendering (Updated with MongoDB 'name' and 'destination')
function renderMissionFeed() {
  const container = document.getElementById('mission-feed');
  if (!container) return;

  if (!liveDashboardLaunches || liveDashboardLaunches.length === 0) {
    container.innerHTML = '<div class="empty-state">No Active Missions</div>';
    return;
  }

  container.innerHTML = liveDashboardLaunches.map(m => {
    const displayName = m.name || "Unnamed Mission"; 
    const displayDest = m.destination || "Deep Space";

    return `
    <div class="mission-feed-card card card-brackets">
      <div class="card-body" style="padding:var(--space-md)">
        <div class="mission-title" style="font-weight:bold">${displayName}</div>
        <div class="mission-destination" style="font-size:0.8rem">📍 ${displayDest}</div>
      </div>
    </div>`;
  }).join('');
}

// 5. Crew Rendering
async function renderMiniCrew() {
  const container = document.getElementById('dash-crew');
  if (!container) return;
  const astroResponse = await getAstronauts();
  const crew = (astroResponse.data || astroResponse || []).slice(0, 5);
  if (!crew.length) return;
  container.innerHTML = crew.map(a => `
    <div class="mini-crew-row">
      <div class="mini-crew-avatar">${getInitials(a.name)}</div>
      <div class="mini-crew-info">
        <div class="mini-crew-name">${a.name}</div>
        <div class="mini-crew-role">${a.rank || 'CREW'}</div>
      </div>
    </div>
  `).join('');
}

// Initialize on load
initDashboard();