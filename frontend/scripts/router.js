// ============================================================
// SpaceExplorer 2.0 — SPA Router
// ============================================================

const PAGES = {
  'dashboard':    { title: 'Mission Control Dashboard', module: () => initDashboard() },
  'missions':     { title: 'Active Missions',            module: () => initMissions() },
  'crew':         { title: 'Crew Roster',                module: () => initCrew() },
  'discoveries':  { title: 'Discovery Log',              module: () => initDiscoveries() },
  'observations': { title: 'Observation Log',            module: () => initObservations() },
  'launches':     { title: 'Live Launches',              module: () => initLaunches() },
  'leaderboard':  { title: 'Leaderboard',                module: () => initLeaderboard() },
  'search':       { title: 'Search & Database',          module: () => initSearch() },
  'login':        { title: 'Login / Register',           module: () => initLogin() }
};

let currentPage = null;

function navigateTo(page) {
  if (!PAGES[page]) return;
  if (currentPage === page) return;

  // Exit animation on old page
  if (currentPage) {
    const oldEl = document.getElementById(`page-${currentPage}`);
    if (oldEl) {
      oldEl.classList.add('exiting');
      setTimeout(() => { oldEl.classList.remove('active', 'exiting'); }, 200);
    }
  }

  // Update nav — wait for exit to partly play
  setTimeout(() => {
    // Show new page
    const newEl = document.getElementById(`page-${page}`);
    if (newEl) {
      newEl.classList.add('active');
      newEl.classList.remove('exiting');
    }

    // Update active nav item
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.toggle('active', item.dataset.page === page);
    });

    // Update header title
    const titleEl = document.getElementById('page-title');
    if (titleEl) titleEl.textContent = PAGES[page].title;

    currentPage = page;

    // Init page module
    try { PAGES[page].module(); } catch(e) { console.warn('Page init error:', e); }

    // Scroll to top
    const main = document.getElementById('main-content');
    if (main) main.scrollTop = 0;
  }, 150);
}

function initRouter() {
  // Wire up sidebar nav
  document.querySelectorAll('.nav-item[data-page]').forEach(item => {
    item.addEventListener('click', () => navigateTo(item.dataset.page));
  });

  // Navigate to dashboard on load
  navigateTo('dashboard');
}
