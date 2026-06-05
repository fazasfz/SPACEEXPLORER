// ============================================================
// SpaceExplorer 2.0 — Crew Page
// ============================================================

let crewView = 'grid';
let crewSearch = '';
let crewRankFilter = '';
let crewPage = 1;
const CREW_PER_PAGE = 10;

function initCrew() {
  renderCrewToolbar();
  renderCrewGrid();
}

function renderCrewToolbar() {
  const searchEl = document.getElementById('crew-search-input');
  const rankEl   = document.getElementById('crew-rank-filter');
  const gridBtn  = document.getElementById('crew-view-grid');
  const tableBtn = document.getElementById('crew-view-table');

  if (searchEl) searchEl.addEventListener('input', debounce(() => { crewSearch = searchEl.value; crewPage = 1; renderCrewGrid(); }, 300));
  if (rankEl)   rankEl.addEventListener('change', () => { crewRankFilter = rankEl.value; crewPage = 1; renderCrewGrid(); });
  if (gridBtn)  gridBtn.addEventListener('click', () => { crewView = 'grid'; gridBtn.classList.add('active'); tableBtn.classList.remove('active'); renderCrewGrid(); });
  if (tableBtn) tableBtn.addEventListener('click', () => { crewView = 'table'; tableBtn.classList.add('active'); gridBtn.classList.remove('active'); renderCrewGrid(); });
}

function getFilteredCrew() {
  return getAstronauts().filter(a => {
    const matchSearch = !crewSearch || a.name.toLowerCase().includes(crewSearch.toLowerCase()) || a.specialty.includes(crewSearch.toLowerCase());
    const matchRank   = !crewRankFilter || a.rank === crewRankFilter;
    return matchSearch && matchRank;
  });
}

function renderCrewGrid() {
  const container = document.getElementById('crew-container');
  if (!container) return;
  const crew = getFilteredCrew();

  if (!crew.length) {
    renderEmptyState('crew-container', 'No Crew Found', 'No astronauts match your filters. Try a different search or add new crew.');
    return;
  }

  if (crewView === 'grid') {
    container.innerHTML = `<div class="crew-grid">${crew.map((a, i) => renderAstronautCard(a, i)).join('')}</div>`;
  } else {
    renderCrewTable(container, crew);
  }
}

function renderAstronautCard(a, i) {
  const mission = a.missionId ? getMission(a.missionId) : null;
  return `
  <div class="card card-brackets astronaut-card animate-in" style="animation-delay:${i*50}ms;padding:0">
    <div class="card-avatar-area" style="background:${hashColorPair(a.name).replace('linear-gradient', 'linear-gradient')}40">
      <div class="astronaut-avatar" style="background:${hashColorPair(a.name)}">${getInitials(a.name)}</div>
      <span class="badge ${a.rank}">${a.rank.toUpperCase()}</span>
    </div>
    <div style="padding:var(--space-md)">
      <div class="astronaut-name">${a.name}</div>
      <div class="astronaut-specialty">${a.specialty.toUpperCase()} · ${a.experience} YRS</div>
      <div class="astronaut-mission">${mission ? '🚀 ' + mission.name : '✅ AVAILABLE'}</div>
      <div style="margin-top:var(--space-md)">
        <div class="skill-bar-label"><span class="skill-bar-name">Leadership</span><span class="skill-bar-value">${a.leadership}%</span></div>
        <div class="skill-bar-track"><div class="skill-bar-fill" style="width:${a.leadership}%"></div></div>
        <div class="skill-bar-label"><span class="skill-bar-name">Technical</span><span class="skill-bar-value">${a.technical}%</span></div>
        <div class="skill-bar-track"><div class="skill-bar-fill" style="width:${a.technical}%"></div></div>
        <div class="skill-bar-label"><span class="skill-bar-name">Physical</span><span class="skill-bar-value">${a.physical}%</span></div>
        <div class="skill-bar-track"><div class="skill-bar-fill" style="width:${a.physical}%"></div></div>
      </div>
      <div style="display:flex;gap:var(--space-xs);margin-top:var(--space-md)">
        <button class="btn btn-secondary btn-sm" onclick="viewAstronautProfile(${a.id})">PROFILE</button>
        <button class="btn btn-ghost btn-sm" onclick="assignAstronaut(${a.id})">ASSIGN</button>
        <button class="btn btn-danger btn-sm" onclick="deleteAstronautAction(${a.id})" style="margin-left:auto">×</button>
      </div>
    </div>
  </div>`;
}

