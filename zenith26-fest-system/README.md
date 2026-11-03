# Zenith '26 College Fest Management System ⚡

A modern, full-stack college fest management web application built with **HTML + Tailwind CSS + JavaScript** on the frontend, **Python + FastAPI** on the backend, and **SQLite** for the database layer.

Built as the capstone project for **PM2-01 (How Software Works)** and **PM2-02 (Front-End, Back-End & Mobile)**.

---

## 🏛️ System Architecture

- **Frontend Client Layer:** HTML5, Tailwind CSS (responsive mobile-first design, cards, modals, filter pills, loading states), Vanilla JavaScript ES6 (Fetch API, DOM manipulation).
- **Backend Server Layer:** Python 3 + FastAPI, strict server-side validation ("Never Trust the Client"), RESTful API endpoints, CORS enabled.
- **Database Layer:** SQLite (`fest.db`), relational schema with foreign key constraints, live computed capacity utilization (`available_seats = capacity - count(registrations)`).
- **Data Import / Seeding:** `backend/seed_data.py` reads `data/events_seed.xlsx` using `openpyxl` to seed 14 fest events idempotently.

---

## 🚀 How to Run the Application

### 1. Prerequisites
- Python 3.9+ installed on your system.

### 2. Setup Virtual Environment & Dependencies
```bash
cd zenith26-fest-system

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
# On macOS / Linux:
source venv/bin/activate
# On Windows:
# venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Seed the Database
Ensure `data/events_seed.xlsx` is present, then run:
```bash
python -m backend.seed_data
```
*(Note: FastAPI also automatically checks and seeds the database on startup!)*

### 4. Start the Full-Stack Server
```bash
uvicorn backend.main:app --reload --port 8000
```

### 5. Access the Applications in Your Browser
- **Student Event Portal:** [http://localhost:8000/](http://localhost:8000/)
- **Coordinator Admin Dashboard:** [http://localhost:8000/admin.html](http://localhost:8000/admin.html)
- **Interactive Swagger API Documentation:** [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc API Documentation:** [http://localhost:8000/redoc](http://localhost:8000/redoc)

---

## 📡 REST API Contract & Endpoints

| Method | Endpoint | Description | Status Codes |
|---|---|---|---|
| `GET` | `/api/events` | List all events (supports `?category=` & `?search=`) | `200 OK` |
| `GET` | `/api/events/{event_id}` | Retrieve single event detail with live available seats | `200 OK`, `404 Not Found` |
| `POST` | `/api/events/{event_id}/register` | Register student with server-side duplicate & capacity checks | `201 Created`, `400 Bad Request`, `409 Conflict`, `404 Not Found` |
| `GET` | `/api/registrations` | List registrations with joined event titles (`?event_id=` filter) | `200 OK` |
| `GET` | `/api/stats` | Live computed fest stats & category breakdown | `200 OK` |
| `POST` | `/api/events` *(Stretch)* | Admin creates new event with validation | `201 Created`, `400 Bad Request` |
| `DELETE`| `/api/registrations/{id}` *(Stretch)*| Admin cancels a student registration | `200 OK`, `404 Not Found` |

---

## 🧪 Automated & Postman Testing

- **Postman Collection:** `zenith26-api.postman_collection.json`
- **Postman Testing Guide:** `Postman-Testing-Commands-Zenith26.md`

Import `zenith26-api.postman_collection.json` into Postman to execute all 18 test cases verifying 200, 201, 400, 404, and 409 responses.

---

## 📂 Project Structure

```text
zenith26-fest-system/
├── backend/
│   ├── database.py       # SQLite connection and schema setup (events, registrations)
│   ├── models.py         # Pydantic schemas (EventOut, RegistrationIn, StatsOut, etc.)
│   ├── seed_data.py      # Spreadsheet loader reading data/events_seed.xlsx
│   └── main.py           # FastAPI app, API routes, and static file serving
├── frontend/
│   ├── index.html        # Student event discovery portal & registration modal
│   ├── admin.html        # Fest coordinator live metrics & utilization dashboard
│   └── js/
│       ├── app.js        # Student portal client logic & API integration
│       └── admin.js      # Admin dashboard metrics, sorting & cancellation logic
├── data/
│   └── events_seed.xlsx  # 14 seed events spreadsheet
├── fest.db               # SQLite database file
├── requirements.txt      # Python dependencies (fastapi, uvicorn, pydantic, openpyxl)
├── zenith26-api.postman_collection.json # Postman collection
├── Postman-Testing-Commands-Zenith26.md  # 18-step testing checklist
└── README.md             # Project documentation
```
