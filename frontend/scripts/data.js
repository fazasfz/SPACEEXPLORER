// ============================================================
// SpaceExplorer 2.0 — Mock Data Layer
// ============================================================

const DEFAULT_MISSIONS = [
  { id: 1, name: 'Artemis IX', destination: 'Moon', objective: 'Establish permanent lunar base Alpha and conduct deep-core geological surveys of the south pole crater region.', launchDate: '2026-06-15', duration: '8 months', priority: 'critical', crewSize: 6, status: 'active', progress: 42 },
  { id: 2, name: 'Hermes-7', destination: 'Mars', objective: 'Deploy autonomous drilling rig at Hellas Basin and collect subsurface rock samples for biosignature analysis.', launchDate: '2026-09-01', duration: '2 years', priority: 'high', crewSize: 4, status: 'planning', progress: 0 },
  { id: 3, name: 'Project Cassini-2', destination: 'Europa', objective: 'Penetrate Europa ice shell and deploy submersible probe into subsurface ocean to search for thermophilic lifeforms.', launchDate: '2025-03-10', duration: '4 years', priority: 'critical', crewSize: 5, status: 'active', progress: 78 },
  { id: 4, name: 'Titan Diver', destination: 'Titan', objective: 'Atmospheric dive into Titan methane lakes using heat-shielded probe to collect organic compound samples.', launchDate: '2024-11-22', duration: '3 years', priority: 'high', crewSize: 3, status: 'completed', progress: 100 },
  { id: 5, name: 'Voyager Legacy', destination: 'Deep Space', objective: 'Long-range survey mission to chart the heliosphere boundary and measure interstellar medium composition.', launchDate: '2025-08-03', duration: '5 years', priority: 'medium', crewSize: 2, status: 'active', progress: 29 },
  { id: 6, name: 'Nemesis Sweep', destination: 'Asteroid Belt', objective: 'Map and classify 500+ near-Earth asteroids; deploy hazard beacon network for planetary defense.', launchDate: '2025-01-15', duration: '18 months', priority: 'high', crewSize: 4, status: 'failed', progress: 63 },
  { id: 7, name: 'Prometheus II', destination: 'Jupiter', objective: 'Deploy atmospheric probe into Jovian storm systems; measure magnetic anomalies and radio emission sources.', launchDate: '2026-12-01', duration: '3 years', priority: 'medium', crewSize: 5, status: 'planning', progress: 0 },
  { id: 8, name: 'Helios Reach', destination: 'Solar Corona', objective: 'Closest solar flyby ever attempted — measure coronal plasma density, map magnetic field lines in real time.', launchDate: '2026-04-20', duration: '6 months', priority: 'critical', crewSize: 3, status: 'planning', progress: 0 }
];