function renderCrewTable(container, crew) {
  const start = (crewPage - 1) * CREW_PER_PAGE;
  const page  = crew.slice(start, start + CREW_PER_PAGE);
  const total = crew.length;
  const pages = Math.ceil(total / CREW_PER_PAGE);

  container.innerHTML = `
  <div class="data-table-wrap">
    <table class="data-table" id="crew-table">
      <thead>
        <tr>
          <th data-sort="name">Name <span class="sort-icon">↕</span></th>
          <th data-sort="rank">Rank <span class="sort-icon">↕</span></th>
          <th data-sort="specialty">Specialty <span class="sort-icon">↕</span></th>
          <th data-sort="experience">Experience <span class="sort-icon">↕</span></th>
          <th>Mission</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${page.map(a => {
          const mission = a.missionId ? getMission(a.missionId) : null;
          return `<tr>
            <td><div style="display:flex;align-items:center;gap:8px">
              <div style="width:32px;height:32px;border-radius:50%;background:${hashColorPair(a.name)};display:flex;align-items:center;justify-content:center;font-family:var(--font-heading);font-size:0.65rem;font-weight:700;color:white;flex-shrink:0">${getInitials(a.name)}</div>
              ${a.name}
            </div></td>
            <td><span class="badge ${a.rank}">${a.rank.toUpperCase()}</span></td>
            <td>${a.specialty}</td>
            <td class="mono">${a.experience} yrs</td>
            <td>${mission ? mission.name : '<span style="color:var(--accent-pulse)">Available</span>'}</td>
            <td><span class="badge ${a.status}"><span class="status-dot ${a.status}"></span>${a.status.replace('-',' ').toUpperCase()}</span></td>
            <td><div style="display:flex;gap:4px">
              <button class="btn btn-ghost btn-sm" onclick="viewAstronautProfile(${a.id})">VIEW</button>
              <button class="btn btn-danger btn-sm" onclick="deleteAstronautAction(${a.id})">×</button>
            </div></td>
          </tr>`;
        }).join('')}
      </tbody>
    </table>
    <div class="table-pagination">
      <span class="pagination-info">Showing ${start+1}–${Math.min(start+CREW_PER_PAGE,total)} of ${total}</span>
      <div class="pagination-btns">
        <button class="page-btn" ${crewPage<=1?'disabled':''} onclick="crewPage--;renderCrewGrid()">‹</button>
        ${Array.from({length:pages},(_,j)=>`<button class="page-btn${crewPage===j+1?' active':''}" onclick="crewPage=${j+1};renderCrewGrid()">${j+1}</button>`).join('')}
        <button class="page-btn" ${crewPage>=pages?'disabled':''} onclick="crewPage++;renderCrewGrid()">›</button>
      </div>
    </div>
  </div>`;
  makeSortable('crew-table', crew, sorted => { crew.length = 0; crew.push(...sorted); renderCrewTable(container, crew); });
}

function viewAstronautProfile(id) {
  const a = getAstronaut(id);
  if (!a) return;
  const mission = a.missionId ? getMission(a.missionId) : null;
  openModal(`${a.name} — Personnel File`, `
    <div style="display:flex;gap:var(--space-lg);align-items:flex-start;flex-wrap:wrap">
      <div style="display:flex;flex-direction:column;align-items:center;gap:8px">
        <div style="width:80px;height:80px;border-radius:50%;background:${hashColorPair(a.name)};display:flex;align-items:center;justify-content:center;font-family:var(--font-heading);font-size:1.5rem;font-weight:700;color:white;">${getInitials(a.name)}</div>
        <span class="badge ${a.rank}">${a.rank.toUpperCase()}</span>
        <span class="badge ${a.status}">${a.status.replace('-',' ').toUpperCase()}</span>
      </div>
      <div style="flex:1;min-width:200px">
        <div class="form-label" style="margin-bottom:4px">Specialty</div>
        <div style="margin-bottom:12px">${a.specialty}</div>
        <div class="form-label" style="margin-bottom:4px">Experience</div>
        <div style="font-family:var(--font-mono);color:var(--accent-primary);margin-bottom:12px">${a.experience} years</div>
        <div class="form-label" style="margin-bottom:4px">Nationality</div>
        <div style="margin-bottom:12px">${a.nationality || 'N/A'}</div>
        <div class="form-label" style="margin-bottom:4px">Current Mission</div>
        <div style="color:${mission?'var(--accent-pulse)':'#00ff88'}">${mission ? mission.name : '✅ Available for Assignment'}</div>
        ${a.bio ? `<div style="margin-top:16px;font-size:0.8rem;color:var(--text-secondary);line-height:1.6">${a.bio}</div>` : ''}
      </div>
    </div>
  `, [{ id:'close', label:'Close', class:'btn btn-ghost', handler: closeModal }]);
}

