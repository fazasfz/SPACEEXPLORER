// ============================================================
// SpaceExplorer 2.0 — API Layer (Mock)
// Replace function bodies with fetch() calls when backend is ready
// ============================================================

// ── Missions ──────────────────────────────────────────────────────────
function getMissions() { return [...MISSIONS]; }
function getMission(id) { return MISSIONS.find(m => m.id === id); }
function addMission(data) {
  const m = { ...data, id: Date.now(), status: 'planning', progress: 0 };
  MISSIONS.push(m);
  saveData('se_missions', MISSIONS);
  return m;
}
function updateMission(id, data) {
  const idx = MISSIONS.findIndex(m => m.id === id);
  if (idx !== -1) { MISSIONS[idx] = { ...MISSIONS[idx], ...data }; saveData('se_missions', MISSIONS); }
}
function deleteMission(id) {
  MISSIONS = MISSIONS.filter(m => m.id !== id);
  saveData('se_missions', MISSIONS);
}

// ── Astronauts ────────────────────────────────────────────────────────
function getAstronauts() { return [...ASTRONAUTS]; }
function getAstronaut(id) { return ASTRONAUTS.find(a => a.id === id); }
function addAstronaut(data) {
  const a = { ...data, id: Date.now(), status: 'standby', missionId: null, leadership: 65, technical: 70, physical: 75 };
  ASTRONAUTS.push(a);
  saveData('se_astronauts', ASTRONAUTS);
  return a;
}
function deleteAstronaut(id) {
  ASTRONAUTS = ASTRONAUTS.filter(a => a.id !== id);
  saveData('se_astronauts', ASTRONAUTS);
}

// ── Discoveries ───────────────────────────────────────────────────────
function getDiscoveries() { return [...DISCOVERIES]; }
function addDiscovery(data) {
  const d = { ...data, id: Date.now(), date: new Date().toISOString().split('T')[0] };
  DISCOVERIES.push(d);
  saveData('se_discoveries', DISCOVERIES);
  return d;
}
function deleteDiscovery(id) {
  DISCOVERIES = DISCOVERIES.filter(d => d.id !== id);
  saveData('se_discoveries', DISCOVERIES);
}

// ── Observations ──────────────────────────────────────────────────────
function getObservations() { return [...OBSERVATIONS]; }
function addObservation(data) {
  const o = { ...data, id: Date.now() };
  OBSERVATIONS.push(o);
  saveData('se_observations', OBSERVATIONS);
  return o;
}
function deleteObservation(id) {
  OBSERVATIONS = OBSERVATIONS.filter(o => o.id !== id);
  saveData('se_observations', OBSERVATIONS);
}

// ── Launches ──────────────────────────────────────────────────────────
function getLaunches() { return [...LAUNCHES]; }
function getUpcomingLaunches() { return LAUNCHES.filter(l => l.status !== 'launched'); }
function getRecentLaunches() { return LAUNCHES.filter(l => l.status === 'launched'); }
function toggleFollowLaunch(id) {
  const idx = FOLLOWED_LAUNCHES.indexOf(id);
  if (idx === -1) FOLLOWED_LAUNCHES.push(id);
  else FOLLOWED_LAUNCHES.splice(idx, 1);
  saveData('se_followed_launches', FOLLOWED_LAUNCHES);
}
function isFollowed(id) { return FOLLOWED_LAUNCHES.includes(id); }

// ── Leaderboard ───────────────────────────────────────────────────────
function getLeaderboard() { return [...LEADERBOARD].sort((a, b) => b.points - a.points); }

// ── Stats ─────────────────────────────────────────────────────────────
function getStats() {
  const missions = getMissions();
  const completed = missions.filter(m => m.status === 'completed').length;
  const total = missions.length;
  return {
    activeMissions: missions.filter(m => m.status === 'active').length,
    crewDeployed: getAstronauts().filter(a => a.status === 'deployed').length,
    discoveriesLogged: getDiscoveries().length,
    launchSuccessRate: total ? Math.round(((total - missions.filter(m => m.status === 'failed').length) / total) * 100) : 94
  };
}

// ── Timeline Events ───────────────────────────────────────────────────
function getTimelineEvents() {
  const events = [];
  getMissions().slice(-3).forEach(m => events.push({ type: 'mission', icon: '🚀', text: `Mission <b>${m.name}</b> — status: ${m.status.toUpperCase()}`, date: m.launchDate, color: 'var(--accent-primary)' }));
  getDiscoveries().slice(-2).forEach(d => events.push({ type: 'discovery', icon: '🔬', text: `Discovery logged: <b>${d.title}</b>`, date: d.date, color: 'var(--accent-pulse)' }));
  getObservations().slice(-2).forEach(o => events.push({ type: 'obs', icon: '🔭', text: `Observation: <b>${o.object}</b> — ${o.location}`, date: o.datetime ? o.datetime.split('T')[0] : '2026-03-10', color: 'var(--accent-warn)' }));
  return events.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
}
