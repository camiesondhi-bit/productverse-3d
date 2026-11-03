# Postman Testing Guide — Zenith '26 Fest Management System API

**Target Server:** `http://localhost:8000`  
**FastAPI Interactive Swagger Docs:** `http://localhost:8000/docs`  
**FastAPI ReDoc:** `http://localhost:8000/redoc`  
**Postman Collection File:** `zenith26-api.postman_collection.json`

---

## 1. Quick Setup in Postman Desktop

1. **Open Postman**: Launch Postman (or use the web version / Postman agent).
2. **Import Collection**:
   - Click **Import** (top left).
   - Drag and drop `zenith26-api.postman_collection.json`.
3. **Verify Collection Variable**:
   - Click on the collection name **Zenith '26 Fest Management System API**.
   - Under the **Variables** tab, verify `baseUrl` is set to `http://localhost:8000`.
4. **Start the FastAPI Server**:
   ```bash
   cd zenith26-fest-system
   ./venv/bin/uvicorn backend.main:app --reload --port 8000
   ```

---

## 2. Test Execution Matrix (18 Test Scenarios)

| # | Folder | Method | Endpoint / Route | Scenario Description | Expected HTTP Status |
|---|--------|--------|------------------|----------------------|----------------------|
| 1 | Events | `GET` | `/api/events` | List all fest events | `200 OK` |
| 2 | Events | `GET` | `/api/events?category=Technical` | Filter by category | `200 OK` |
| 3 | Events | `GET` | `/api/events?search=code` | Search title (case-insensitive) | `200 OK` |
| 4 | Events | `GET` | `/api/events?category=Technical&search=sprint` | Combined filter & search | `200 OK` |
| 5 | Events | `GET` | `/api/events/1` | Get event detail by valid ID | `200 OK` |
| 6 | Events | `GET` | `/api/events/999` | Get event with non-existent ID | `404 Not Found` |
| 7 | Registrations | `POST` | `/api/events/1/register` | Valid new registration | `201 Created` |
| 8 | Registrations | `POST` | `/api/events/1/register` | Duplicate registration (same email) | `409 Conflict` |
| 9 | Registrations | `POST` | `/api/events/1/register` | Missing student name | `400 Bad Request` |
| 10 | Registrations | `POST` | `/api/events/1/register` | Missing roll number | `400 Bad Request` |
| 11 | Registrations | `POST` | `/api/events/1/register` | Missing email | `400 Bad Request` |
| 12 | Registrations | `POST` | `/api/events/1/register` | Invalid email (no `@`) | `400 Bad Request` |
| 13 | Registrations | `POST` | `/api/events/999/register` | Register for non-existent event | `404 Not Found` |
| 14 | Registrations | `GET` | `/api/registrations` | List all registrations (with event titles) | `200 OK` |
| 15 | Registrations | `GET` | `/api/registrations?event_id=1` | Filter registrations by event ID | `200 OK` |
| 16 | Admin / Stats | `GET` | `/api/stats` | Fest dashboard live metrics | `200 OK` |
| 17 | Stretch Goal | `POST` | `/api/events` | Admin creates new event | `201 Created` |
| 18 | Stretch Goal | `DELETE` | `/api/registrations/{id}` | Admin cancels registration | `200 OK` |

---

## 3. Detailed Request Bodies & Expected Responses

### Request 1: GET All Events
- **Method:** `GET`
- **URL:** `http://localhost:8000/api/events`
- **Expected Status:** `200 OK`
- **Expected Response Shape:**
```json
[
  {
    "id": 1,
    "title": "Code Sprint 2.0",
    "category": "Technical",
    "description": "High-speed competitive programming hackathon...",
    "event_date": "2026-11-14",
    "event_time": "10:00 AM",
    "venue": "Main Auditorium",
    "capacity": 100,
    "fee": 0,
    "icon": "💻",
    "available_seats": 100
  }
]
```

---

### Request 7: POST Valid Registration
- **Method:** `POST`
- **URL:** `http://localhost:8000/api/events/1/register`
- **Headers:** `Content-Type: application/json`
- **Request Body:**
```json
{
  "student_name": "Aarav Sharma",
  "roll_number": "23CS101",
  "email": "aarav.sharma@college.edu",
  "phone": "+91 9876543210"
}
```
- **Expected Status:** `201 Created`
- **Expected Response:**
```json
{
  "id": 1,
  "event_id": 1,
  "student_name": "Aarav Sharma",
  "registered_at": "2026-10-13 16:00:00"
}
```

---

### Request 8: Duplicate Registration (Same Email & Event)
- **Method:** `POST`
- **URL:** `http://localhost:8000/api/events/1/register`
- **Headers:** `Content-Type: application/json`
- **Request Body:** (Resend identical body as Request 7)
- **Expected Status:** `409 Conflict`
- **Expected Response:**
```json
{
  "detail": "Already registered"
}
```

---

### Request 12: Invalid Email Validation
- **Method:** `POST`
- **URL:** `http://localhost:8000/api/events/1/register`
- **Request Body:**
```json
{
  "student_name": "Priya Singh",
  "roll_number": "23IT044",
  "email": "invalidemailaddress"
}
```
- **Expected Status:** `400 Bad Request`
- **Expected Response:**
```json
{
  "detail": "Invalid email address: must contain '@'"
}
```

---

### Request 16: Live Dashboard Stats
- **Method:** `GET`
- **URL:** `http://localhost:8000/api/stats`
- **Expected Status:** `200 OK`
- **Expected Response Shape:**
```json
{
  "total_events": 14,
  "total_registrations": 1,
  "total_capacity": 1487,
  "overall_utilization_pct": 0.1,
  "upcoming_events_count": 14,
  "events_by_category": {
    "Cultural": 5,
    "Technical": 4,
    "Sports": 2,
    "Workshop": 2,
    "Gaming": 1
  }
}
```

---

### Request 18: Admin Cancellation (Stretch Goal)
- **Method:** `DELETE`
- **URL:** `http://localhost:8000/api/registrations/1`
- **Expected Status:** `200 OK`
- **Expected Response:**
```json
{
  "message": "Registration for 'Aarav Sharma' successfully cancelled.",
  "id": 1,
  "event_id": 1
}
```
