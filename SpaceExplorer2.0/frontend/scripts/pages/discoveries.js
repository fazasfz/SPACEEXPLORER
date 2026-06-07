// ============================================================
// SpaceExplorer 2.0 — Discoveries Page (Fixed Async Integration)
// ============================================================

let discTypeFilters = new Set(['geological','astronomical','biological','chemical','technological']);
let discSearch = '';

// 1. ADDED ASYNC to main initializer
async function initDiscoveries() {
  await updateDiscoveryHero();
  await renderDiscoveries();
  initDiscoveryFilters();
  await startDiscoveryTicker();
}

async function updateDiscoveryHero() {
  const el = document.getElementById('total-discoveries');
  if (!el) return;
  const res = await getDiscoveries();
  const discoveries = Array.isArray(res) ? res : (res.data || []);
  if (typeof animateCounter === 'function') {
    animateCounter(el, discoveries.length, 1200);
  } else {
    el.textContent = discoveries.length;
  }
}

async function startDiscoveryTicker() {
  const ticker = document.getElementById('discovery-ticker');
  if (!ticker) return;
  const res = await getDiscoveries();
  const discoveries = Array.isArray(res) ? res : (res.data || []);
  const items = discoveries.map(d => `✦ ${d.title || 'Unknown'} — ${d.discoveredBy || 'System'} — ${formatDate(d.createdAt || d.date || new Date())}`);
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
  if (searchEl && typeof debounce === 'function') {
    searchEl.addEventListener('input', debounce(() => { discSearch = searchEl.value; renderDiscoveries(); }, 300));
  }
}

const TYPE_ICONS = { geological: '⛰️', astronomical: '🌟', biological: '🧬', chemical: '⚗️', technological: '💡' };
const TYPE_COLORS = { geological: 'rgba(255,107,53,0.15)', astronomical: 'rgba(255,215,0,0.12)', biological: 'rgba(0,255,204,0.12)', chemical: 'rgba(200,150,255,0.12)', technological: 'rgba(0,212,255,0.12)' };

// 2. ADDED ASYNC to Grid Renderer
async function renderDiscoveries() {
  const container = document.getElementById('discoveries-grid');
  if (!container) return;
  
  const res = await getDiscoveries();
  const allDiscoveries = Array.isArray(res) ? res : (res.data || []);

  let items = allDiscoveries.filter(d => {
    const typeMatch = d.type ? discTypeFilters.has(d.type.toLowerCase()) : false;
    const searchMatch = !discSearch || 
      (d.title && d.title.toLowerCase().includes(discSearch.toLowerCase())) || 
      (d.discoveredBy && d.discoveredBy.toLowerCase().includes(discSearch.toLowerCase())) || 
      (d.location && d.location.toLowerCase().includes(discSearch.toLowerCase()));
    return typeMatch && searchMatch;
  });

  if (!items.length) {
    container.innerHTML = '<div class="empty-state"><div class="empty-icon">🔬</div><div class="empty-title">No Discoveries</div><div class="empty-desc">Adjust your filters or log a new discovery.</div></div>';
    return;
  }

  container.innerHTML = items.map((d, i) => {
    const discId = d._id || d.id;
    const sig = typeof d.significance === 'string' ? parseInt(d.significance) : (d.significance || 3);
    const dateStr = formatDate(d.createdAt || d.date || new Date());
    const typeStr = d.type ? d.type.toLowerCase() : 'geological';

    return `
    <div class="discovery-card-wrap animate-in" style="animation-delay:${i*60}ms">
      <div class="card card-brackets" style="padding:var(--space-lg)">
        <div class="discovery-type-icon" style="background:${TYPE_COLORS[typeStr]||'rgba(0,212,255,0.1)'}">${TYPE_ICONS[typeStr]||'🔬'}</div>
        <div class="discovery-title">${d.title || 'Untitled'}</div>
        <div class="discovery-coords">📍 ${d.location || 'Unknown'}${d.lat !== undefined && d.lat !== 0 ? ` · LAT: ${d.lat}° | LON: ${d.lon}°` : ''}</div>
        <div style="font-size:0.72rem;color:var(--text-secondary);margin-bottom:var(--space-sm)">
          By <span style="color:var(--accent-pulse)">${d.discoveredBy || 'Unknown'}</span> · ${dateStr}
        </div>
        ${typeof renderStars === 'function' ? renderStars(sig) : `<div style="color:gold">Rating: ${sig}/5</div>`}
        <div class="discovery-desc" id="desc-${discId}">${d.description || 'No description provided.'}</div>
        <button class="read-more" onclick="toggleDiscDesc('${discId}',this)">Read more</button>
        <div style="display:flex;justify-content:flex-end;margin-top:var(--space-sm);gap:var(--space-xs)">
          <button class="btn btn-ghost btn-sm" onclick="shareDiscovery('${discId}')">📋 SHARE</button>
          <button class="btn btn-danger btn-sm" onclick="deleteDiscoveryAction('${discId}')">×</button>
        </div>
      </div>
    </div>
  `}).join('');
}

function toggleDiscDesc(id, btn) {
  const el = document.getElementById(`desc-${id}`);
  if (!el) return;
  el.classList.toggle('expanded');
  btn.textContent = el.classList.contains('expanded') ? 'Read less' : 'Read more';
}

// 3. ADDED ASYNC to Actions
async function shareDiscovery(id) {
  const res = await getDiscoveries();
  const discoveries = Array.isArray(res) ? res : (res.data || []);
  const d = discoveries.find(x => (x._id || x.id) === id);
  if (!d) return;
  const text = `🔬 DISCOVERY: ${d.title}\n📍 Location: ${d.location}\nBy: ${d.discoveredBy}\nDate: ${formatDate(d.createdAt || d.date || new Date())}\n${(d.description || '').substring(0,200)}...`;
  navigator.clipboard.writeText(text).then(() => {
    if (typeof showToast === 'function') showToast('Discovery summary copied to clipboard!', 'success');
  }).catch(() => {
    if (typeof showToast === 'function') showToast('Copy failed', 'error');
  });
}

async function deleteDiscoveryAction(id) {
  const res = await getDiscoveries();
  const discoveries = Array.isArray(res) ? res : (res.data || []);
  const d = discoveries.find(x => (x._id || x.id) === id);
  
  if (typeof confirmAction === 'function') {
    confirmAction(`Delete discovery <b>${d?.title || id}</b>?`, async () => {
      await deleteDiscovery(id);
      if (typeof showToast === 'function') showToast('Discovery deleted', 'warning');
      updateDiscoveryHero();
      renderDiscoveries();
      startDiscoveryTicker();
    });
  }
}

function openAddDiscovery() {
  let sigVal = 3;
  if (typeof openPanel !== 'function') return;
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
    </form>`, async (fd) => {
      const data = Object.fromEntries(fd);
      data.significance = parseInt(data.significance) || 3;
      try {
        await addDiscovery(data);
        if (typeof closePanel === 'function') closePanel();
        if (typeof showToast === 'function') showToast(`Discovery "${data.title}" logged!`, 'success');
        updateDiscoveryHero();
        renderDiscoveries();
        startDiscoveryTicker();
      } catch(e) {
        console.error(e);
      }
    });
}

function setDiscSig(val) {
  document.querySelectorAll('#sig-stars .star').forEach((s, i) => s.classList.toggle('active', i < val));
  const inp = document.getElementById('sig-input');
  if (inp) inp.value = val;
}