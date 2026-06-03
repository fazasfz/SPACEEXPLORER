// ============================================================
<<<<<<< HEAD
// SpaceExplorer 2.0 — API Layer
// Handles local mock states and live remote server downlinks
=======
// SpaceExplorer 2.0 — API Layer (Mock)
// Replace function bodies with fetch() calls when backend is ready
>>>>>>> upstream/main
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

<<<<<<< HEAD
// ── Live Launch Services & Remote Configuration ───────────────────────
var SPACEDEVS_BASE_URL = "https://ll.thespacedevs.com/2.2.0";
var NASA_APOD_URL = "https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY";
var FOLLOWED_LAUNCHES = JSON.parse(localStorage.getItem('se_followed_launches')) || [];

/**
 * Asynchronous fetch handler for live upcoming orbital spaceflights
 */
async function fetchUpcomingLaunchesAPI() {
  try {
    const response = await fetch(SPACEDEVS_BASE_URL + "/launch/upcoming/?limit=5");
    if (!response.ok) throw new Error("Network downlink variance anomaly detected.");
    const data = await response.json();
    
    return data.results.map(function(l) {
      return {
        id: l.id || String(Math.random()),
        mission: (l.name && l.name.includes('|')) ? l.name.split('|')[1].trim() : (l.name || "Telemetry Payload"),
        rocket: (l.rocket && l.rocket.configuration) ? l.rocket.configuration.full_name : "Operational Launch Vehicle",
        site: l.pad ? l.pad.name : "Global Spaceport Facility",
        provider: l.launch_service_provider ? l.launch_service_provider.name : "Space Carrier Enterprise",
        netDate: l.net || new Date().toISOString(),
        status: (l.status && l.status.abbrev) ? l.status.abbrev.toLowerCase() : "go",
        missionType: l.mission ? l.mission.type : "Orbital Mission",
        description: l.mission ? l.mission.description : "No alternative mission brief filed."
      };
    });
  } catch (error) {
    console.warn("Live API stream unavailable. Routing processing traffic to standby array metrics.", error);
    return getUpcomingLaunchesFallback();
  }
}

/**
 * Asynchronous fetch handler for recent past space flight entries
 */
async function fetchRecentLaunchesAPI() {
  try {
    const response = await fetch(SPACEDEVS_BASE_URL + "/launch/previous/?limit=10");
    if (!response.ok) throw new Error("Historical telemetry uplink timed out.");
    const data = await response.json();
    
    return data.results.map(function(l) {
      return {
        id: l.id || String(Math.random()),
        mission: (l.name && l.name.includes('|')) ? l.name.split('|')[1].trim() : (l.name || "Past Mission Log entry"),
        rocket: (l.rocket && l.rocket.configuration) ? l.rocket.configuration.full_name : "Falcon 9 Block 5",
        site: l.pad ? l.pad.name : "Cape Canaveral SLC-40",
        provider: l.launch_service_provider ? l.launch_service_provider.name : "Space Agency",
        netDate: l.net || new Date().toISOString(),
        status: "success",
        outcome: l.mission ? l.mission.description : "Mission objectives reached, orbital injection finalized cleanly."
      };
    });
  } catch (error) {
    console.warn("Recent history downlink offline. Deploying fallback log objects.", error);
    return [
      {
        id: "past-fallback-1",
        mission: "Crew-8 Return Operations",
        rocket: "Falcon 9 Block 5",
        site: "LC-39A, Kennedy Space Center, FL, USA",
        provider: "SpaceX",
        netDate: new Date(Date.now() - 86400000 * 2).toISOString(),
        status: "success",
        outcome: "Safe splashdown recovery of international crew members following an extended operational rotation aboard the ISS."
      }
    ];
  }
}

/**
 * Asynchronous retrieval handler for NASA Astronomy Picture of the Day
 */
async function fetchNasaApod() {
  try {
    const response = await fetch(NASA_APOD_URL);
    if (!response.ok) throw new Error("NASA APOD API pipeline rejected connection.");
    return await response.json();
  } catch (error) {
    console.error("APOD stream processing error caught:", error);
    return {
      title: "Deep Space Infrastructure Array",
      url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200",
      explanation: "Uplink parameters currently reading dry; fallback visual placeholder system actively monitoring."
    };
  }
}

// Synchronous legacy functions left intact to prevent breaking downstream components
function getLaunches() { return [...LAUNCHES]; }
function getUpcomingLaunches() { return LAUNCHES.filter(l => l.status !== 'launched'); }
function getRecentLaunches() { return LAUNCHES.filter(l => l.status === 'launched'); }

=======
// ── Launches ──────────────────────────────────────────────────────────
function getLaunches() { return [...LAUNCHES]; }
function getUpcomingLaunches() { return LAUNCHES.filter(l => l.status !== 'launched'); }
function getRecentLaunches() { return LAUNCHES.filter(l => l.status === 'launched'); }
>>>>>>> upstream/main
function toggleFollowLaunch(id) {
  const idx = FOLLOWED_LAUNCHES.indexOf(id);
  if (idx === -1) FOLLOWED_LAUNCHES.push(id);
  else FOLLOWED_LAUNCHES.splice(idx, 1);
  saveData('se_followed_launches', FOLLOWED_LAUNCHES);
}
<<<<<<< HEAD

function isFollowed(id) { return FOLLOWED_LAUNCHES.includes(id); }

function getUpcomingLaunchesFallback() {
  return [
    {
      id: "fallback-falcon9",
      mission: "Starlink Group 8-2 Flight",
      rocket: "Falcon 9 Block 5",
      site: "SLC-40, Cape Canaveral SFS, FL, USA",
      provider: "SpaceX",
      netDate: new Date(Date.now() + 86400000 * 1.5).toISOString(),
      status: "go",
      missionType: "Communications",
      description: "Deployment of next-generation operational Starlink internet communication satellites to low Earth orbit."
    },
    {
      id: "fallback-artemis",
      mission: "Artemis II Crewed Lunar Flyby",
      rocket: "Space Launch System (SLS) Block 1",
      site: "LC-39B, Kennedy Space Center, FL, USA",
      provider: "NASA",
      netDate: new Date(Date.now() + 86400000 * 14).toISOString(),
      status: "go",
      missionType: "Human Exploration",
      description: "First crewed lunar flyby mission under the Artemis deep space architecture, sending four astronauts around the Moon."
    }
  ];
}

=======
function isFollowed(id) { return FOLLOWED_LAUNCHES.includes(id); }

>>>>>>> upstream/main
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
<<<<<<< HEAD

=======
>>>>>>> upstream/main