const DEFAULT_ASTRONAUTS = [
  { id: 1, name: 'Commander Elena Vasquez', rank: 'commander', specialty: 'navigation', experience: 18, nationality: 'USA', missionId: 1, status: 'deployed', bio: 'Veteran of three deep-space missions. Led the first successful Mars orbital insertion.', leadership: 95, technical: 88, physical: 82 },
  { id: 2, name: 'Captain Jin-ho Park', rank: 'captain', specialty: 'engineering', experience: 14, nationality: 'South Korea', missionId: 1, status: 'deployed', bio: 'Structural engineer specializing in extraterrestrial habitat construction and life support.', leadership: 80, technical: 97, physical: 85 },
  { id: 3, name: 'Specialist Amara Osei', rank: 'specialist', specialty: 'science', experience: 9, nationality: 'Ghana', missionId: 3, status: 'deployed', bio: 'Astrobiologist with groundbreaking research on extremophile organisms in Antarctic ice.', leadership: 72, technical: 91, physical: 78 },
  { id: 4, name: 'Pilot Yuki Tanaka', rank: 'pilot', specialty: 'navigation', experience: 11, nationality: 'Japan', missionId: 3, status: 'deployed', bio: 'Elite test pilot rated for hypersonic re-entry vehicles and orbital maneuvering.', leadership: 76, technical: 86, physical: 93 },
  { id: 5, name: 'Dr. Priya Mehta', rank: 'specialist', specialty: 'medical', experience: 7, nationality: 'India', missionId: null, status: 'standby', bio: 'Emergency medicine specialist trained for zero-gravity surgical procedures.', leadership: 68, technical: 89, physical: 74 },
  { id: 6, name: 'Lt. Marcus Cole', rank: 'pilot', specialty: 'engineering', experience: 6, nationality: 'UK', missionId: null, status: 'standby', bio: 'Propulsion systems expert, contributor to the next-gen ion thruster program.', leadership: 65, technical: 92, physical: 88 },
  { id: 7, name: 'Commander Olga Petrov', rank: 'commander', specialty: 'geology', experience: 21, nationality: 'Russia', missionId: 5, status: 'deployed', bio: 'Leading planetary geologist; authored the definitive atlas of Martian surface formations.', leadership: 97, technical: 84, physical: 71 },
  { id: 8, name: 'Specialist Rafael Diaz', rank: 'specialist', specialty: 'communications', experience: 8, nationality: 'Brazil', missionId: null, status: 'off-duty', bio: 'Deep-space communications relay engineer and quantum encryption specialist.', leadership: 70, technical: 88, physical: 80 },
  { id: 9, name: 'Trainee Aisha Nkrumah', rank: 'trainee', specialty: 'science', experience: 2, nationality: 'Nigeria', missionId: null, status: 'standby', bio: 'Astrophysics PhD candidate; early career specialist in exoplanetary atmospheric modeling.', leadership: 55, technical: 78, physical: 85 },
  { id: 10, name: 'Captain Boris Volkov', rank: 'captain', specialty: 'engineering', experience: 16, nationality: 'Russia', missionId: 2, status: 'deployed', bio: 'Nuclear reactor specialist for spacecraft power systems; has performed 9 EVAs.', leadership: 84, technical: 96, physical: 76 },
  { id: 11, name: 'Specialist Fatima Al-Rashid', rank: 'specialist', specialty: 'geology', experience: 10, nationality: 'UAE', missionId: 2, status: 'deployed', bio: 'Mineral geochemist specializing in early solar system formation evidence.', leadership: 74, technical: 87, physical: 79 },
  { id: 12, name: 'Lt. Chen Wei', rank: 'pilot', specialty: 'navigation', experience: 5, nationality: 'China', missionId: null, status: 'off-duty', bio: 'AI-assisted navigation systems operator; top of class at Jiuquan Cosmonaut Center.', leadership: 62, technical: 83, physical: 90 }
];

