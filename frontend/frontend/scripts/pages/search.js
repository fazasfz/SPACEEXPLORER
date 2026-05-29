// ============================================================
// SpaceExplorer 2.0 — Search Page
// ============================================================

let searchCat = 'all';
let searchQuery = '';
let dbTabActive = 'missions';

function initSearch() {
  initSearchInput();
  initCategoryPills();
  initDbTabs();
  renderDbTable('missions');
  // Typing placeholder animation
  animatePlaceholder();
}

const SEARCH_PLACEHOLDERS = ['Search missions...', 'Find an astronaut...', 'Look up discoveries...', 'Explore observations...'];
let phIdx = 0;
function animatePlaceholder() {
  const input = document.getElementById('main-search-input');
  if (!input) return;
  setInterval(() => {
    phIdx = (phIdx + 1) % SEARCH_PLACEHOLDERS.length;
    input.placeholder = SEARCH_PLACEHOLDERS[phIdx];
  }, 2500);
}

function initSearchInput() {
  const input = document.getElementById('main-search-input');
  if (!input) return;
  input.addEventListener('input', debounce(() => {
    searchQuery = input.value.trim();
    renderSearchResults();
  }, 300));
}

function initCategoryPills() {
  document.querySelectorAll('.category-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.category-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      searchCat = pill.dataset.cat;
      renderSearchResults();
    });
  });
}

function renderSearchResults() {
  const container = document.getElementById('search-results');
  if (!container) return;
  if (!searchQuery) { container.innerHTML = ''; return; }

  const q = searchQuery.toLowerCase();
  const results = { missions: [], crew: [], discoveries: [], observations: [] };

  if (searchCat === 'all' || searchCat === 'missions') {
    results.missions = getMissions().filter(m => m.name.toLowerCase().includes(q) || m.destination.toLowerCase().includes(q));
  }
  if (searchCat === 'all' || searchCat === 'crew') {
    results.crew = getAstronauts().filter(a => a.name.toLowerCase().includes(q) || a.specialty.toLowerCase().includes(q));
  }
  if (searchCat === 'all' || searchCat === 'discoveries') {
    results.discoveries = getDiscoveries().filter(d => d.title.toLowerCase().includes(q) || d.discoveredBy.toLowerCase().includes(q) || d.location.toLowerCase().includes(q));
  }
  if (searchCat === 'all' || searchCat === 'observations') {
    results.observations = getObservations().filter(o => o.object.toLowerCase().includes(q) || o.location.toLowerCase().includes(q));
  }

  const total = Object.values(results).reduce((s, a) => s + a.length, 0);
  if (!total) {
    container.innerHTML = '<div class="empty-state"><div class="empty-icon">🔍</div><div class="empty-title">No Results</div><div class="empty-desc">Try a different search term or category.</div></div>';
    return;
  }

  let html = '';
  if (results.missions.length) {
    html += `<div class="search-result-group" style="margin-bottom:var(--space-lg)"><h3>🚀 Missions (${results.missions.length})</h3>`;
    html += results.missions.map(m => `
      <div class="search-result-item" onclick="navigateTo('missions');openMissionDetail(${m.id})">
        <div class="result-type-icon">🚀</div>
        <div><div class="result-name">${m.name}</div><div class="result-desc">${m.destination} · ${m.status.toUpperCase()}</div></div>
        <button class="btn btn-ghost btn-sm result-view" onclick="event.stopPropagation();navigateTo('missions')">View</button>
      </div>`).join('');
    html += '</div>';
  }
  if (results.crew.length) {
    html += `<div class="search-result-group" style="margin-bottom:var(--space-lg)"><h3>👨‍🚀 Crew (${results.crew.length})</h3>`;
    html += results.crew.map(a => `
      <div class="search-result-item" onclick="navigateTo('crew');viewAstronautProfile(${a.id})">
        <div class="result-type-icon">👨‍🚀</div>
        <div><div class="result-name">${a.name}</div><div class="result-desc">${a.rank.toUpperCase()} · ${a.specialty}</div></div>
        <button class="btn btn-ghost btn-sm result-view">View</button>
      </div>`).join('');
    html += '</div>';
  }
  if (results.discoveries.length) {
    html += `<div class="search-result-group" style="margin-bottom:var(--space-lg)"><h3>🔬 Discoveries (${results.discoveries.length})</h3>`;
    html += results.discoveries.map(d => `
      <div class="search-result-item" onclick="navigateTo('discoveries')">
        <div class="result-type-icon">🔬</div>
        <div><div class="result-name">${d.title}</div><div class="result-desc">${d.location} · ${d.discoveredBy}</div></div>
        <button class="btn btn-ghost btn-sm result-view">View</button>
      </div>`).join('');
    html += '</div>';
  }
  if (results.observations.length) {
    html += `<div class="search-result-group" style="margin-bottom:var(--space-lg)"><h3>🔭 Observations (${results.observations.length})</h3>`;
    html += results.observations.map(o => `
      <div class="search-result-item" onclick="navigateTo('observations')">
        <div class="result-type-icon">🔭</div>
        <div><div class="result-name">${o.object}</div><div class="result-desc">${o.location} · ${o.seeing} seeing</div></div>
        <button class="btn btn-ghost btn-sm result-view">View</button>
      </div>`).join('');
    html += '</div>';
  }
  container.innerHTML = html;
}

