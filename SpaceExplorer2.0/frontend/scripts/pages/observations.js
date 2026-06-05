// // ============================================================
// // SpaceExplorer 2.0 — Observations Page
// // ============================================================
function initObservations() {
  renderObservationCards();
  renderObsStats();
  renderTonightSuggestions();
  
  // Query active Geolocation context vectors safely
  const pageLocInput = document.getElementById('obs-location');
  const skyFrame = document.getElementById('stellarium-viewport');

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude.toFixed(4);
        const lon = pos.coords.longitude.toFixed(4);

        // 1. Update the coordinate input form value
        if (pageLocInput) {
          pageLocInput.value = `LAT: ${lat}° / LON: ${lon}°`;
        }

        // 2. DYNAMIC FIX: Update the Stellarium iframe source to target your location context directly
        if (skyFrame) {
          // Passing coordinates via URL parameters initializes the chart straight to your position mapping grid
        skyFrame.src = `https://virtualsky.lco.global/embed/index.html?longitude=${lon}&latitude=${lat}&projection=stereo&constellations=true&constellationlabels=true&gradient=true`;        }
      },
      () => { 
        if (pageLocInput) pageLocInput.value = "Global Range Vector"; 
      }
    );
  }

  // Initialize standard visual reporting charts safely
  setTimeout(() => {
    if (typeof initObsChart === 'function') initObsChart('obs-chart');
  }, 200);
}

/**
 * Compiles storage records and maps them dynamically to DOM card layouts
 */
