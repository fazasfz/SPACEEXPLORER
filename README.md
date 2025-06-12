# 🚀 SpaceExplorer — Full Stack Project

**SpaceExplorer** is a full-stack space mission management system built using:

- 🖥️ **Frontend**: React
- 🔧 **Backend**: Node.js + Express
- 🗄️ **Database**: Microsoft SQL Server

It allows adding, searching, and managing astronauts, missions, and space discoveries through a connected UI.

## 📁 Project Structure
SpaceExplorer/
├── frontend/ # React-based user interface
├── backend/ # Express.js server & API routes
│ ├── db.js # SQL Server configuration
│ └── server.js # Main backend logic
└── README.md

---


## ✅ Features

- Add astronauts with full details
- Add space missions and discoveries
- Search astronauts by name
- Fully connected frontend ↔ backend ↔ database

---

## 🛠️ Tech Stack

| Layer      | Technology                |
|------------|---------------------------|
| Frontend   | React, HTML, CSS, JS      |
| Backend    | Node.js, Express          |
| Database   | Microsoft SQL Server      |
| Other      | CORS, Axios, mssql        |

---

## API ENDPOINTS
| Method | Route                    | Purpose             |
| ------ | ------------------------ | ------------------- |
| GET    | /get-astronauts          | List all astronauts |
| POST   | /add-astronaut           | Add astronaut       |
| POST   | /add-mission             | Add space mission   |
| POST   | /add-discovery           | Add space discovery |
| GET    | /search-astronaut/\:name | Search by name      |