function initDbTabs() {
  document.querySelectorAll('.db-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.db-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      dbTabActive = tab.dataset.table;
      renderDbTable(dbTabActive);
    });
  });
}

function renderDbTable(type) {
  const container = document.getElementById('db-table-container');
  if (!container) return;

  const configs = {
    missions: {
      data: () => getMissions(),
      cols: ['Name','Destination','Status','Priority','Launch Date','Crew'],
      row: m => [m.name, m.destination, `<span class="badge ${m.status}">${m.status.toUpperCase()}</span>`, `<span class="badge ${m.priority}">${m.priority.toUpperCase()}</span>`, formatDate(m.launchDate), m.crewSize]
    },
    astronauts: {
      data: () => getAstronauts(),
      cols: ['Name','Rank','Specialty','Experience','Nationality','Status'],
      row: a => [a.name, `<span class="badge ${a.rank}">${a.rank.toUpperCase()}</span>`, a.specialty, `<span style="font-family:var(--font-mono)">${a.experience} yrs</span>`, a.nationality||'N/A', `<span class="badge ${a.status}">${a.status.replace('-',' ').toUpperCase()}</span>`]
    },
    discoveries: {
      data: () => getDiscoveries(),
      cols: ['Title','Type','Location','Discovered By','Significance','Date'],
      row: d => [d.title, d.type, d.location, d.discoveredBy, renderStars(d.significance||3), formatDate(d.date)]
    },
    observations: {
      data: () => getObservations(),
      cols: ['Object','Type','Location','Equipment','Seeing','Date'],
      row: o => [o.object, o.objectType||'—', o.location, o.equipment||'—', `<span class="badge ${o.seeing==='excellent'?'active':o.seeing==='good'?'completed':'hold'}">${o.seeing?.toUpperCase()}</span>`, formatDate((o.datetime||'').split('T')[0])]
    }
  };

  const cfg = configs[type];
  if (!cfg) return;
  let data = cfg.data();

  // Filter input
  const filterEl = document.getElementById('db-filter-input');
  const filterVal = filterEl ? filterEl.value.toLowerCase() : '';
  if (filterVal) {
    data = data.filter(item => Object.values(item).some(v => String(v).toLowerCase().includes(filterVal)));
  }

  const html = `
  <div style="margin-bottom:var(--space-sm)">
    <input class="form-input" id="db-filter-input" placeholder="Filter ${type}..." style="max-width:300px" value="${filterVal}" oninput="renderDbTable('${type}')">
    <button class="btn btn-ghost btn-sm" onclick="exportCSV('${type}')" style="margin-left:var(--space-sm)">📥 Export CSV</button>
  </div>
  <div class="data-table-wrap">
    <table class="data-table">
      <thead><tr>${cfg.cols.map(c=>`<th>${c}</th>`).join('')}</tr></thead>
      <tbody>${data.length ? data.map(item => `<tr>${cfg.row(item).map(v=>`<td>${v}</td>`).join('')}</tr>`).join('') : `<tr><td colspan="${cfg.cols.length}"><div class="empty-state" style="padding:32px"><div class="empty-icon">🔍</div><div class="empty-title">No Data</div></div></td></tr>`}</tbody>
    </table>
  </div>`;
  container.innerHTML = html;
}

function exportCSV(type) {
  const data = { missions: getMissions, astronauts: getAstronauts, discoveries: getDiscoveries, observations: getObservations }[type]?.() || [];
  if (!data.length) return showToast('No data to export', 'warning');
  const headers = Object.keys(data[0]);
  const csv = [headers.join(','), ...data.map(row => headers.map(h => `"${String(row[h]||'').replace(/"/g,'""')}"`).join(','))].join('\n');
  const a = document.createElement('a');
  a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
  a.download = `${type}_export.csv`;
  a.click();
  showToast(`Exported ${data.length} ${type} records`, 'success');
}