function renderObservationCards() {
  const container = document.getElementById('obs-cards') || document.getElementById('obs-feed-container');
  if (!container) return;
  
  const obs = typeof getObservations === 'function' ? getObservations() : [];
  
  // Track total items count label updates if structural container exists
  const counterEl = document.getElementById('obs-counter') || document.getElementById('obs-stat-total');
  if (counterEl && document.getElementById('obs-counter')) {
    counterEl.textContent = `${obs.length} Log${obs.length === 1 ? '' : 's'} Saved`;
  }

  if (!obs.length) {
    if (typeof renderEmptyState === 'function') {
      renderEmptyState(container.id, 'No Observations Yet', 'Start logging your night sky observations!');
    } else {
      container.innerHTML = `
        <div style="text-align: center; padding: 3rem; color: #64748b; border: 1px dashed rgba(255,255,255,0.05); border-radius:8px;">
          <p style="font-size: 1.3rem; margin-bottom: 0.5rem; color: #fff;">🌌 Journal Empty</p>
          <p style="font-size: 0.85rem;">No historical sightings cataloged. Open the entry window to log your first target configuration.</p>
        </div>`;
    }
    return;
  }

  container.innerHTML = obs.map((o, i) => {
    const seeingColor = { excellent: '#00ff88', good: 'var(--accent-primary)', poor: 'var(--accent-warn)' }[o.seeing?.toLowerCase()] || 'var(--text-secondary)';
    
    // Use stored datetime fallback if single date properties are passed
    const rawDate = o.datetime || o.date || new Date().toISOString();
    const displayDate = typeof formatDate === 'function' ? formatDate(rawDate.split('T')[0]) : new Date(rawDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    // Render photo thumbnail attachment securely if URL properties exist
    const photoUrl = o.photoUrl || o.photo || '';
    const imagePreviewTag = photoUrl 
      ? `<div class="card-img-frame" style="width:100%; height:140px; margin-bottom:var(--space-sm); border:1px solid var(--border-subtle); border-radius:4px; background:url('${escapeHtml(photoUrl)}') center/cover no-repeat;"></div>` 
      : '';

    return `
    <div class="card card-brackets obs-card animate-in" style="animation-delay:${i * 50}ms; margin-bottom: var(--space-sm); padding: var(--space-md); background: rgba(20,24,35,0.4); border: 1px solid var(--border-subtle);">
      ${imagePreviewTag}
      <div style="display:flex;align-items:flex-start;gap:var(--space-sm);margin-bottom:var(--space-sm)">
        <div style="font-size:1.6rem">${obsTypeIcon(o.objectType || o.type)}</div>
        <div>
          <div class="obs-object" style="font-weight:bold; font-size:1.1rem; color:#fff;">${escapeHtml(o.object || o.targetName)}</div>
          <div class="obs-equip" style="font-size:0.85rem; color:var(--text-secondary);">🔭 ${escapeHtml(o.equipment || 'Bare Eye / Binoculars')}</div>
        </div>
        <div style="margin-left:auto">${typeof renderStars === 'function' ? renderStars(o.rating || 3) : '★'.repeat(o.rating || 3)}</div>
      </div>
      
      <div style="display:flex;gap:var(--space-sm);margin-bottom:var(--space-sm);flex-wrap:wrap">
        <span class="badge" style="background:${seeingColor}22;color:${seeingColor};border-color:${seeingColor}44; font-size:0.7rem; padding:2px 6px; border-radius:4px;">
          SEEING: ${(o.seeing || 'GOOD').toUpperCase()}
        </span>
        <span class="badge low" style="background:rgba(255,255,255,0.05); color:var(--text-secondary); font-size:0.7rem; padding:2px 6px; border-radius:4px;">BORTLE ${o.bortle || o.bortleScale || 5}</span>
        <span class="badge completed" style="background:rgba(0,212,255,0.1); color:var(--accent-primary); font-size:0.7rem; padding:2px 6px; border-radius:4px;">${(o.objectType || 'OTHER').toUpperCase()}</span>
        ${o.constellation ? `<span class="badge spatial" style="background:rgba(155,89,182,0.1); color:#9b59b6; font-size:0.7rem; padding:2px 6px; border-radius:4px;">🌌 ${escapeHtml(o.constellation)}</span>` : ''}
      </div>
      
      <div class="obs-notes" style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:var(--space-sm); line-height:1.4;">${escapeHtml(o.notes || 'No notes appended.')}</div>
      
      <div class="obs-footer" style="display:flex; justify-content:space-between; align-items:center; border-top:1px dashed var(--border-subtle); padding-top:var(--space-xs); font-size:0.75rem; color:var(--text-dim)">
        <div style="max-width:70%; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">📍 ${escapeHtml(o.location || o.coordinates || 'Global Range')}</div>
        <div class="obs-datetime">${displayDate}</div>
        <button class="btn btn-danger btn-sm" style="background:transparent; border:none; color:var(--accent-warn); cursor:pointer; font-size:1.1rem; padding:0 4px;" onclick="deleteObservationAction(${o.id})">×</button>
      </div>
    </div>`;
  }).join('');
}

function obsTypeIcon(type) {
  return { Planet: '🪐', Star: '⭐', Galaxy: '🌌', Nebula: '🌫️', Comet: '☄️', Satellite: '🛰️', Other: '🔭' }[type] || '🔭';
}

/**
 * Triggers interactive confirmation sequence before clearing specific metrics
 */
function deleteObservationAction(id) {
  const performDelete = () => {
    if (typeof deleteObservation === 'function') {
      deleteObservation(id);
    }
    if (typeof showToast === 'function') showToast('Observation deleted', 'warning');
    renderObservationCards();
    renderObsStats();
    if (typeof obsChartInstance !== 'undefined' && typeof initObsChart === 'function') {
      initObsChart('obs-chart');
    }
  };

  if (typeof confirmAction === 'function') {
    confirmAction('Delete this observation?', performDelete);
  } else if (confirm('Are you sure you want to permanently erase this journal entry?')) {
    performDelete();
  }
}

/**
 * Compiles mathematical metric arrays for data layout summaries
 */
function renderObsStats() {
  const obs = typeof getObservations === 'function' ? getObservations() : [];
  const totalEl = document.getElementById('obs-stat-total');
  if (totalEl) totalEl.textContent = obs.length;
  
  const favEl = document.getElementById('obs-stat-fav');
  if (favEl && obs.length) {
    const counts = {};
    obs.forEach(o => { const type = o.objectType || o.type || 'Other'; counts[type] = (counts[type] || 0) + 1; });
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
    favEl.textContent = top ? top[0] : '—';
  }
  
  const bestEl = document.getElementById('obs-stat-best');
  if (bestEl) {
    const excellent = obs.filter(o => o.seeing?.toLowerCase() === 'excellent').length;
    bestEl.textContent = excellent + ' excellent';
  }
}

/**
 * Prepares and opens the specialized entry modal window injection template
 */
function openAddObservation() {
  let obsRating = 3;
  
  if (typeof openPanel === 'function') {
    openPanel('Log New Observation', `
      <form id="add-obs-form">
        <div class="form-group">
          <label class="form-label">Object Name</label>
          <input class="form-input" name="object" placeholder="e.g., Jupiter, M42, Andromeda" required>
        </div>
        <div class="form-group">
          <label class="form-label">Object Type</label>
          <select class="form-select" name="objectType" required>
            <option value="">Select type</option>
            <option value="Planet">Planet</option>
            <option value="Star">Star</option>
            <option value="Galaxy">Galaxy</option>
            <option value="Nebula">Nebula</option>
            <option value="Comet">Comet</option>
            <option value="Satellite">Satellite</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Target Constellation (Optional)</label>
          <input class="form-input" name="constellation" placeholder="e.g., Orion, Ursa Major">
        </div>
        <div class="form-group">
          <label class="form-label">Date & Time</label>
          <input class="form-input" type="datetime-local" name="datetime" id="form-datetime-val" required>
        </div>
        <div class="form-group">
          <label class="form-label">Observation Location / Coordinates</label>
          <input class="form-input" name="location" id="form-location-val" placeholder="Detecting position coordinates..." required>
        </div>
        <div class="form-group">
          <label class="form-label">Equipment Apparatus Used</label>
          <input class="form-input" name="equipment" placeholder="e.g., Celestron 8-inch SCT, Bare Eye">
        </div>
        <div class="form-group">
          <label class="form-label">Astrophotography Image Vector Link (Optional)</label>
          <input class="form-input" type="url" name="photoUrl" placeholder="https://images.example.com/nebula.jpg">
        </div>
        <div class="form-group">
          <label class="form-label">Seeing Conditions</label>
          <div class="toggle-group">
            <button type="button" class="toggle-btn" id="see-poor" onclick="setSeeingFilter('poor')">Poor</button>
            <button type="button" class="toggle-btn active" id="see-good" onclick="setSeeingFilter('good')">Good</button>
            <button type="button" class="toggle-btn" id="see-excellent" onclick="setSeeingFilter('excellent')">Excellent</button>
          </div>
          <input type="hidden" name="seeing" id="seeing-val" value="good">
        </div>
        <div class="form-group">
          <label class="form-label">Sky Darkness (Bortle Scale 1–9)</label>
          <input class="form-range" type="range" name="bortle" min="1" max="9" value="5" id="bortle-range">
          <div style="font-family:var(--font-mono);font-size:0.75rem;color:var(--accent-primary);text-align:right" id="bortle-val">5</div>
        </div>
        <div class="form-group">
          <label class="form-label">Field Notes</label>
          <textarea class="form-textarea" name="notes" placeholder="What did you observe? Track visual clarity, dust lanes, or alignment angles..." style="min-height:90px"></textarea>
        </div>
        <div class="form-group">
          <label class="form-label">Sighting Rating</label>
          <div class="star-rating" id="obs-stars">
            ${[1, 2, 3, 4, 5].map(n => `<span class="star ${n <= obsRating ? 'active' : ''}" data-val="${n}" onclick="setObsRating(${n})">★</span>`).join('')}
          </div>
          <input type="hidden" name="rating" id="rating-input" value="${obsRating}">
        </div>
        <button type="submit" class="btn btn-primary btn-full">🔭 LOG ENTRY TRANSMISSION</button>
      </form>`, (fd) => {
      const data = Object.fromEntries(fd);
      data.id = Date.now();
      data.bortle = parseInt(data.bortle) || 5;
      data.rating = parseInt(data.rating) || 3;
      
      if (typeof addObservation === 'function') {
        addObservation(data);
      }
      if (typeof closePanel === 'function') closePanel();
      if (typeof showToast === 'function') showToast(`Observation of ${data.object} logged!`, 'success');
      
      renderObservationCards();
      renderObsStats();
    });

    // Handle secondary runtime updates (Sliders, HTML5 Geolocation tracking metrics, Timestamps)
    setTimeout(() => {
      const range = document.getElementById('bortle-range');
      const val = document.getElementById('bortle-val');
      if (range && val) range.addEventListener('input', () => { val.textContent = range.value; });

      // Automatically format default local dynamic time input structure
      const timeInp = document.getElementById('form-datetime-val');
      if (timeInp) {
        const localTime = new Date();
        localTime.setMinutes(localTime.getMinutes() - localTime.getTimezoneOffset());
        timeInp.value = localTime.toISOString().slice(0, 16);
      }

      // Query active Geolocation context vectors safely
      const locInp = document.getElementById('form-location-val');
      if (locInp && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            locInp.value = `LAT: ${pos.coords.latitude.toFixed(4)}° / LON: ${pos.coords.longitude.toFixed(4)}°`;
          },
          () => { locInp.value = "Global Range Vector"; }
        );
      }
    }, 100);
  }
}

