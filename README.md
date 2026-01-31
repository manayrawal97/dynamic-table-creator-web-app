# 📊 Dynamic Table Creator

A full-stack web application that allows users to create, edit, manage, and store dynamic tables with authentication support.

Built using:

* **Frontend:** React.js, Tailwind CSS
* **Backend:** Node.js (Express)
* **Database:** MySQL


### 🚀 Features

* User Authentication (Register, Login, Logout)
* Protected Routes (Only logged-in users can manage tables)
* Create dynamic tables
* Add / Delete rows and columns
* Editable cells
* Save and view multiple tables in the dashboard
* Export tables as CSV
* Export tables as JSON
* Backend APIs for CRUD operations
* Secure JWT authentication
* Modular frontend & backend architecture

---

## 📁 Project Structure

```
dynamic_table_creator/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   │   └── api.js
│   │   ├── assets/
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.config.js
│   │   ├── controller/
│   │   │   ├── auth_controller.js
│   │   │   └── table_controller.js
│   │   ├── middleware/
│   │   │   └── auth_middleware.js
│   │   ├── routes/
│   │   │   ├── auth_routes.js
│   │   │   └── table_routes.js
│   ├── server.js
│   ├── .env
│   └── package.json
│
└── README.md
```

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Tailwind CSS
* Axios
* Vite

### Backend

* Node.js
* Express.js
* JWT Authentication

### Database

* MySQL

---

## ⚙️ Setup Instructions

### 📌 Backend Setup

1. Navigate to the backend folder:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env` file:

```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=dynamic_table_creator
JWT_SECRET=your_secret_key
```

4. Start server:

```bash
npm start
```

Backend runs on:

```
http://localhost:5000
```

---

### 📌 Frontend Setup

1. Navigate to the frontend folder:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start frontend:

```bash
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

---

## 🔐 Authentication Flow

* Users register and log in
* JWT token is generated
* Token stored in browser
* Protected APIs accessed with a token
* Logout clears the token

---

## 📡 API Endpoints (Sample)

### Auth

| Method | Endpoint           | Description   |
| ------ | ------------------ | ------------- |
| POST   | /api/auth/register | Register user |
| POST   | /api/auth/login    | Login user    |

### Tables

| Method | Endpoint                 | Description               |
| ------ | ------------------------ | ------------------------- |
| POST   | `/api/tables/`           | Create a new table        |
| GET    | `/api/tables/`           | Get all user tables       |
| GET    | `/api/tables/:id`        | Get table by ID           |
| PUT    | `/api/tables/:id`        | Update table              |
| DELETE | `/api/tables/:id`        | Delete table              |
| GET    | `/api/tables/:id/export` | Export table (CSV / JSON) |

---

### Authentication Middleware

All table-related APIs are protected using JWT authentication middleware:

auth

Only logged-in users can:
* Create tables
* View tables
* Update tables
* Delete tables
* Export tables

---
### Export Functionality

📄 Export as CSV
* Users can download their table data in CSV format for use in Excel or other spreadsheet tools.

📄 Export as JSON
* Users can export tables as JSON for data storage, APIs, or analytics.

---

### Export API

The export endpoint supports:
* CSV format
* JSON format

GET /api/tables/5/export?type=csv
GET /api/tables/5/export?type=json

---
---

## 👨‍💻 Author

Developed by **Manay Rawal**
