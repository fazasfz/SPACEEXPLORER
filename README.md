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


## ⚙️ Features

- Add, view, and search astronauts, missions, and discoveries
- Microsoft SQL Server database with structured schema and relations
- Secure RESTful API using parameterized queries
- Frontend with live form submission and filtering
- Tested with Postman for reliability


---
## 🧠 Skills Applied

- Node.js / Express.js  
- Microsoft SQL Server  
- SQL Query Writing (INSERT, SELECT, LIKE)  
- RESTful API Design  
- Asynchronous JavaScript (async/await)  
- MVC Architecture  
- JSON Handling  
- CORS Configuration  
- Postman Testing  
- Git, GitHub, and VS Code

---
## 🛠️ Tech Stack

| Layer      | Technology                |
|------------|---------------------------|
| Frontend   | React, HTML, CSS, JS      |
| Backend    | Node.js, Express          |
| Database   | Microsoft SQL Server      |
| Other      | CORS, Axios, mssql        |


## 🧪 How to Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/space-explorer.git
cd SpaceExplorer
```
### 2. Set up the Database
Use Microsoft SQL Server Management Studio (SSMS).

Run the provided SQL script to create SpaceExplorerDB and its tables.

Enable TCP/IP and ensure SQL Server Browser is running.

### 3. Configure Backend
Inside /backend/db.js, update:

const config = {
  user: 'your_username',
  password: 'your_password',
  server: 'localhost',
  database: 'SpaceExplorerDB',
  options: {
    instanceName: 'SQLEXPRESS',
    encrypt: false,
    trustServerCertificate: true
  }
};

### 4. Start Backend Server
```bash
cd backend
npm install
node server.js
```
Terminal should show:

✅ Connected to SQL Server!
🚀 Server running on http://localhost:3000

### 5. Open Frontend
Open frontend/index.html in a browser

Make sure your backend is running

Test UI and backend flow!

###⭐️ Acknowledgments
Special thanks to our DBMS instructor and teammates for collaborative effort throughout this project!