const DEFAULT_DISCOVERIES = [
  { id: 1, title: 'Subsurface Brine Channels Detected', type: 'geological', location: 'Europa South Pole', lat: -87.3, lon: 214.7, discoveredBy: 'Specialist Amara Osei', date: '2025-11-14', significance: 5, description: 'Ground-penetrating radar revealed an interconnected network of liquid brine channels approximately 2km below the ice shell surface. Chemical analysis suggests hypersaline water with temperatures above −10°C maintained by tidal flexing.', missionId: 3 },
  { id: 2, title: 'Ancient Lava Tubes — Lunar South Pole', type: 'geological', location: 'Shackleton Crater Rim', lat: -89.9, lon: 0.0, discoveredBy: 'Commander Elena Vasquez', date: '2026-01-08', significance: 4, description: 'LIDAR mapping revealed a network of intact basaltic lava tubes, some up to 80m in diameter, potentially suitable for pressurized habitat installation with natural radiation shielding.', missionId: 1 },
  { id: 3, title: 'Titan Amino Acid Precursors', type: 'chemical', location: 'Ligeia Mare, Titan', lat: 78.2, lon: 248.1, discoveredBy: 'Titan Diver Probe', date: '2025-07-22', significance: 5, description: 'Mass spectrometry of Titan methane lake samples revealed complex nitrile compounds and amino acid precursor molecules, suggesting non-aqueous prebiotic chemistry at cryogenic temperatures.', missionId: 4 },
  { id: 4, title: 'Anomalous Magnetic Wake — Hellas Basin', type: 'astronomical', location: 'Hellas Basin, Mars', lat: -42.4, lon: 70.5, discoveredBy: 'Dr. Priya Mehta', date: '2025-09-03', significance: 3, description: 'Orbital magnetometer detected a mobile magnetic anomaly inconsistent with crustal remanence. Hypothesized to be a magnetized dust vortex interacting with crustal field lines.', missionId: 2 },
  { id: 5, title: 'First Confirmed Microstructures in Martian Core Sample', type: 'biological', location: 'Elysium Planitia, Mars', lat: 25.0, lon: 147.0, discoveredBy: 'Specialist Fatima Al-Rashid', date: '2025-12-01', significance: 5, description: 'Electron microscopy of a core sample from 3.8m depth revealed sub-micron tubular microstructures morphologically similar to fossilized bacterial cells. Carbon isotope ratios are biogenic in character. PENDING PEER REVIEW.', missionId: 2 },
  { id: 6, title: 'Novel Silicate Crystal Formation', type: 'geological', location: 'Vesta Asteroid, Sector 7', lat: 33.1, lon: 101.4, discoveredBy: 'Commander Olga Petrov', date: '2025-08-17', significance: 3, description: 'An entirely new silicate crystal lattice structure with piezoelectric properties was identified in this regolith sample. Could have applications in vibration-based power generation.', missionId: 6 },
  { id: 7, title: 'Heliosphere Boundary Plasma Layer', type: 'astronomical', location: 'Heliopause, 123 AU', lat: 0.0, lon: 0.0, discoveredBy: 'Commander Olga Petrov', date: '2026-02-11', significance: 4, description: 'Instruments detected a previously unpredicted dense plasma sheet at the heliopause boundary. The layer shows coherent structure consistent with magnetic reconnection events on a solar-system scale.', missionId: 5 },
  { id: 8, title: 'Self-Replicating Carbon Nanotube Analogue', type: 'technological', location: 'Jupiter Upper Atmosphere', lat: -24.5, lon: 308.7, discoveredBy: 'Prometheus II Probe', date: '2025-05-30', significance: 4, description: 'Atmospheric sampling in the upper Jovian cloud deck revealed elongated carbon structures with self-similar geometry at multiple scales. Origin and formation mechanism remain unknown.', missionId: 7 },
  { id: 9, title: 'Chlorophyll-Analogue Pigment in Ice', type: 'biological', location: 'Europa Chaotic Terrain', lat: -14.2, lon: 167.9, discoveredBy: 'Specialist Amara Osei', date: '2026-01-25', significance: 5, description: 'A reddish pigment extracted from ice-melt samples absorbed electromagnetic radiation in the photosynthetically active range. Spectral signature does not match any known Earth compound.', missionId: 3 },
  { id: 10, title: 'Rotating Void Structure — Asteroid Belt', type: 'astronomical', location: 'Asteroid 433 Eros, Sector 12', lat: 0.0, lon: 0.0, discoveredBy: 'Nemesis Sweep Probe', date: '2025-04-09', significance: 3, description: 'Radar tomography revealed a perfect spherical void 400m in diameter inside an otherwise solid asteroid. The void rotates at a slightly different rate than the asteroid body. No known formation mechanism explains this.', missionId: 6 }
];

