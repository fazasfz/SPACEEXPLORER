// ============================================================
// SpaceExplorer 2.0 — Missions Page (Fixed API Integration)
// ============================================================

let missionsFilter = 'all';

function initMissions() {
  renderMissionsGrid();
  initMissionsFilterTabs();
}

function initMissionsFilterTabs() {
  document.querySelectorAll('#page-missions .filter-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('#page-missions .filter-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      missionsFilter = tab.dataset.filter;
      renderMissionsGrid();
    });
  });
}

// 1. ADDED ASYNC: Ab data pehle fetch hoga phir render hoga
async function renderMissionsGrid() {
  const container = document.getElementById('missions-grid');
  if (!container) return;

  try {
    // API se data anay ka wait karo
    const missionsResponse = await getMissions();
    const astronautsResponse = await getAstronauts();

    // Data ko securely array mein transform karo
    let missions = Array.isArray(missionsResponse) ? missionsResponse : (missionsResponse.data || []);
    let astronauts = Array.isArray(astronautsResponse) ? astronautsResponse : (astronautsResponse.data || []);

    if (missionsFilter !== 'all') {
      missions = missions.filter(m => m.status === missionsFilter);
    }

    if (!missions.length) {
      container.innerHTML = '<div class="empty-state" style="grid-column: 1/-1; text-align: center; padding: 40px;">No missions match the selected filter. Create a new one!</div>';
      return;
    }

    container.innerHTML = missions.map((m, i) => {
      // MongoDB fields handling
      const missionName = m.name || m.mission || "Unnamed Mission";
      const missionId = m._id || m.id; 
      const status = m.status || 'planning';

      const hue1 = Math.abs(missionName.charCodeAt(0) * 7) % 360;
      const hue2 = Math.abs((missionName.charCodeAt(1) || 45) * 13) % 360;
      
      // Crew data check
      const crew = astronauts.filter(a => a.missionId === missionId);
      const avatars = crew.slice(0, 3).map(a => `<span class="crew-avatar" style="background:${hashColor(a.name)}">${getInitials(a.name)}</span>`).join('');
      const extra = crew.length > 3 ? `<span class="crew-avatar crew-avatar-more">+${crew.length-3}</span>` : '';

      // Date fallback
      const formattedDate = (typeof formatDate === 'function' && m.launchDate) ? formatDate(m.launchDate) : (m.launchDate ? new Date(m.launchDate).toLocaleDateString() : 'TBD');

      return `
      <div class="mission-card-wrap animate-in" style="animation-delay:${i * 60}ms">
        <div class="mission-card-hdr" style="background:linear-gradient(135deg,hsl(${hue1},60%,12%),hsl(${hue2},70%,18%))">
          <span class="mission-card-hdr-title">${missionName}</span>
        </div>
        <div class="mission-card-bdy">
          <div class="mission-meta">
            <span class="badge ${status}"><span class="status-dot ${status}"></span>${status.toUpperCase()}</span>
            <span class="badge ${m.priority || 'medium'}">${(m.priority || 'medium').toUpperCase()}</span>
          </div>
          <div class="mission-destination" style="margin-bottom:8px">📍 ${m.destination || 'Deep Space'} · 📅 ${formattedDate}</div>
          <div style="font-size:0.72rem;color:var(--text-dim);margin-bottom:8px">⏱ ${m.duration || 'N/A'}</div>
          <div class="progress-bar-wrap"><div class="progress-bar-fill" style="width:${m.progress || 0}%"></div></div>
          <div style="font-family:var(--font-mono);font-size:0.68rem;color:var(--accent-primary);margin-bottom:8px">${m.progress || 0}%</div>
          <div class="crew-stack">${avatars}${extra}
            <span style="font-size:0.7rem;color:var(--text-dim);margin-left:8px;align-self:center">${crew.length || m.crewSize || 0} crew</span>
          </div>
          <div class="mission-actions">
            <button class="btn btn-secondary btn-sm" onclick="openMissionDetail('${missionId}')">DETAILS</button>
            <button class="btn btn-ghost btn-sm" onclick="openEditMission('${missionId}')">EDIT</button>
            <button class="btn btn-danger btn-sm" onclick="deleteMissionAction('${missionId}')" style="margin-left:auto">DELETE</button>
          </div>
        </div>
      </div>`;
    }).join('');
  } catch (error) {
    console.error("Error rendering missions:", error);
  }
}

