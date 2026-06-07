// ============================================================
// SpaceExplorer 2.0 — Crew Page (Fixed Async Integration)
// ============================================================

let crewView = 'grid';
let crewSearch = '';
let crewRankFilter = '';
let crewPage = 1;
const CREW_PER_PAGE = 10;

function initCrew() {
  renderCrewToolbar();
  renderCrewGrid(); // Will be handled async now
}

// Ensure unique renderCrewToolbar (removed duplicate at bottom of old code)
function renderCrewToolbar() {
  const searchEl = document.getElementById('crew-search-input');
  const rankEl   = document.getElementById('crew-rank-filter');
  const gridBtn  = document.getElementById('crew-view-grid');
  const tableBtn = document.getElementById('crew-view-table');

  if (searchEl && typeof debounce === 'function') {
    searchEl.addEventListener('input', debounce(() => { crewSearch = searchEl.value; crewPage = 1; renderCrewGrid(); }, 300));
  }
  if (rankEl) rankEl.addEventListener('change', () => { crewRankFilter = rankEl.value; crewPage = 1; renderCrewGrid(); });
  
  if (gridBtn) gridBtn.addEventListener('click', () => { 
    crewView = 'grid'; gridBtn.classList.add('active'); if(tableBtn) tableBtn.classList.remove('active'); renderCrewGrid(); 
  });
  if (tableBtn) tableBtn.addEventListener('click', () => { 
    crewView = 'table'; tableBtn.classList.add('active'); if(gridBtn) gridBtn.classList.remove('active'); renderCrewGrid(); 
  });

  // Safety Injection: Worldbuilder Pipeline activator button
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

// 1. ADDED ASYNC to data fetcher
async function getFilteredCrew() {
  const res = await getAstronauts();
  const astronauts = Array.isArray(res) ? res : (res.data || []);
  
  return astronauts.filter(a => {
    const nameMatch = a.name ? a.name.toLowerCase().includes(crewSearch.toLowerCase()) : false;
    const specMatch = a.specialty ? a.specialty.toLowerCase().includes(crewSearch.toLowerCase()) : false;
    const matchSearch = !crewSearch || nameMatch || specMatch;
    const matchRank   = !crewRankFilter || a.rank === crewRankFilter;
    return matchSearch && matchRank;
  });
}

// 2. ADDED ASYNC to Grid Renderer
async function renderCrewGrid() {
  const container = document.getElementById('crew-container');
  if (!container) return;
  
  const crew = await getFilteredCrew();

  if (!crew.length) {
    if (typeof renderEmptyState === 'function') {
      renderEmptyState('crew-container', 'No Crew Found', 'No astronauts match your filters. Try a different search or add new crew.');
    } else {
      container.innerHTML = '<div style="text-align:center;padding:40px;width:100%;grid-column:1/-1;">No Crew Found</div>';
    }
    return;
  }

  if (crewView === 'grid') {
    // We await all card renders because they might fetch mission data
    const cardPromises = crew.map((a, i) => renderAstronautCard(a, i));
    const cardsHtml = await Promise.all(cardPromises);
    container.innerHTML = `<div class="crew-grid">${cardsHtml.join('')}</div>`;
  } else {
    await renderCrewTable(container, crew);
  }
}

// 3. ADDED ASYNC to Card Renderer to safely get mission names
async function renderAstronautCard(a, i) {
  let missionName = '✅ AVAILABLE';
  if (a.missionId) {
    try {
      const mData = await getMission(a.missionId);
      const mission = mData.data || mData;
      if (mission && mission.name) missionName = '🚀 ' + mission.name;
    } catch(e) {}
  }

  const cid = a._id || a.id;
  
  return `
  <div class="card card-brackets astronaut-card animate-in" style="animation-delay:${i*50}ms;padding:0">
    <div class="card-avatar-area" style="background:${hashColorPair(a.name||'Unknown').replace('linear-gradient', 'linear-gradient')}40">
      <div class="astronaut-avatar" style="background:${hashColorPair(a.name||'Unknown')}">${getInitials(a.name||'Un')}</div>
      <span class="badge ${a.rank||'crew'}">${(a.rank||'crew').toUpperCase()}</span>
    </div>
    <div style="padding:var(--space-md)">
      <div class="astronaut-name">${a.name || 'Unknown'}</div>
      <div class="astronaut-specialty">${(a.specialty||'General').toUpperCase()} · ${a.experience||0} YRS</div>
      <div class="astronaut-mission">${missionName}</div>
      <div style="margin-top:var(--space-md)">
        <div class="skill-bar-label"><span class="skill-bar-name">Leadership</span><span class="skill-bar-value">${a.leadership||50}%</span></div>
        <div class="skill-bar-track"><div class="skill-bar-fill" style="width:${a.leadership||50}%"></div></div>
        <div class="skill-bar-label"><span class="skill-bar-name">Technical</span><span class="skill-bar-value">${a.technical||50}%</span></div>
        <div class="skill-bar-track"><div class="skill-bar-fill" style="width:${a.technical||50}%"></div></div>
        <div class="skill-bar-label"><span class="skill-bar-name">Physical</span><span class="skill-bar-value">${a.physical||50}%</span></div>
        <div class="skill-bar-track"><div class="skill-bar-fill" style="width:${a.physical||50}%"></div></div>
      </div>
      <div style="display:flex;gap:var(--space-xs);margin-top:var(--space-md)">
        <button class="btn btn-secondary btn-sm" onclick="viewAstronautProfile('${cid}')">PROFILE</button>
        <button class="btn btn-ghost btn-sm" onclick="assignAstronaut('${cid}')">ASSIGN</button>
        <button class="btn btn-danger btn-sm" onclick="deleteAstronautAction('${cid}')" style="margin-left:auto">×</button>
      </div>
    </div>
  </div>`;
}

// 4. ADDED ASYNC to Table Renderer
async function renderCrewTable(container, crew) {
  const start = (crewPage - 1) * CREW_PER_PAGE;
  const page  = crew.slice(start, start + CREW_PER_PAGE);
  const total = crew.length;
  const pages = Math.ceil(total / CREW_PER_PAGE);

  // Await mission resolutions for table rows
  const rowPromises = page.map(async (a) => {
    let missionName = '<span style="color:var(--accent-pulse)">Available</span>';
    if (a.missionId) {
      try {
        const mData = await getMission(a.missionId);
        const mission = mData.data || mData;
        if (mission && mission.name) missionName = mission.name;
      } catch(e) {}
    }
    const cid = a._id || a.id;
    return `<tr>
      <td><div style="display:flex;align-items:center;gap:8px">
        <div style="width:32px;height:32px;border-radius:50%;background:${hashColorPair(a.name||'Un')};display:flex;align-items:center;justify-content:center;font-family:var(--font-heading);font-size:0.65rem;font-weight:700;color:white;flex-shrink:0">${getInitials(a.name||'Un')}</div>
        ${a.name || 'Unknown'}
      </div></td>
      <td><span class="badge ${a.rank||'crew'}">${(a.rank||'crew').toUpperCase()}</span></td>
      <td>${a.specialty||'General'}</td>
      <td class="mono">${a.experience||0} yrs</td>
      <td>${missionName}</td>
      <td><span class="badge ${a.status||'standby'}"><span class="status-dot ${a.status||'standby'}"></span>${(a.status||'standby').replace('-',' ').toUpperCase()}</span></td>
      <td><div style="display:flex;gap:4px">
        <button class="btn btn-ghost btn-sm" onclick="viewAstronautProfile('${cid}')">VIEW</button>
        <button class="btn btn-danger btn-sm" onclick="deleteAstronautAction('${cid}')">×</button>
      </div></td>
    </tr>`;
  });

  const rowsHtml = await Promise.all(rowPromises);

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
        ${rowsHtml.join('')}
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
  
  if(typeof makeSortable === 'function') {
    makeSortable('crew-table', crew, sorted => { crew.length = 0; crew.push(...sorted); renderCrewTable(container, crew); });
  }
}

// 5. ADDED ASYNC to View Profile
async function viewAstronautProfile(id) {
  try {
    const aData = await getAstronaut(id);
    if (!aData) return;
    const a = aData.data || aData;
    
    let missionName = '✅ Available for Assignment';
    if (a.missionId) {
      try {
        const mData = await getMission(a.missionId);
        const mission = mData.data || mData;
        if (mission && mission.name) missionName = mission.name;
      } catch(e) {}
    }

    openModal(`${a.name||'Unknown'} — Personnel File`, `
      <div style="display:flex;gap:var(--space-lg);align-items:flex-start;flex-wrap:wrap">
        <div style="display:flex;flex-direction:column;align-items:center;gap:8px">
          <div style="width:80px;height:80px;border-radius:50%;background:${hashColorPair(a.name||'Un')};display:flex;align-items:center;justify-content:center;font-family:var(--font-heading);font-size:1.5rem;font-weight:700;color:white;">${getInitials(a.name||'Un')}</div>
          <span class="badge ${a.rank||'crew'}">${(a.rank||'crew').toUpperCase()}</span>
          <span class="badge ${a.status||'standby'}">${(a.status||'standby').replace('-',' ').toUpperCase()}</span>
        </div>
        <div style="flex:1;min-width:200px">
          <div class="form-label" style="margin-bottom:4px">Specialty</div>
          <div style="margin-bottom:12px">${a.specialty||'General'}</div>
          <div class="form-label" style="margin-bottom:4px">Experience</div>
          <div style="font-family:var(--font-mono);color:var(--accent-primary);margin-bottom:12px">${a.experience||0} years</div>
          <div class="form-label" style="margin-bottom:4px">Nationality</div>
          <div style="margin-bottom:12px">${a.nationality || 'N/A'}</div>
          <div class="form-label" style="margin-bottom:4px">Current Mission</div>
          <div style="color:${a.missionId?'var(--accent-pulse)':'#00ff88'}">${missionName}</div>
          ${a.bio ? `<div style="margin-top:16px;font-size:0.8rem;color:var(--text-secondary);line-height:1.6">${a.bio}</div>` : ''}
        </div>
      </div>
    `, [{ id:'close', label:'Close', class:'btn btn-ghost', handler: closeModal }]);
  } catch(e) { console.error(e); }
}

// 6. ADDED ASYNC to Assign Action
async function assignAstronaut(id) {
  try {
    const aData = await getAstronaut(id);
    if (!aData) return;
    const a = aData.data || aData;
    
    const mRes = await getMissions();
    const allMissions = Array.isArray(mRes) ? mRes : (mRes.data || []);
    const activeMissions = allMissions.filter(m => m.status === 'active' || m.status === 'planning');
    
    const opts = `<option value="">Unassigned</option>` + activeMissions.map(m => {
      const mId = m._id || m.id;
      return `<option value="${mId}" ${a.missionId===mId?'selected':''}>${m.name||'Mission'}</option>`
    }).join('');

    openModal(`Assign ${(a.name||'Unknown').split(' ').pop()}`, `
      <div class="form-group">
        <label class="form-label">Assign to Mission</label>
        <select class="form-select" id="assign-mission-select">${opts}</select>
      </div>`,
      [{ id:'cancel', label:'Cancel', class:'btn btn-ghost', handler:closeModal },
       { id:'save', label:'Save Assignment', class:'btn btn-primary', handler: async () => {
         const sel = document.getElementById('assign-mission-select');
         const mId = sel.value || null;
         try {
           await assignAstronautToMission(id, mId);
           closeModal();
           if(typeof showToast==='function') showToast(`Assignment updated`, 'success');
           renderCrewGrid();
         } catch(e) {
           if(typeof showToast==='function') showToast(`Failed to assign`, 'error');
           console.error(e);
         }
       }}]);
  } catch(e) { console.error(e); }
}

// ============================================================
// SpaceExplorer 2.0 — Sci-Fi Worldbuilder Database Connection
// ============================================================
const UNIVERSE_API = 'http://localhost:5000/api/universe';

function openAddAstronaut() {
  if (typeof openPanel !== 'function') return;
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
      const formData = Object.fromEntries(fd);
      const loggedInUser = JSON.parse(localStorage.getItem('user'));
      
      if (!loggedInUser || !loggedInUser.id) {
         if(typeof showToast==='function') showToast('Error: Please log in to connect to the sci-fi workspace pipeline.', 'error');
         return;
      }

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
         const response = await fetch(`${UNIVERSE_API}/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(universePayload)
         });
         const data = await response.json();
         if (!response.ok) throw new Error(data.message || 'Database rejected universe parameters.');

         if(typeof closePanel==='function') closePanel();
         if(typeof showToast==='function') showToast(`🌌 Fictional Universe "${formData.universeName}" synced!`, 'success');
         
         if (typeof addAstronaut === 'function') {
            await addAstronaut({
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
         if(typeof showToast==='function') showToast(error.message || 'Could not pipeline data.', 'error');
         console.error('Worldbuilder sync issue:', error);
      }
    });
}

// 7. ADDED ASYNC to Delete Action
async function deleteAstronautAction(id) {
  try {
    const aData = await getAstronaut(id);
    if (!aData) return;
    const a = aData.data || aData;
    
    if (typeof confirmAction === 'function') {
      confirmAction(`Remove <b>${a.name||'this astronaut'}</b> from crew roster? This cannot be undone.`, async () => {
        await deleteAstronaut(id);
        if(typeof showToast==='function') showToast(`${a.name||'Astronaut'} removed`, 'warning');
        renderCrewGrid();
      });
    }
  } catch(e) { console.error(e); }
}