CREATE DATABASE SpaceExplorerDB;
USE SpaceExplorerDB;
 --Astronaut Table
 CREATE TABLE Astronauts (
    astronaut_id INT PRIMARY KEY IDENTITY(1,1), --IDENTITY(1,1) means: Start at 1 , Increment by 1 each time a new row is inserted.
    full_name VARCHAR(100),
    rank VARCHAR(50),
    specialty VARCHAR(100),
    experience_years INT
);
--mission table
CREATE TABLE Missions (
    mission_id INT PRIMARY KEY IDENTITY(1,1),
    mission_name VARCHAR(100),
    destination VARCHAR(100),
    objective TEXT,
    launch_date DATE,
    duration_days INT,
    priority_level VARCHAR(20),
    crew_size INT
);
--crew table
CREATE TABLE MissionCrew (
    id INT PRIMARY KEY IDENTITY(1,1),
    mission_id INT,
    astronaut_id INT,
    role VARCHAR(100),
    FOREIGN KEY (mission_id) REFERENCES Missions(mission_id),
    FOREIGN KEY (astronaut_id) REFERENCES Astronauts(astronaut_id)
);
--discoveries table
CREATE TABLE Discoveries (
    discovery_id INT PRIMARY KEY IDENTITY(1,1),
    discovery_title VARCHAR(100),
    discovery_type VARCHAR(50),
    location VARCHAR(100),
    description TEXT,
    discovered_by INT,
    mission_id INT,
    discovery_date DATE,
    FOREIGN KEY (discovered_by) REFERENCES Astronauts(astronaut_id),
    FOREIGN KEY (mission_id) REFERENCES Missions(mission_id)
);
--SearchLog table
CREATE TABLE SearchLogs (
    search_id INT PRIMARY KEY IDENTITY(1,1),
    search_term VARCHAR(100),
    search_type VARCHAR(50),
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

--Astronaut sample data
INSERT INTO Astronauts (full_name, rank, specialty, experience_years)
VALUES
('Luna Vega', 'Commander', 'Pilot', 12),
('Kai Nova', 'Specialist', 'Astrophysicist', 7);

--Miision sample data
INSERT INTO Missions (mission_name, destination, objective, launch_date, duration_days, priority_level, crew_size)
VALUES
('Orion Alpha', 'Kepler-22b', 'Explore planetary atmosphere', '2025-10-01', 90, 'High', 4);

--Assign Astronauts to Mission
INSERT INTO MissionCrew (mission_id, astronaut_id, role)
VALUES
(1, 1, 'Pilot'),
(1, 2, 'Astrophysicist');

--Add Discovery
INSERT INTO Discoveries (discovery_title, discovery_type, location, description, discovered_by, mission_id, discovery_date)
VALUES
('Kepler Mist', 'Anomaly', 'Kepler-22b Sector A', 'Mysterious cloud pattern detected in upper atmosphere.', 2, 1, '2025-10-15');

--Search for astronaut by name
SELECT * FROM Astronauts
WHERE full_name LIKE '%Luna%';

--View all discoveries made by a specific astronaut
SELECT d.discovery_title, d.discovery_type, m.mission_name
FROM Discoveries d
JOIN Missions m ON d.mission_id = m.mission_id
WHERE d.discovered_by = 2;

--Missions by destination
SELECT * FROM Missions
WHERE destination LIKE '%Kepler%';

--View All Astronauts
SELECT * FROM Astronauts;

--Find Astronauts with Experience > 5 Years
SELECT * FROM Astronauts WHERE experience_years > 5;

--Missions Sorted by Priority
SELECT * FROM Missions ORDER BY priority_level;

--Search Mission by Destination
SELECT * FROM Missions WHERE destination LIKE '%Mars%';-- Discoveries made by specific astronaut
SELECT d.discovery_title, d.discovery_type, m.mission_name
FROM Discoveries d
JOIN Missions m ON d.mission_id = m.mission_id
WHERE d.discovered_by = 2;

-- Discoveries with Astronaut and Mission Info
SELECT d.discovery_title, d.discovery_date, a.full_name, m.mission_name
FROM Discoveries d
JOIN Astronauts a ON d.discovered_by = a.astronaut_id
JOIN Missions m ON d.mission_id = m.mission_id;

-- Count Missions Per Destination
SELECT destination, COUNT(*) AS total_missions
FROM Missions
GROUP BY destination;

-- Only Destinations with > 1 Mission
SELECT destination, COUNT(*) AS mission_count
FROM Missions
GROUP BY destination
HAVING COUNT(*) > 1;

-- Missions longer than average duration
SELECT * FROM Missions
WHERE duration_days > (SELECT AVG(duration_days) FROM Missions);

-- Categorize Astronaut Experience
SELECT full_name,
       experience_years,
       CASE 
           WHEN experience_years >= 10 THEN 'Veteran'
           WHEN experience_years >= 5 THEN 'Experienced'
           ELSE 'Novice'
       END AS experience_level
FROM Astronauts;

-- UPDATE: Change Mission Priority
UPDATE Missions
SET priority_level = 'Critical'
WHERE mission_name = 'Mars Genesis';

-- DELETE: Remove a search log if it exists
IF EXISTS (SELECT * FROM SearchLogs WHERE search_term = 'Mars')
    DELETE FROM SearchLogs WHERE search_term = 'Mars';

-- INDEX: Improve search on discovery_title
CREATE INDEX idx_discovery_title ON Discoveries(discovery_title);

-- VIEW: Astronaut and Their Discoveries
CREATE VIEW v_AstronautDiscoveries AS
SELECT a.full_name, d.discovery_title, d.discovery_date
FROM Astronauts a
JOIN Discoveries d ON a.astronaut_id = d.discovered_by;

-- Use the View
SELECT * FROM v_AstronautDiscoveries;