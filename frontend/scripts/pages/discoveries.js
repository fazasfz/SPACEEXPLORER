// ============================================================
// SpaceExplorer 2.0 — Discoveries Page
// ============================================================

let discTypeFilters = new Set(['geological','astronomical','biological','chemical','technological']);
let discSearch = '';

function initDiscoveries() {
  updateDiscoveryHero();
  renderDiscoveries();
  initDiscoveryFilters();
  startDiscoveryTicker();
}

function updateDiscoveryHero() {
  const el = document.getElementById('total-discoveries');
  if (el) animateCounter(el, getDiscoveries().length, 1200);
}

function startDiscoveryTicker() {
  const ticker = document.getElementById('discovery-ticker');
  if (!ticker) return;
  const items = getDiscoveries().map(d => `✦ ${d.title} — ${d.discoveredBy} — ${formatDate(d.date)}`);
  ticker.textContent = items.join('   ·   ');
}

function initDiscoveryFilters() {
  document.querySelectorAll('.disc-type-cb').forEach(cb => {
    cb.addEventListener('change', () => {
      if (cb.checked) discTypeFilters.add(cb.value);
      else discTypeFilters.delete(cb.value);
      renderDiscoveries();
    });
  });

  const searchEl = document.getElementById('disc-search');
  if (searchEl) searchEl.addEventListener('input', debounce(() => { discSearch = searchEl.value; renderDiscoveries(); }, 300));
}

const TYPE_ICONS = { geological: '⛰️', astronomical: '🌟', biological: '🧬', chemical: '⚗️', technological: '💡' };
const TYPE_COLORS = { geological: 'rgba(255,107,53,0.15)', astronomical: 'rgba(255,215,0,0.12)', biological: 'rgba(0,255,204,0.12)', chemical: 'rgba(200,150,255,0.12)', technological: 'rgba(0,212,255,0.12)' };

function renderDiscoveries() {
  const container = document.getElementById('discoveries-grid');
  if (!container) return;
  let items = getDiscoveries().filter(d =>
    discTypeFilters.has(d.type) &&
    (!discSearch || d.title.toLowerCase().includes(discSearch.toLowerCase()) || d.discoveredBy.toLowerCase().includes(discSearch.toLowerCase()) || d.location.toLowerCase().includes(discSearch.toLowerCase()))
  );

  if (!items.length) {
    container.innerHTML = '<div class="empty-state"><div class="empty-icon">🔬</div><div class="empty-title">No Discoveries</div><div class="empty-desc">Adjust your filters or log a new discovery.</div></div>';
    return;
  }

  container.innerHTML = items.map((d, i) => `
    <div class="discovery-card-wrap animate-in" style="animation-delay:${i*60}ms">
      <div class="card card-brackets" style="padding:var(--space-lg)">
        <div class="discovery-type-icon" style="background:${TYPE_COLORS[d.type]||'rgba(0,212,255,0.1)'}">${TYPE_ICONS[d.type]||'🔬'}</div>
        <div class="discovery-title">${d.title}</div>
        <div class="discovery-coords">📍 ${d.location}${d.lat !== undefined && d.lat !== 0 ? ` · LAT: ${d.lat}° | LON: ${d.lon}°` : ''}</div>
        <div style="font-size:0.72rem;color:var(--text-secondary);margin-bottom:var(--space-sm)">
          By <span style="color:var(--accent-pulse)">${d.discoveredBy}</span> · ${formatDate(d.date)}
        </div>
        ${renderStars(d.significance || 3)}
        <div class="discovery-desc" id="desc-${d.id}">${d.description}</div>
        <button class="read-more" onclick="toggleDiscDesc(${d.id},this)">Read more</button>
        <div style="display:flex;justify-content:flex-end;margin-top:var(--space-sm);gap:var(--space-xs)">
          <button class="btn btn-ghost btn-sm" onclick="shareDiscovery(${d.id})">📋 SHARE</button>
          <button class="btn btn-danger btn-sm" onclick="deleteDiscoveryAction(${d.id})">×</button>
        </div>
      </div>
    </div>
  `).join('');
}

function toggleDiscDesc(id, btn) {
  const el = document.getElementById(`desc-${id}`);
  if (!el) return;
  el.classList.toggle('expanded');
  btn.textContent = el.classList.contains('expanded') ? 'Read less' : 'Read more';
}

function shareDiscovery(id) {
  const d = getDiscoveries().find(x => x.id === id);
  if (!d) return;
  const text = `🔬 DISCOVERY: ${d.title}\n📍 Location: ${d.location}\nBy: ${d.discoveredBy}\nDate: ${formatDate(d.date)}\n${d.description.substring(0,200)}...`;
  navigator.clipboard.writeText(text).then(() => showToast('Discovery summary copied to clipboard!', 'success')).catch(() => showToast('Copy failed', 'error'));
}

function deleteDiscoveryAction(id) {
  const d = getDiscoveries().find(x => x.id === id);
  confirmAction(`Delete discovery <b>${d?.title || id}</b>?`, () => {
    deleteDiscovery(id);
    showToast('Discovery deleted', 'warning');
    updateDiscoveryHero();
    renderDiscoveries();
    startDiscoveryTicker();
  });
}

function openAddDiscovery() {
  let sigVal = 3;
  openPanel('Log New Discovery', `
    <form id="add-discovery-form">
      <div class="form-group">
        <label class="form-label">Discovery Title</label>
        <input class="form-input" name="title" placeholder="e.g., Subsurface Ocean Detected" required>
      </div>
      <div class="form-group">
        <label class="form-label">Type</label>
        <select class="form-select" name="type" required>
          <option value="">Select type</option>
          <option value="geological">Geological</option>
          <option value="astronomical">Astronomical</option>
          <option value="biological">Biological</option>
          <option value="chemical">Chemical</option>
          <option value="technological">Technological</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Location</label>
        <input class="form-input" name="location" placeholder="e.g., Europa South Pole" required>
      </div>
      <div class="form-group">
        <label class="form-label">Discovered By</label>
        <input class="form-input" name="discoveredBy" placeholder="Astronaut name or mission" required>
      </div>
      <div class="form-group">
        <label class="form-label">Significance (${sigVal}/5)</label>
        <div class="star-rating" id="sig-stars">
          ${[1,2,3,4,5].map(n => `<span class="star ${n<=sigVal?'active':''}" data-val="${n}" onclick="setDiscSig(${n})">★</span>`).join('')}
        </div>
        <input type="hidden" name="significance" id="sig-input" value="${sigVal}">
      </div>
      <div class="form-group">
        <label class="form-label">Description</label>
        <textarea class="form-textarea" name="description" placeholder="Detailed description of the discovery..." required style="min-height:120px"></textarea>
      </div>
      <button type="submit" class="btn btn-primary btn-full">🔬 LOG DISCOVERY</button>
    </form>`, (fd) => {
      const data = Object.fromEntries(fd);
      data.significance = parseInt(data.significance) || 3;
      addDiscovery(data);
      closePanel();
      showToast(`Discovery "${data.title}" logged!`, 'success');
      updateDiscoveryHero();
      renderDiscoveries();
      startDiscoveryTicker();
    });
}

function setDiscSig(val) {
  document.querySelectorAll('#sig-stars .star').forEach((s, i) => s.classList.toggle('active', i < val));
  const inp = document.getElementById('sig-input');
  if (inp) inp.value = val;
}