function setSeeingFilter(val) {
  document.querySelectorAll('.toggle-btn[id^="see-"]').forEach(b => b.classList.remove('active'));
  document.getElementById(`see-${val}`)?.classList.add('active');
  const inp = document.getElementById('seeing-val');
  if (inp) inp.value = val;
}

function setObsRating(val) {
  document.querySelectorAll('#obs-stars .star').forEach((s, i) => s.classList.toggle('active', i < val));
  const inp = document.getElementById('rating-input');
  if (inp) inp.value = val;
}

/**
 * Builds standard local recommendations panel matrix elements
 */
function renderTonightSuggestions() {
  const listEl = document.getElementById('tonights-targets-list');
  if (!listEl) return;

  const suggestions = [
    { name: 'M42 Orion Nebula', type: 'Nebula', mag: '4.0', visibility: 'Excellent' },
    { name: 'Jupiter', type: 'Planet', mag: '-2.5', visibility: 'High Alt' },
    { name: 'Andromeda Galaxy (M31)', type: 'Galaxy', mag: '3.4', visibility: 'Faint' },
    { name: 'Pleiades Cluster (M45)', type: 'Star Cluster', mag: '1.6', visibility: 'Excellent' }
  ];

  listEl.innerHTML = suggestions.map(item => `
    <li class="suggestion-item" style="display:flex; justify-content:space-between; padding:var(--space-xs) 0; border-bottom:1px solid rgba(255,255,255,0.03); font-size:0.85rem;">
      <div>
        <h5 style="margin:0; color:#fff; font-weight:600;">${escapeHtml(item.name)}</h5>
        <span style="font-size:0.7rem; color:var(--text-dim); font-family:var(--font-mono);">${escapeHtml(item.type)}</span>
      </div>
      <div style="text-align:right; font-family:var(--font-mono); font-size:0.75rem;">
        <div style="color:var(--accent-primary);">Mag ${escapeHtml(item.mag)}</div>
        <div style="color:var(--text-dim); font-size:0.65rem;">${escapeHtml(item.visibility)}</div>
      </div>
    </li>
  `).join('');
}

