import os
from datetime import datetime, date
from pathlib import Path
from typing import List, Optional, Dict
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from backend.database import get_db_connection, init_db
from backend.seed_data import seed_events
from backend.models import (
    EventOut,
    EventDetail,
    RegistrationIn,
    RegistrationOut,
    RegistrationWithEventOut,
    StatsOut,
    EventCreate
)

BASE_DIR = Path(__file__).resolve().parent.parent
FRONTEND_DIR = BASE_DIR / "frontend"

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB and seed data on startup
    init_db()
    try:
        seed_events()
    except Exception as e:
        print(f"Warning during seed: {e}")
    yield

app = FastAPI(
    title="Zenith '26 Fest Management System API",
    description="API for College Fest Management System (Events, Registrations, Stats)",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------- API ROUTES -----------------

@app.get("/api/events", response_model=List[EventOut], tags=["Events"])
def get_events(
    category: Optional[str] = Query(None, description="Filter by event category"),
    search: Optional[str] = Query(None, description="Search by title (case-insensitive)")
):
    """
    List events with optional category and search filters.
    Computes available_seats live as (capacity - registrations_count).
    """
    conn = get_db_connection()
    cursor = conn.cursor()

    query = """
        SELECT e.id, e.title, e.category, e.description, e.event_date, e.event_time,
               e.venue, e.capacity, e.fee, e.icon,
               (e.capacity - COUNT(r.id)) AS available_seats
        FROM events e
        LEFT JOIN registrations r ON e.id = r.event_id
        WHERE 1=1
    """
    params = []

    if category and category.lower() != "all":
        query += " AND LOWER(e.category) = LOWER(?)"
        params.append(category)

    if search and search.strip():
        query += " AND LOWER(e.title) LIKE LOWER(?)"
        params.append(f"%{search.strip()}%")

    query += " GROUP BY e.id ORDER BY e.id ASC"

    cursor.execute(query, params)
    rows = cursor.fetchall()
    conn.close()

    events = []
    for row in rows:
        events.append(EventOut(
            id=row["id"],
            title=row["title"],
            category=row["category"],
            description=row["description"],
            event_date=row["event_date"],
            event_time=row["event_time"],
            venue=row["venue"],
            capacity=row["capacity"],
            fee=row["fee"],
            icon=row["icon"],
            available_seats=max(0, row["available_seats"])
        ))
    return events


@app.get("/api/events/{event_id}", response_model=EventDetail, tags=["Events"])
def get_event_detail(event_id: int):
    """
    Returns single event details by event_id with live available_seats.
    Returns 404 if not found.
    """
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT e.id, e.title, e.category, e.description, e.event_date, e.event_time,
               e.venue, e.capacity, e.fee, e.icon,
               (e.capacity - COUNT(r.id)) AS available_seats
        FROM events e
        LEFT JOIN registrations r ON e.id = r.event_id
        WHERE e.id = ?
        GROUP BY e.id
    """, (event_id,))

    row = cursor.fetchone()
    conn.close()

    if not row:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Event with id {event_id} not found"
        )

    return EventDetail(
        id=row["id"],
        title=row["title"],
        category=row["category"],
        description=row["description"],
        event_date=row["event_date"],
        event_time=row["event_time"],
        venue=row["venue"],
        capacity=row["capacity"],
        fee=row["fee"],
        icon=row["icon"],
        available_seats=max(0, row["available_seats"])
    )


@app.post("/api/events/{event_id}/register", response_model=RegistrationOut, status_code=status.HTTP_201_CREATED, tags=["Registrations"])
def register_for_event(event_id: int, payload: RegistrationIn):
    """
    Registers a student for an event. Performs strict server-side validation:
    - event_id must exist (404)
    - student_name, roll_number, email must not be empty (400)
    - email must contain '@' (400)
    - event must not be at capacity already (409)
    - same email must not already be registered for this event (409)
    """
    # 1. Input field emptiness validation
    student_name = payload.student_name.strip() if payload.student_name else ""
    roll_number = payload.roll_number.strip() if payload.roll_number else ""
    email = payload.email.strip().lower() if payload.email else ""
    phone = payload.phone.strip() if payload.phone else None

    if not student_name or not roll_number or not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Student name, roll number, and email are required"
        )

    # 2. Email format validation
    if "@" not in email or email.startswith("@") or email.endswith("@"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid email address: must contain '@'"
        )

    conn = get_db_connection()
    cursor = conn.cursor()

    # 3. Check event existence & available seats
    cursor.execute("""
        SELECT e.id, e.title, e.capacity, COUNT(r.id) AS registered_count
        FROM events e
        LEFT JOIN registrations r ON e.id = r.event_id
        WHERE e.id = ?
        GROUP BY e.id
    """, (event_id,))
    event_row = cursor.fetchone()

    if not event_row:
        conn.close()
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Event with id {event_id} not found"
        )

    capacity = event_row["capacity"]
    registered_count = event_row["registered_count"]

    if registered_count >= capacity:
        conn.close()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Event is full"
        )

    # 4. Check if student email is already registered for this event
    cursor.execute("""
        SELECT id FROM registrations
        WHERE event_id = ? AND LOWER(email) = LOWER(?)
    """, (event_id, email))
    existing_reg = cursor.fetchone()

    if existing_reg:
        conn.close()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Already registered"
        )

    # 5. Insert registration
    registered_at = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    try:
        cursor.execute("""
            INSERT INTO registrations (event_id, student_name, roll_number, email, phone, registered_at)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (event_id, student_name, roll_number, email, phone, registered_at))
        conn.commit()
        registration_id = cursor.lastrowid
    except Exception as e:
        conn.rollback()
        conn.close()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Registration failed: {str(e)}"
        )

    conn.close()
    return RegistrationOut(
        id=registration_id,
        event_id=event_id,
        student_name=student_name,
        registered_at=registered_at
    )