const DEFAULT_OBSERVATIONS = [
  { id: 1, object: 'Jupiter', objectType: 'Planet', datetime: '2026-03-10T21:30:00', location: 'Lahore, Pakistan', equipment: 'Celestron 8-inch SCT', seeing: 'excellent', bortle: 6, notes: 'Great belt detail visible. Could clearly make out all four Galilean moons. GRS slightly visible with #8 filter.', rating: 4 },
  { id: 2, object: 'Orion Nebula (M42)', objectType: 'Nebula', datetime: '2026-03-08T22:15:00', location: 'Murree Hills, Pakistan', equipment: 'William Optics ZenithStar 73', seeing: 'good', bortle: 4, notes: 'Stunning nebulosity visible with OIII filter. Trapezium resolved cleanly at 120x. Dark lanes clearly defined.', rating: 5 },
  { id: 3, object: 'Saturn', objectType: 'Planet', datetime: '2026-03-05T23:00:00', location: 'Islamabad, Pakistan', equipment: 'Celestron 8-inch SCT', seeing: 'good', bortle: 7, notes: 'Ring tilt at approximately 8°. Cassini division crisp. Titan and Rhea visible. Polar hexagon barely discernible.', rating: 4 },
  { id: 4, object: 'Andromeda Galaxy (M31)', objectType: 'Galaxy', datetime: '2026-02-28T20:45:00', location: 'Neelum Valley, AJK', equipment: '10x50 Binoculars', seeing: 'excellent', bortle: 3, notes: 'M32 and M110 visible simultaneously. Core concentration impressive. Naked-eye detection confirmed.', rating: 5 },
  { id: 5, object: 'ISS Pass', objectType: 'Satellite', datetime: '2026-03-12T19:47:00', location: 'Lahore, Pakistan', equipment: 'Naked Eye', seeing: 'excellent', bortle: 7, notes: 'Magnitude -3.8 pass nearly overhead, 83° max elevation. Solar panels briefly resolved in 8x42 binos.', rating: 4 },
  { id: 6, object: 'Pleiades (M45)', objectType: 'Star', datetime: '2026-03-01T21:00:00', location: 'Margalla Hills', equipment: 'William Optics ZenithStar 73', seeing: 'poor', bortle: 5, notes: 'Merope nebula barely hinted at through thin cloud cover. Six sisters visible naked eye despite poor seeing.', rating: 3 },
  { id: 7, object: 'C/2024 G3 Comet', objectType: 'Comet', datetime: '2026-03-15T04:30:00', location: 'Cholistan Desert', equipment: '10x50 Binoculars', seeing: 'excellent', bortle: 2, notes: 'Clear ion tail extending 3° with dust fan visible. Coma well-resolved. Nucleus condensation strong. Magnificent.', rating: 5 },
  { id: 8, object: 'Hercules Cluster (M13)', objectType: 'Star', datetime: '2026-03-18T23:30:00', location: 'Katas Raj, Punjab', equipment: 'Celestron 8-inch SCT', seeing: 'good', bortle: 5, notes: 'Resolution to individual stars at edge of cluster at 200x. Propeller asterism visible. Counted ~400 stars resolved.', rating: 4 }
];

const DEFAULT_LAUNCHES = [
  { id: 1, mission: 'Starship IFT-9', rocket: 'Starship / Super Heavy', provider: 'SpaceX', site: 'Starbase, Texas', netDate: '2026-04-10', status: 'go', missionType: 'Test Flight', outcome: null },
  { id: 2, mission: 'Artemis IV SLS', rocket: 'Space Launch System Block 1B', provider: 'NASA', site: 'Kennedy Space Center, LC-39B', netDate: '2026-05-22', status: 'go', missionType: 'Crewed Lunar', outcome: null },
  { id: 3, mission: 'Falcon 9 — Starlink G12', rocket: 'Falcon 9 Block 5', provider: 'SpaceX', site: 'Cape Canaveral, SLC-40', netDate: '2026-03-28', status: 'go', missionType: 'Satellite Deploy', outcome: null },
  { id: 4, mission: 'New Glenn — Pathfinder 3', rocket: 'New Glenn', provider: 'Blue Origin', site: 'Cape Canaveral, LC-36', netDate: '2026-04-18', status: 'hold', missionType: 'Commercial Payload', outcome: null },
  { id: 5, mission: 'Vulcan Centaur VC2S', rocket: 'Vulcan Centaur', provider: 'ULA', site: 'Cape Canaveral, SLC-41', netDate: '2026-05-05', status: 'go', missionType: 'National Security', outcome: null },
  { id: 6, mission: 'ISRO GSLV-F16 OneWeb', rocket: 'GSLV Mk III', provider: 'ISRO', site: 'Satish Dhawan SC, SLP', netDate: '2026-06-01', status: 'go', missionType: 'Satellite Deploy', outcome: null },
  { id: 7, mission: 'Falcon Heavy — Psyche Relay', rocket: 'Falcon Heavy', provider: 'SpaceX', site: 'Kennedy Space Center, LC-39A', netDate: '2026-04-30', status: 'scrubbed', missionType: 'Deep Space', outcome: null },
  // Recent launches
  { id: 8, mission: 'Starlink G11-2', rocket: 'Falcon 9', provider: 'SpaceX', site: 'Vandenberg SFB', netDate: '2026-03-10', status: 'launched', missionType: 'Satellite Deploy', outcome: 'All 23 Starlink V3 satellites successfully deployed.' },
  { id: 9, mission: 'Progress MS-29', rocket: 'Soyuz-2.1a', provider: 'Roscosmos', site: 'Baikonur, Site 31', netDate: '2026-03-02', status: 'launched', missionType: 'Cargo', outcome: 'Docked to ISS Pirs module after 2-orbit rendezvous.' },
  { id: 10, mission: 'Ariane 6 — EutelSat M21', rocket: 'Ariane 6', provider: 'ArianeGroup', site: 'Kourou ELA-4', netDate: '2026-02-14', status: 'launched', missionType: 'Commercial GEO', outcome: 'Successful GTO insertion. Spacecraft separated nominally.' },
  { id: 11, mission: 'Atlas V — JPSS-3', rocket: 'Atlas V 401', provider: 'ULA', site: 'Vandenberg SFB, SLC-3E', netDate: '2026-02-01', status: 'launched', missionType: 'Earth Science', outcome: 'Weather satellite delivered to 824km SSO. All instruments nominal.' }
];

