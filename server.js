const express = require('express'); // Backend web server framework
const sql = require('mssql');  // SQL Server client for Node.js
const cors = require('cors'); // Allows frontend to talk to backend

const app = express();
const PORT = 3000;

app.use(cors());   // Allow requests from frontend
app.use(express.json()); // Allow parsing JSON in requests
 
// Update these with your real credentials
const dbConfig = {
  user: 'sa',
  password: 'idku2005',
  server: 'DESKTOP-GBJCPDS\\SQLEXPRESS', // Your SQL Server instance
  database: 'SpaceExplorerDB',
  options: {
     encrypt: false, // <- disable encryption
    trustServerCertificate: true // <- trust the local certificate
  
  }
};
app.get('/', (req, res) => {
  res.send('🚀 SpaceExplorer Backend is running!');
});

// Sample endpoint to add an astronaut
app.post('/add-astronaut', async (req, res) => { // This route takes astronaut form data from your frontend and inserts it into the Astronauts table in SQL Server.
  try {
    const { full_name, rank, specialty, experience_years } = req.body;
    const pool = await sql.connect(dbConfig); 
    await pool.request()
      .input('full_name', sql.VarChar(100), full_name)
      .input('rank', sql.VarChar(50), rank)
      .input('specialty', sql.VarChar(100), specialty)
      .input('experience_years', sql.Int, experience_years)
      .query(`
        INSERT INTO Astronauts (full_name, rank, specialty, experience_years)
        VALUES (@full_name, @rank, @specialty, @experience_years)
      `);
    

    res.status(200).send("🚀 Astronaut added successfully!");
  } catch (err) {
    res.status(500).send("❌ Error: " + err.message);
  }
});
//Sample endpoint to add a mission
app.post('/add-mission', async (req, res) => {
  try {
    const { mission_name, destination, objective, launch_date, duration_days, priority_level, crew_size } = req.body;
    const pool = await sql.connect(dbConfig);
    await pool.request()
      .input('mission_name', sql.VarChar(100), mission_name)
      .input('destination', sql.VarChar(100), destination)
      .input('objective', sql.Text, objective)
      .input('launch_date', sql.Date, launch_date)
      .input('duration_days', sql.Int, duration_days)
      .input('priority_level', sql.VarChar(20), priority_level)
      .input('crew_size', sql.Int, crew_size)
      .query(`
        INSERT INTO Missions (mission_name, destination, objective, launch_date, duration_days, priority_level, crew_size)
        VALUES (@mission_name, @destination, @objective, @launch_date, @duration_days, @priority_level, @crew_size)
      `);
    res.status(200).send("🛰️ Mission added successfully!");
  } catch (err) {
    res.status(500).send("❌ Error: " + err.message);
  }
});
//Sample endpoint to add a discovery
app.post('/add-discovery', async (req, res) => {
  try {
    const { title, type, location, discovered_by, description } = req.body;
    const pool = await sql.connect(dbConfig);
    await pool.request()
      .input('title', sql.VarChar(100), title)
      .input('type', sql.VarChar(50), type)
      .input('location', sql.VarChar(100), location)
      .input('discovered_by', sql.VarChar(100), discovered_by)
      .input('description', sql.Text, description)
      .query(`
        INSERT INTO Discoveries (title, type, location, discovered_by, description)
        VALUES (@title, @type, @location, @discovered_by, @description)
      `);
    res.status(200).send("🪐 Discovery logged!");
  } catch (err) {
    res.status(500).send("❌ Error: " + err.message);
  }
});
// Sample endpoint to get all astronauts by name
app.get('/search-astronaut/:name', async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request()
      .input('name', sql.VarChar(100), `%${req.params.name}%`)
      .query("SELECT * FROM Astronauts WHERE full_name LIKE @name");

    res.status(200).json(result.recordset);
  } catch (err) {
    res.status(500).send("❌ Error: " + err.message);
  }
});
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