@app.get("/api/registrations", response_model=List[RegistrationWithEventOut], tags=["Registrations"])
def get_registrations(event_id: Optional[int] = Query(None, description="Filter registrations by event_id")):
    """
    Returns list of registrations, each including the event title.
    Optional event_id query param to filter for a single event.
    """
    conn = get_db_connection()
    cursor = conn.cursor()

    query = """
        SELECT r.id, r.event_id, e.title AS event_title, r.student_name,
               r.roll_number, r.email, r.phone, r.registered_at
        FROM registrations r
        JOIN events e ON r.event_id = e.id
        WHERE 1=1
    """
    params = []
    if event_id is not None:
        query += " AND r.event_id = ?"
        params.append(event_id)

    query += " ORDER BY r.id DESC"

    cursor.execute(query, params)
    rows = cursor.fetchall()
    conn.close()

    results = []
    for r in rows:
        results.append(RegistrationWithEventOut(
            id=r["id"],
            event_id=r["event_id"],
            event_title=r["event_title"],
            student_name=r["student_name"],
            roll_number=r["roll_number"],
            email=r["email"],
            phone=r["phone"],
            registered_at=r["registered_at"]
        ))
    return results


@app.get("/api/stats", response_model=StatsOut, tags=["Stats"])
def get_stats():
    """
    Returns admin dashboard statistics computed live from the database:
    - total_events
    - total_registrations
    - total_capacity
    - overall_utilization_pct (total_registrations / total_capacity * 100, rounded to 1 decimal)
    - upcoming_events_count (event_date today or later)
    - events_by_category (dict of category -> count)
    """
    conn = get_db_connection()
    cursor = conn.cursor()

    # Total events and total capacity
    cursor.execute("SELECT COUNT(*) AS total_events, COALESCE(SUM(capacity), 0) AS total_capacity FROM events;")
    event_stats = cursor.fetchone()
    total_events = event_stats["total_events"] if event_stats else 0
    total_capacity = event_stats["total_capacity"] if event_stats else 0

    # Total registrations
    cursor.execute("SELECT COUNT(*) AS total_regs FROM registrations;")
    reg_stats = cursor.fetchone()
    total_registrations = reg_stats["total_regs"] if reg_stats else 0

    # Overall utilization pct
    if total_capacity > 0:
        overall_utilization_pct = round((total_registrations / total_capacity) * 100, 1)
    else:
        overall_utilization_pct = 0.0

    # Upcoming events count (event_date >= today's date formatted as YYYY-MM-DD)
    today_str = date.today().strftime("%Y-%m-%d")
    cursor.execute("SELECT COUNT(*) AS upcoming FROM events WHERE event_date >= ?;", (today_str,))
    upcoming_row = cursor.fetchone()
    upcoming_events_count = upcoming_row["upcoming"] if upcoming_row else 0

    # Events by category
    cursor.execute("SELECT category, COUNT(*) AS count FROM events GROUP BY category ORDER BY count DESC;")
    cat_rows = cursor.fetchall()
    events_by_category: Dict[str, int] = {row["category"]: row["count"] for row in cat_rows}

    conn.close()

    return StatsOut(
        total_events=total_events,
        total_registrations=total_registrations,
        total_capacity=total_capacity,
        overall_utilization_pct=overall_utilization_pct,
        upcoming_events_count=upcoming_events_count,
        events_by_category=events_by_category
    )


