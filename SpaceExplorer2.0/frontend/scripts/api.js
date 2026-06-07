// ============================================================
// SpaceExplorer 2.0 — Production Integrated API Layer
// Fully connected with Fatima's Advanced MongoDB Backend Architecture
// ============================================================

const SERVER_URL = "http://localhost:5000/api";

/**
 * Helper function to safely attach JWT bearer tokens 
 * from localStorage for protected backend checkpoints.
 */
function getHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
}

// ── Auth Routes Pipeline (/api/auth) ───────────────────────────────────

async function loginUserAPI(email, password) {
  const response = await fetch(`${SERVER_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Login gateway rejected credentials.');
  
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));
  return data;
}

async function registerUserAPI(username, email, password, role = 'spaceViewer') {
  const response = await fetch(`${SERVER_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password, role })
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Registration pipeline tracking error.');
  
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));
  return data;
}

async function getAuthMeAPI() {
  const response = await fetch(`${SERVER_URL}/auth/me`, {
    headers: getHeaders()
  });
  if (!response.ok) throw new Error('Session authentication check expired.');
  return await response.json();
}


// ── Missions Routes Pipeline (/api/missions) ───────────────────────────

async function getMissions(statusFilter = '') {
  const url = statusFilter ? `${SERVER_URL}/missions?status=${statusFilter}` : `${SERVER_URL}/missions`;
  const response = await fetch(url);
  return await response.json();
}

async function getMission(id) {
  const response = await fetch(`${SERVER_URL}/missions/${id}`);
  return await response.json();
}

async function addMission(data) {
  const response = await fetch(`${SERVER_URL}/missions`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data) // Backend automatically runs transaction & awards 30 points
  });
  const resData = await response.json();
  if (!response.ok) throw new Error(resData.message || 'Failed to initialize mission log.');
  return resData;
}

