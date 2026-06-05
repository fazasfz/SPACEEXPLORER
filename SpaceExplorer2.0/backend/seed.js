require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Mission = require('./models/Mission');
const Astronaut = require('./models/Astronaut');
const Discovery = require('./models/Discovery');

const seedData = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  
  // Wipe legacy collection sets cleanly
  await User.deleteMany({});
  await Mission.deleteMany({});
  await Astronaut.deleteMany({});
  await Discovery.deleteMany({});

  console.log('🧹 Cleaning old database sectors...');

  // 1. Seed Users (Lab 5 & 12 Roles)
  const adminUser = await User.create({ username: 'commander', email: 'commander@spaceexplorer.io', passwordHash: 'hashed_placeholder', role: 'spaceAdmin', points: 500 });
  const viewerUser = await User.create({ username: 'faza', email: 'test@space.com', passwordHash: 'hashed_placeholder', role: 'spaceViewer', points: 120 });

  // 2. Seed Astronauts (Lab 5 Records)
  const astro1 = await Astronaut.create({ name: 'Fatima Al-Mansoori', rank: 'Commander', specialty: 'Astrophysics Warp Systems', experienceYears: 9, locked: false });
  const astro2 = await Astronaut.create({ name: 'Alex Mercer', rank: 'Flight Engineer', specialty: 'Exoplanet Navigation', experienceYears: 6, locked: false });

  // 3. Seed Missions
  await Mission.create({ name: 'Artemis Nexus Prime', destination: 'Lunar South Pole', objective: 'Establish deep-space satellite telemetry link.', launchDate: new Date(), duration: 45, status: 'active', crew: [astro1._id], createdBy: adminUser._id });
  await Mission.create({ name: 'Kepler Transit Operations', destination: 'Kepler-186f Sector', objective: 'Deploy orbital deep space mapping drones.', launchDate: new Date(), duration: 180, status: 'planning', crew: [astro2._id], createdBy: adminUser._id });

  // 4. Seed Discoveries
  await Discovery.create({ title: 'Ares Thermal Rift Anomaly', type: 'anomaly', location: 'Mars Quadrant Delta-4', description: 'Subsurface thermal vents detected processing liquid elements.', significance: 'High trace biosignature asset indicators.', discoveredBy: viewerUser._id });

  console.log('🧪 Lab 5 Database Collections Seeded with Realistic Operational Data Successfully!');
  process.exit();
};

seedData();