# ----------------- STRETCH GOAL ENDPOINTS -----------------

@app.post("/api/events", response_model=EventOut, status_code=status.HTTP_201_CREATED, tags=["Admin Stretch Goals"])
def create_event(payload: EventCreate):
    """
    Stretch Goal: Admin creates a new event with full server-side validation.
    """
    title = payload.title.strip() if payload.title else ""
    category = payload.category.strip() if payload.category else ""
    event_date = payload.event_date.strip() if payload.event_date else ""
    event_time = payload.event_time.strip() if payload.event_time else ""
    venue = payload.venue.strip() if payload.venue else ""

    if not title or not category or not event_date or not event_time or not venue:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Title, category, event_date, event_time, and venue are all required."
        )

    if payload.capacity <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Capacity must be a positive integer greater than 0."
        )

    if payload.fee < 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Fee cannot be negative."
        )

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO events (title, category, description, event_date, event_time, venue, capacity, fee, icon)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        title,
        category,
        payload.description.strip() if payload.description else "",
        event_date,
        event_time,
        venue,
        payload.capacity,
        payload.fee,
        payload.icon or "🎪"
    ))
    conn.commit()
    new_id = cursor.lastrowid
    conn.close()

    return EventOut(
        id=new_id,
        title=title,
        category=category,
        description=payload.description,
        event_date=event_date,
        event_time=event_time,
        venue=venue,
        capacity=payload.capacity,
        fee=payload.fee,
        icon=payload.icon or "🎪",
        available_seats=payload.capacity
    )


@app.delete("/api/registrations/{registration_id}", tags=["Admin Stretch Goals"])
def delete_registration(registration_id: int):
    """
    Stretch Goal: Admin cancels/deletes a registration.
    """
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT id, event_id, student_name FROM registrations WHERE id = ?;", (registration_id,))
    reg = cursor.fetchone()

    if not reg:
        conn.close()
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Registration with id {registration_id} not found."
        )

    event_id = reg["event_id"]
    student_name = reg["student_name"]

    cursor.execute("DELETE FROM registrations WHERE id = ?;", (registration_id,))
    conn.commit()
    conn.close()

    return {
        "message": f"Registration for '{student_name}' successfully cancelled.",
        "id": registration_id,
        "event_id": event_id
    }


# ----------------- STATIC FILES & FRONTEND SERVING -----------------

# Mount frontend/js directory at /js so js files are reachable at /js/app.js, /js/admin.js
if (FRONTEND_DIR / "js").exists():
    app.mount("/js", StaticFiles(directory=FRONTEND_DIR / "js"), name="js")

@app.get("/", include_in_schema=False)
def serve_index():
    index_file = FRONTEND_DIR / "index.html"
    if index_file.exists():
        return FileResponse(index_file)
    return {"message": "frontend/index.html not found"}

@app.get("/index.html", include_in_schema=False)
def serve_index_html():
    return serve_index()

@app.get("/admin.html", include_in_schema=False)
def serve_admin_html():
    admin_file = FRONTEND_DIR / "admin.html"
    if admin_file.exists():
        return FileResponse(admin_file)
    return {"message": "frontend/admin.html not found"}

# Mount frontend directory for other assets like css, images, etc.
if FRONTEND_DIR.exists():
    app.mount("/static", StaticFiles(directory=FRONTEND_DIR), name="static")