const DEFAULT_LEADERBOARD = [
  { id: 1, username: 'StarCaptain_Elena', points: 4850, missions: 1200, discoveries: 2100, observations: 900, community: 650, level: 'admiral', lastActive: '2026-03-24' },
  { id: 2, username: 'NebulaHunter_X', points: 4220, missions: 900, discoveries: 1800, observations: 1100, community: 420, level: 'admiral', lastActive: '2026-03-23' },
  { id: 3, username: 'CosmicDrifter', points: 3780, missions: 1500, discoveries: 1200, observations: 800, community: 280, level: 'commander', lastActive: '2026-03-22' },
  { id: 4, username: 'PlanetaryGeologist', points: 3100, missions: 600, discoveries: 1900, observations: 400, community: 200, level: 'commander', lastActive: '2026-03-20' },
  { id: 5, username: 'OrbitalMechanic_7', points: 2850, missions: 1200, discoveries: 800, observations: 600, community: 250, level: 'commander', lastActive: '2026-03-19' },
  { id: 6, username: 'LunarCartographer', points: 2400, missions: 900, discoveries: 1000, observations: 350, community: 150, level: 'specialist', lastActive: '2026-03-18' },
  { id: 7, username: 'IceWorldExplorer', points: 2100, missions: 600, discoveries: 850, observations: 500, community: 150, level: 'specialist', lastActive: '2026-03-15' },
  { id: 8, username: 'darkmatter_99', points: 1800, missions: 300, discoveries: 900, observations: 450, community: 150, level: 'specialist', lastActive: '2026-03-14' },
  { id: 9, username: 'VoidWatcher', points: 1500, missions: 600, discoveries: 400, observations: 350, community: 150, level: 'pilot', lastActive: '2026-03-12' },
  { id: 10, username: 'RedPlanetFan', points: 1200, missions: 450, discoveries: 400, observations: 250, community: 100, level: 'pilot', lastActive: '2026-03-10' },
  { id: 11, username: 'StargazerPK', points: 950, missions: 150, discoveries: 400, observations: 350, community: 50, level: 'pilot', lastActive: '2026-03-08' },
  { id: 12, username: 'NightSkyLogger', points: 720, missions: 0, discoveries: 200, observations: 470, community: 50, level: 'cadet', lastActive: '2026-03-05' },
  { id: 13, username: 'FirstLightObserver', points: 540, missions: 0, discoveries: 100, observations: 360, community: 80, level: 'cadet', lastActive: '2026-03-01' },
  { id: 14, username: 'SpaceNewbie2026', points: 310, missions: 150, discoveries: 100, observations: 60, community: 0, level: 'cadet', lastActive: '2026-02-25' },
  { id: 15, username: 'GalaxySurfer', points: 180, missions: 30, discoveries: 50, observations: 80, community: 20, level: 'cadet', lastActive: '2026-02-20' }
];

// ── Local Storage Persistence ──────────────────────────────────────────
function loadData(key, defaults) {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [...defaults];
  } catch { return [...defaults]; }
}

function saveData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// ── Live Data Arrays (populated on init) ──────────────────────────────
let MISSIONS     = loadData('se_missions', DEFAULT_MISSIONS);
let ASTRONAUTS   = loadData('se_astronauts', DEFAULT_ASTRONAUTS);
let DISCOVERIES  = loadData('se_discoveries', DEFAULT_DISCOVERIES);
let OBSERVATIONS = loadData('se_observations', DEFAULT_OBSERVATIONS);
let LAUNCHES     = loadData('se_launches', DEFAULT_LAUNCHES);
let LEADERBOARD  = loadData('se_leaderboard', DEFAULT_LEADERBOARD);
let FOLLOWED_LAUNCHES = loadData('se_followed_launches', []);
