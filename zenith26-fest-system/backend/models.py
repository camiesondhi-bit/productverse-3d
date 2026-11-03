from typing import Optional, Dict
from pydantic import BaseModel, Field

class EventOut(BaseModel):
    id: int
    title: str
    category: str
    description: Optional[str] = None
    event_date: str
    event_time: str
    venue: str
    capacity: int
    fee: int
    icon: Optional[str] = None
    available_seats: int

class EventDetail(EventOut):
    pass

class RegistrationIn(BaseModel):
    student_name: str
    roll_number: str
    email: str
    phone: Optional[str] = None

class RegistrationOut(BaseModel):
    id: int
    event_id: int
    student_name: str
    registered_at: str

class RegistrationWithEventOut(BaseModel):
    id: int
    event_id: int
    event_title: str
    student_name: str
    roll_number: str
    email: str
    phone: Optional[str] = None
    registered_at: str

class StatsOut(BaseModel):
    total_events: int
    total_registrations: int
    total_capacity: int
    overall_utilization_pct: float
    upcoming_events_count: int
    events_by_category: Dict[str, int]

# Stretch Goal Model: Creating a new event
class EventCreate(BaseModel):
    title: str
    category: str
    description: Optional[str] = None
    event_date: str
    event_time: str
    venue: str
    capacity: int
    fee: int = 0
    icon: Optional[str] = "🎪"
