import os
from pathlib import Path
import openpyxl
from backend.database import get_db_connection, init_db

BASE_DIR = Path(__file__).resolve().parent.parent
SEED_FILE_PATH = BASE_DIR / "data" / "events_seed.xlsx"

def seed_events():
    """
    Seeds the events table from data/events_seed.xlsx if the table is currently empty.
    Raises FileNotFoundError if data/events_seed.xlsx is missing.
    """
    # Ensure database schema is created
    init_db()

    conn = get_db_connection()
    cursor = conn.cursor()

    # Check if events table already has rows
    cursor.execute("SELECT COUNT(*) AS count FROM events;")
    row = cursor.fetchone()
    count = row["count"] if row else 0

    if count > 0:
        print(f"Skipping seed: events table already contains {count} rows.")
        conn.close()
        return

    # Check if seed file exists
    if not SEED_FILE_PATH.exists():
        conn.close()
        raise FileNotFoundError(
            f"Seed file not found at {SEED_FILE_PATH}. "
            "Please copy the provided events_seed.xlsx file into the data/ folder before running this script."
        )

    print(f"Reading seed data from {SEED_FILE_PATH}...")
    wb = openpyxl.load_workbook(SEED_FILE_PATH)
    if "Events" not in wb.sheetnames:
        conn.close()
        raise ValueError("The seed file must contain an 'Events' sheet.")

    ws = wb["Events"]

    # Header verification
    expected_headers = ['id', 'title', 'category', 'description', 'event_date', 'event_time', 'venue', 'capacity', 'fee', 'icon']
    header_row = [cell.value for cell in ws[1]]
    if [h.lower() if isinstance(h, str) else h for h in header_row[:10]] != expected_headers:
        print(f"Warning: Header row is {header_row}, expected {expected_headers}")

    # Read events
    inserted_count = 0
    for row_idx in range(2, ws.max_row + 1):
        row_values = [ws.cell(row=row_idx, column=col_idx).value for col_idx in range(1, 11)]
        # Skip completely empty rows
        if not any(row_values):
            continue

        event_id, title, category, description, event_date, event_time, venue, capacity, fee, icon = row_values
        cursor.execute("""
            INSERT INTO events (id, title, category, description, event_date, event_time, venue, capacity, fee, icon)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        """, (
            int(event_id) if event_id is not None else None,
            str(title) if title is not None else "",
            str(category) if category is not None else "",
            str(description) if description is not None else "",
            str(event_date) if event_date is not None else "",
            str(event_time) if event_time is not None else "",
            str(venue) if venue is not None else "",
            int(capacity) if capacity is not None else 0,
            int(fee) if fee is not None else 0,
            str(icon) if icon is not None else ""
        ))
        inserted_count += 1

    conn.commit()
    conn.close()
    print(f"Successfully seeded {inserted_count} events from {SEED_FILE_PATH} into fest.db.")

def show_events():
    """
    Displays the contents of the events table.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, title, category, event_date, event_time, venue, capacity, fee, icon FROM events ORDER BY id ASC;")
    rows = cursor.fetchall()
    print(f"\n--- Events in Database ({len(rows)} rows) ---")
    for r in rows:
        print(f"ID: {r['id']:<2} | {r['icon']} {r['title']:<25} | {r['category']:<10} | {r['event_date']} {r['event_time']} | {r['venue']:<18} | Cap: {r['capacity']:<3} | Fee: ₹{r['fee']}")
    conn.close()

if __name__ == "__main__":
    seed_events()
    show_events()