/**
 * Escapes characters safely against unexpected context structural breaks
 */
function escapeHtml(str) {
  if (!str) return '';
  return str.toString()
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
}

// Map alternative router hook structures cleanly into core initialization modules
function initObservationsPage() {
  initObservations();
}

/**
 * Processes submissions directly from the inline form view array
 */
function handleSaveObservation(event) {
  event.preventDefault(); // Stop page from hard refreshing

  // Extract values directly from DOM Element IDs
  const target = document.getElementById('obs-target')?.value;
  const equipment = document.getElementById('obs-equipment')?.value || 'Bare Eye / Binoculars';
  const location = document.getElementById('obs-location')?.value || 'Global Range Vector';
  const weather = document.getElementById('obs-weather')?.value || 'Clear Sky';
  const photo = document.getElementById('obs-photo')?.value || '';
  const notes = document.getElementById('obs-notes')?.value || 'No notes appended.';

  // Build clean structural object payload
  const newRecord = {
    id: Date.now(),
    object: target,
    objectType: 'Other', // Fallback type classification
    equipment: equipment,
    location: location,
    notes: `[Atmosphere: ${weather}] ${notes}`,
    photoUrl: photo,
    seeing: 'good', // Balanced metric baseline
    bortle: 5,
    rating: 4,
    datetime: new Date().toISOString()
  };

  // Persist transaction to your storage arrays safely
  if (typeof addObservation === 'function') {
    addObservation(newRecord);
  } else {
    // Local storage manual fallback save if data.js engine isn't mapped
    const currentLogs = JSON.parse(localStorage.getItem('spaceexplorer_observations') || '[]');
    currentLogs.unshift(newRecord);
    localStorage.setItem('spaceexplorer_observations', JSON.stringify(currentLogs));
  }

  // Visual success confirmation alerts
  if (typeof showToast === 'function') {
    showToast(`Observation of ${target} logged!`, 'success');
  } else {
    alert(`Observation of ${target} successfully committed to system logs.`);
  }

  // Clear inputs safely
  document.getElementById('obs-log-form').reset();
  
  // Re-request telemetry to reset positioning coordinates for next entry
  const locationInput = document.getElementById('obs-location');
  if (locationInput && navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((pos) => {
      locationInput.value = `LAT: ${pos.coords.latitude.toFixed(4)}° / LON: ${pos.coords.longitude.toFixed(4)}°`;
    });
  }

  // Update visual matrix frames instantly
  renderObservationCards();
  renderObsStats();
}