async function updateMission(id, data) {
  const response = await fetch(`${SERVER_URL}/missions/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data)
  });
  return await response.json();
}

async function deleteMission(id) {
  const response = await fetch(`${SERVER_URL}/missions/${id}`, {
    method: 'DELETE',
    headers: getHeaders()
  });
  return await response.json();
}


// ── Astronauts Routes Pipeline (/api/astronauts) ───────────────────────

async function getAstronauts(page = 1) {
  // Lab 8: Connects with Skip + Limit backend pagination
  const response = await fetch(`${SERVER_URL}/astronauts?page=${page}`);
  const payload = await response.json();
  return payload.data || payload; 
}

async function getAstronaut(id) {
  const response = await fetch(`${SERVER_URL}/astronauts/${id}`);
  return await response.json();
}

async function addAstronaut(data) {
  const response = await fetch(`${SERVER_URL}/astronauts`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data) // Runs structural insertion transaction + awards 10 points
  });
  const resData = await response.json();
  if (!response.ok) throw new Error(resData.message || 'Failed to register new crew profile.');
  return resData;
}

async function assignAstronautToMission(astronautId, missionId) {
  // Lab 10 & 11: Invokes atomic full assignment transaction with pessimistic locks
  const response = await fetch(`${SERVER_URL}/astronauts/${astronautId}/assign`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify({ missionId })
  });
  const resData = await response.json();
  if (!response.ok) throw new Error(resData.message || 'Lock acquisition/assignment failed.');
  return resData;
}

async function deleteAstronaut(id) {
  const response = await fetch(`${SERVER_URL}/astronauts/${id}`, {
    method: 'DELETE',
    headers: getHeaders()
  });
  return await response.json();
}


// ── Discoveries Routes Pipeline (/api/discoveries) ─────────────────────

async function getDiscoveries() {
  const response = await fetch(`${SERVER_URL}/discoveries`);
  return await response.json();
}

async function addDiscovery(data) {
  const response = await fetch(`${SERVER_URL}/discoveries`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data) // Triggers transaction & awards 50 points
  });
  const resData = await response.json();
  if (!response.ok) throw new Error(resData.message || 'Failed to record discovery timeline block.');
  return resData;
}

async function deleteDiscovery(id) {
  const response = await fetch(`${SERVER_URL}/discoveries/${id}`, {
    method: 'DELETE',
    headers: getHeaders()
  });
  return await response.json();
}


// ── Observations Routes Pipeline (/api/observations) ───────────────────

async function getObservations() {
  const response = await fetch(`${SERVER_URL}/observations`, {
    headers: getHeaders() // Automatically returns data filtered by current logged-in user id
  });
  return await response.json();
}

async function addObservation(data) {
  const response = await fetch(`${SERVER_URL}/observations`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data) // Runs database entry transaction & awards 20 points
  });
  const resData = await response.json();
  if (!response.ok) throw new Error(resData.message || 'Failed to commit tracking data.');
  return resData;
}

async function deleteObservation(id) {
  const response = await fetch(`${SERVER_URL}/observations/${id}`, {
    method: 'DELETE',
    headers: getHeaders()
  });
  return await response.json();
}


// ── Leaderboard Component Route (/api/leaderboard) ─────────────────────

async function getLeaderboard() {
  // Lab 12: Reads directly from the materialized view data pool
  const response = await fetch(`${SERVER_URL}/leaderboard`);
  return await response.json();
}


// ── Global Search Engine Cross Routing (/api/search) ───────────────────

async function runGlobalSearch(queryTerm) {
  // Lab 7 & 8: Executes composite text index query search over distinct databases
  if (!queryTerm) return { missions: [], crew: [], discoveries: [] };
  const response = await fetch(`${SERVER_URL}/search?q=${encodeURIComponent(queryTerm)}`);
  return await response.json();
}


// ── Live Launch Services & Telemetry Optimization ─────────────────────

var SPACEDEVS_BASE_URL = "http://localhost:5000/api/telemetry";
var NASA_APOD_URL = "https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY";
var FOLLOWED_LAUNCHES = JSON.parse(localStorage.getItem('se_followed_launches')) || [];

async function fetchUpcomingLaunchesAPI() {
  try {
    const response = await fetch(`${SERVER_URL}/missions`);
    if (!response.ok) throw new Error("Network downlink variance anomaly detected.");
    
    // Yahan hum data ko map/filter karne ke bajaye seedha return kar rahe hain
    // Taake MongoDB ka asli data (name, destination, etc.) dashboard tak pohnche
    const data = await response.json();
    return data; 

  } catch (error) {
    console.warn("Live API stream offline. Re-routing processing traffic to standby array metrics.", error);
    return getUpcomingLaunchesFallback();
  }
}

async function fetchRecentLaunchesAPI() {
  try {
    const response = await fetch(`${SPACEDEVS_BASE_URL}/previous`);
    if (!response.ok) throw new Error("Historical telemetry uplink timed out.");
    const data = await response.json();
    return data;
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

function toggleFollowLaunch(id) {
  const idx = FOLLOWED_LAUNCHES.indexOf(id);
  if (idx === -1) FOLLOWED_LAUNCHES.push(id);
  else FOLLOWED_LAUNCHES.splice(idx, 1);
  localStorage.setItem('se_followed_launches', JSON.stringify(FOLLOWED_LAUNCHES));
}

function isFollowed(id) { return FOLLOWED_LAUNCHES.includes(id); }


// ── Stats Calculations (Lab 5 & 6 Unified Aggregate Output) ──────────

async function getStats() {
  try {
    const response = await fetch(`${SERVER_URL}/missions/stats-dashboard`);
    if (response.ok) {
      const res = await response.json();
      // Yahan hum ensure kar rahe hain ke agar res.data hai toh woh nikaal lein
      return res.data || res; 
    }
  } catch (e) {
    console.warn("Analytics server polling offline.");
  }
  return { activeMissions: 2, crewDeployed: 4, discoveriesLogged: 12, launchSuccessRate: 96 };
}

async function getTimelineEvents() {
  try {
    const response = await fetch(`${SERVER_URL}/missions/timeline-feed`);
    if (response.ok) return await response.json();
  } catch (e) {
    console.warn("Timeline synchronization timeline delayed.");
  }
  return [
    { type: 'mission', icon: '🚀', text: 'Mission <b>Ares V</b> — Status: PLANNING', date: '2026-06-15', color: 'var(--accent-primary)' }
  ];
}