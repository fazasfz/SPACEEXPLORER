// ============================================================
// SpaceExplorer 2.0 — Observations Page
// ============================================================

function initObservations() {
  renderObservationCards();
  renderObsStats();
  setTimeout(() => initObsChart('obs-chart'), 200);
}

function renderObservationCards() {
  const container = document.getElementById('obs-cards');
  if (!container) return;
  const obs = getObservations();
  if (!obs.length) {
    renderEmptyState('obs-cards', 'No Observations Yet', 'Start logging your night sky observations!');
    return;
  }
  container.innerHTML = obs.map((o, i) => {
    const seeingColor = { excellent:'#00ff88', good:'var(--accent-primary)', poor:'var(--accent-warn)' }[o.seeing] || 'var(--text-secondary)';
    return `
    <div class="card card-brackets obs-card animate-in" style="animation-delay:${i*50}ms">
      <div style="display:flex;align-items:flex-start;gap:var(--space-sm);margin-bottom:var(--space-sm)">
        <div style="font-size:1.6rem">${obsTypeIcon(o.objectType)}</div>
        <div>
          <div class="obs-object">${o.object}</div>
          <div class="obs-equip">🔭 ${o.equipment}</div>
        </div>
        <div style="margin-left:auto">${renderStars(o.rating||3)}</div>
      </div>
      <div style="display:flex;gap:var(--space-sm);margin-bottom:var(--space-sm);flex-wrap:wrap">
        <span class="badge" style="background:${seeingColor}22;color:${seeingColor};border-color:${seeingColor}44">
          SEEING: ${o.seeing.toUpperCase()}
        </span>
        <span class="badge low">BORTLE ${o.bortle}</span>
        <span class="badge completed">${o.objectType.toUpperCase()}</span>
      </div>
      <div class="obs-notes">${o.notes}</div>
      <div class="obs-footer">
        <div style="font-size:0.7rem;color:var(--text-secondary)">📍 ${o.location}</div>
        <div class="obs-datetime">${formatDate(o.datetime?.split('T')[0] || o.date)}</div>
        <button class="btn btn-danger btn-sm" onclick="deleteObservationAction(${o.id})">×</button>
      </div>
    </div>`;
  }).join('');
}

function obsTypeIcon(type) {
  return { Planet:'🪐', Star:'⭐', Galaxy:'🌌', Nebula:'🌫️', Comet:'☄️', Satellite:'🛰️', Other:'🔭' }[type] || '🔭';
}

function deleteObservationAction(id) {
  confirmAction('Delete this observation?', () => {
    deleteObservation(id);
    showToast('Observation deleted', 'warning');
    renderObservationCards();
    renderObsStats();
    if (obsChartInstance) initObsChart('obs-chart');
  });
}

function renderObsStats() {
  const obs = getObservations();
  const totalEl = document.getElementById('obs-stat-total');
  if (totalEl) totalEl.textContent = obs.length;
  const favEl = document.getElementById('obs-stat-fav');
  if (favEl && obs.length) {
    const counts = {};
    obs.forEach(o => counts[o.objectType] = (counts[o.objectType]||0) + 1);
    const top = Object.entries(counts).sort((a,b)=>b[1]-a[1])[0];
    favEl.textContent = top ? top[0] : '—';
  }
  const bestEl = document.getElementById('obs-stat-best');
  if (bestEl) {
    const excellent = obs.filter(o => o.seeing === 'excellent').length;
    bestEl.textContent = excellent + ' excellent';
  }
}

function openAddObservation() {
  let obsRating = 3;
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
        <label class="form-label">Date & Time</label>
        <input class="form-input" type="datetime-local" name="datetime" required>
      </div>
      <div class="form-group">
        <label class="form-label">Location</label>
        <input class="form-input" name="location" placeholder="e.g., Lahore, Pakistan" required>
      </div>
      <div class="form-group">
        <label class="form-label">Equipment Used</label>
        <input class="form-input" name="equipment" placeholder="e.g., Celestron 8-inch SCT">
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
        <label class="form-label">Notes</label>
        <textarea class="form-textarea" name="notes" placeholder="What did you observe? Any notable details..." style="min-height:100px"></textarea>
      </div>
      <div class="form-group">
        <label class="form-label">Rating</label>
        <div class="star-rating" id="obs-stars">
          ${[1,2,3,4,5].map(n=>`<span class="star ${n<=obsRating?'active':''}" data-val="${n}" onclick="setObsRating(${n})">★</span>`).join('')}
        </div>
        <input type="hidden" name="rating" id="rating-input" value="${obsRating}">
      </div>
      <button type="submit" class="btn btn-primary btn-full">🔭 LOG OBSERVATION</button>
    </form>`, (fd) => {
      const data = Object.fromEntries(fd);
      data.bortle = parseInt(data.bortle);
      data.rating = parseInt(data.rating);
      addObservation(data);
      closePanel();
      showToast(`Observation of ${data.object} logged!`, 'success');
      renderObservationCards();
      renderObsStats();
    });

  setTimeout(() => {
    const range = document.getElementById('bortle-range');
    const val = document.getElementById('bortle-val');
    if (range && val) range.addEventListener('input', () => { val.textContent = range.value; });
  }, 100);
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