function openAddMission() {
  const formHTML = `
    <form id="add-mission-form">
      <div class="form-group">
        <label class="form-label">Mission Name</label>
        <input class="form-input" name="name" placeholder="e.g., Artemis X" required>
      </div>
      <div class="form-group">
        <label class="form-label">Destination</label>
        <input class="form-input" name="destination" placeholder="Mars, Europa, Titan..." list="dest-list" required>
        <datalist id="dest-list">
          <option value="Mars"><option value="Europa"><option value="Titan"><option value="Moon">
          <option value="Asteroid Belt"><option value="Deep Space"><option value="Jupiter"><option value="Solar Corona">
        </datalist>
      </div>
      <div class="form-group">
        <label class="form-label">Objective</label>
        <textarea class="form-textarea" name="objective" placeholder="Mission primary objectives..." required maxlength="400"></textarea>
        <div class="form-counter" id="obj-counter">0 / 400</div>
      </div>
      <div class="form-group">
        <label class="form-label">Launch Date</label>
        <input class="form-input" type="date" name="launchDate" required>
      </div>
      <div class="form-group">
        <label class="form-label">Duration</label>
        <input class="form-input" name="duration" placeholder="e.g., 8 months" required>
      </div>
      <div class="form-group">
        <label class="form-label">Priority</label>
        <select class="form-select" name="priority" required>
          <option value="">Select priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Crew Size</label>
        <div class="form-stepper">
          <button type="button" class="stepper-btn" onclick="stepChange('crew-size-input',-1)">−</button>
          <input class="stepper-input" id="crew-size-input" name="crewSize" type="number" value="4" min="1" max="20">
          <button type="button" class="stepper-btn" onclick="stepChange('crew-size-input',1)">+</button>
        </div>
      </div>
      <button type="submit" class="btn btn-primary btn-full">🚀 CREATE MISSION</button>
    </form>`;

  // Async create form submission
  openPanel('New Mission Brief', formHTML, async (formData) => {
    const data = Object.fromEntries(formData);
    data.crewSize = parseInt(data.crewSize) || 4;
    try {
      await addMission(data);
      closePanel();
      if (typeof showToast === 'function') showToast(`Mission "${data.name}" created!`, 'success');
      renderMissionsGrid();
      if (typeof initDashboard === 'function') initDashboard();
    } catch (e) {
      console.error(e);
      if (typeof showToast === 'function') showToast("Failed to create mission", "error");
    }
  });

  setTimeout(() => {
    const ta = document.querySelector('#add-mission-form [name="objective"]');
    const counter = document.getElementById('obj-counter');
    if (ta && counter) ta.addEventListener('input', () => { counter.textContent = `${ta.value.length} / 400`; });
  }, 100);
}

// 2. ADDED ASYNC to Edit function
async function openEditMission(id) {
  try {
    const mData = await getMission(id);
    if (!mData) return;
    const m = mData.data || mData;

    const formHTML = `
      <form id="edit-mission-form">
        <div class="form-group">
          <label class="form-label">Status</label>
          <select class="form-select" name="status">
            <option value="planning" ${m.status==='planning'?'selected':''}>Planning</option>
            <option value="active" ${m.status==='active'?'selected':''}>Active</option>
            <option value="completed" ${m.status==='completed'?'selected':''}>Completed</option>
            <option value="failed" ${m.status==='failed'?'selected':''}>Failed</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Progress (%)</label>
          <input class="form-input form-range" type="range" name="progress" min="0" max="100" value="${m.progress || 0}">
          <div style="font-family:var(--font-mono);font-size:0.75rem;color:var(--accent-primary);text-align:right" id="prog-val">${m.progress || 0}%</div>
        </div>
        <div class="form-group">
          <label class="form-label">Priority</label>
          <select class="form-select" name="priority">
            <option value="low" ${m.priority==='low'?'selected':''}>Low</option>
            <option value="medium" ${m.priority==='medium'?'selected':''}>Medium</option>
            <option value="high" ${m.priority==='high'?'selected':''}>High</option>
            <option value="critical" ${m.priority==='critical'?'selected':''}>Critical</option>
          </select>
        </div>
        <button type="submit" class="btn btn-primary btn-full">💾 SAVE CHANGES</button>
      </form>`;

    openPanel(`Edit — ${m.name || 'Mission'}`, formHTML, async (formData) => {
      const data = Object.fromEntries(formData);
      data.progress = parseInt(data.progress);
      await updateMission(id, data);
      closePanel();
      if (typeof showToast === 'function') showToast(`Mission updated`, 'info');
      renderMissionsGrid();
      if (typeof initDashboard === 'function') initDashboard();
    });

    setTimeout(() => {
      const range = document.querySelector('#edit-mission-form [name="progress"]');
      const val = document.getElementById('prog-val');
      if (range && val) range.addEventListener('input', () => { val.textContent = range.value + '%'; });
    }, 100);
  } catch (error) {
    console.error("Edit form load error:", error);
  }
}

// 3. ADDED ASYNC to Delete Action
async function deleteMissionAction(id) {
  try {
    const mData = await getMission(id);
    if (!mData) return;
    const m = mData.data || mData;

    confirmAction(`Are you sure you want to delete mission <b>${m.name || 'this mission'}</b>? This action cannot be undone.`, async () => {
      await deleteMission(id);
      if (typeof showToast === 'function') showToast(`Mission deleted`, 'warning');
      renderMissionsGrid();
      if (typeof initDashboard === 'function') initDashboard();
    });
  } catch (error) {
    console.error("Delete action error:", error);
  }
}

function stepChange(inputId, delta) {
  const el = document.getElementById(inputId);
  if (!el) return;
  el.value = Math.max(parseInt(el.min||1), Math.min(parseInt(el.max||999), parseInt(el.value||0) + delta));
}