function assignAstronaut(id) {
  const a = getAstronaut(id);
  if (!a) return;
  const missions = getMissions().filter(m => m.status === 'active' || m.status === 'planning');
  const opts = `<option value="">Unassigned</option>` + missions.map(m => `<option value="${m.id}" ${a.missionId===m.id?'selected':''}>${m.name}</option>`).join('');
  openModal(`Assign ${a.name.split(' ').pop()}`, `
    <div class="form-group">
      <label class="form-label">Assign to Mission</label>
      <select class="form-select" id="assign-mission-select">${opts}</select>
    </div>`,
    [{ id:'cancel', label:'Cancel', class:'btn btn-ghost', handler:closeModal },
     { id:'save', label:'Save Assignment', class:'btn btn-primary', handler:() => {
       const sel = document.getElementById('assign-mission-select');
       const mId = sel.value ? parseInt(sel.value) : null;
       const idx = ASTRONAUTS.findIndex(x => x.id === id);
       if (idx !== -1) {
         ASTRONAUTS[idx].missionId = mId;
         ASTRONAUTS[idx].status = mId ? 'deployed' : 'standby';
         saveData('se_astronauts', ASTRONAUTS);
       }
       closeModal();
       showToast(`Assignment updated for ${a.name.split(' ').pop()}`, 'success');
       renderCrewGrid();
     }}]);
}
// ============================================================
// SpaceExplorer 2.0 — Sci-Fi Worldbuilder Database Connection
// ============================================================
const UNIVERSE_API = 'http://localhost:5000/api/universe';

