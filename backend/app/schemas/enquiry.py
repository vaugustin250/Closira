from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, Field


class TimelineEventSchema(BaseModel):
    id: str
    enquiry_id: str
    event_type: str
    description: str
    metadata_json: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class EnquiryCreate(BaseModel):
    customer_name: str = Field(..., min_length=1, max_length=255)
    channel: str = Field(..., description="One of: whatsapp, email, call")
    message: str = Field(..., min_length=1)


class EnquiryCreatedResponse(BaseModel):
    job_id: str
    status: str
    message: str


class EnquiryDetail(BaseModel):
    id: str
    customer_name: str
    channel: str
    message: str
    status: str
    matched_sop: Optional[str] = None
    suggested_response: Optional[str] = None
    escalation_reason: Optional[str] = None
    followup_delay_minutes: Optional[int] = None
    followup_message_template: Optional[str] = None
    followup_due_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    timeline: List[TimelineEventSchema] = []

    class Config:
        from_attributes = True


class FollowUpSchedule(BaseModel):
    delay_minutes: int = Field(..., ge=1, le=43200)  # max 30 days
    message_template: Optional[str] = None


class EscalationRequest(BaseModel):
    reason: str = Field(..., min_length=5)


class HealthResponse(BaseModel):
    status: str
    db: str
    version: str