function openAddAstronaut() {
  openPanel('Register Universe Character / Crew', `
    <form id="add-astronaut-form">
      <div class="form-group">
        <label class="form-label">Character / Crew Name</label>
        <input class="form-input" name="name" placeholder="Dr. Jane Smith or Alien Unit-01" required>
      </div>
      <div class="form-group">
        <label class="form-label">Rank / Classification</label>
        <select class="form-select" name="rank" required>
          <option value="">Select hierarchy</option>
          <option value="trainee">Trainee / Cadet</option>
          <option value="pilot">Pilot / Navigator</option>
          <option value="specialist">Specialist / Scientist</option>
          <option value="captain">Captain / Bounty Hunter</option>
          <option value="commander">Fleet Commander</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Fictional Universe Workspace Name</label>
        <input class="form-input" id="universe-workspace-name" name="universeName" placeholder="e.g., Milky Way Opera, Kepler Conflict" required>
      </div>
      <div class="form-group">
        <label class="form-label">Species / Group Specialty</label>
        <select class="form-select" name="specialty" required>
          <option value="">Select specialty</option>
          <option value="navigation">Navigation / Hyperdrive</option>
          <option value="engineering">Quantum Engineering</option>
          <option value="science">Exo-Science / Lore</option>
          <option value="medical">Bio-Medical</option>
          <option value="geology">Asteroid Mining</option>
          <option value="communications">Deep-Space Comms</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Experience Cycle (Years Active)</label>
        <div class="form-stepper">
          <button type="button" class="stepper-btn" onclick="stepChange('exp-input',-1)">−</button>
          <input class="stepper-input" id="exp-input" name="experience" type="number" value="1" min="0" max="50">
          <button type="button" class="stepper-btn" onclick="stepChange('exp-input',1)">+</button>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Home Sector / Origin Galaxy</label>
        <input class="form-input" name="nationality" placeholder="e.g., Orion Arm, Sector-7G">
      </div>
      <div class="form-group">
        <label class="form-label">Fictional Character Lore / Biography</label>
        <textarea class="form-textarea" name="bio" placeholder="Describe their sci-fi backstory, neural implants, or motivations..."></textarea>
      </div>
      <button type="submit" class="btn btn-primary btn-full">🌌 COMMIT TO WORLD ARCHIVE</button>
    </form>`, async (fd) => {
      // 1. Convert form elements into standard object properties
      const formData = Object.fromEntries(fd);
      
      // 2. Browser Storage se dynamic dynamic active session profile handle karein
      const loggedInUser = JSON.parse(localStorage.getItem('user'));
      if (!loggedInUser || !loggedInUser.id) {
         showToast('Error: Please log in to connect to the sci-fi workspace pipeline.', 'error');
         return;
      }

      // 3. Form fields se mapping data extract karein aur payload banayein
      const universePayload = {
         userId: loggedInUser.id,
         name: formData.universeName,
         description: `Universe sector tracking character profile for origin location: ${formData.nationality || 'Unknown Zone'}. Notes: ${formData.bio || 'None'}`,
         genre: 'Sci-Fi Worldbuild',
         crew: [{
            name: formData.name,
            role: formData.rank + ' of ' + formData.specialty,
            species: formData.nationality || 'Alien Unknown'
         }]
      };

      try {
         // 4. Live network streaming payload pipeline via database connection hit karein
         const response = await fetch(`${UNIVERSE_API}/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(universePayload)
         });

         const data = await response.json();

         if (!response.ok) {
            throw new Error(data.message || 'Database rejected universe parameters.');
         }

         // Form code sync reset and feedback UI flow
         closePanel();
         showToast(`🌌 Fictional Universe "${formData.universeName}" & Crew Character synced into MongoDB Compass!`, 'success');
         
         // Fallback legacy UI system updates
         if (typeof addAstronaut === 'function') {
            addAstronaut({
               name: formData.name,
               rank: formData.rank,
               specialty: formData.specialty,
               experience: parseInt(formData.experience) || 1,
               nationality: formData.nationality,
               bio: formData.bio
            });
         }
         renderCrewGrid();

      } catch (error) {
         showToast(error.message || 'Could not pipeline data to backend server.', 'error');
         console.error('Worldbuilder Pipeline sync issue:', error);
      }
    });
}

function deleteAstronautAction(id) {
  const a = getAstronaut(id);
  if (!a) return;
  confirmAction(`Remove <b>${a.name}</b> from crew roster? This cannot be undone.`, () => {
    deleteAstronaut(id);
    showToast(`${a.name} removed`, 'warning');
    renderCrewGrid();
  });
}

function renderCrewToolbar() {
  const searchEl = document.getElementById('crew-search-input');
  const rankEl   = document.getElementById('crew-rank-filter');
  const gridBtn  = document.getElementById('crew-view-grid');
  const tableBtn = document.getElementById('crew-view-table');

  if (searchEl) searchEl.addEventListener('input', debounce(() => { crewSearch = searchEl.value; crewPage = 1; renderCrewGrid(); }, 300));
  if (rankEl)   rankEl.addEventListener('change', () => { crewRankFilter = rankEl.value; crewPage = 1; renderCrewGrid(); });
  if (gridBtn)  gridBtn.addEventListener('click', () => { crewView = 'grid'; gridBtn.classList.add('active'); tableBtn.classList.remove('active'); renderCrewGrid(); });
  if (tableBtn) tableBtn.addEventListener('click', () => { crewView = 'table'; tableBtn.classList.add('active'); gridBtn.classList.remove('active'); renderCrewGrid(); });

  // Safety Injection: Check and insert the Worldbuilder Pipeline activator button
  const toolbarContainer = document.querySelector('.crew-toolbar') || (tableBtn ? tableBtn.parentElement : null);
  if (toolbarContainer && !document.getElementById('dynamic-add-crew-btn')) {
    const addBtn = document.createElement('button');
    addBtn.id = 'dynamic-add-crew-btn';
    addBtn.className = 'btn btn-primary';
    addBtn.style.marginLeft = 'auto';
    addBtn.innerHTML = '🌌 REGISTER SCI-FI CREW';
    addBtn.onclick = openAddAstronaut;
    toolbarContainer.appendChild(addBtn);
  }
}