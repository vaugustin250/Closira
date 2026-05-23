import uuid
from datetime import datetime, timezone
from sqlalchemy import String, Text, DateTime, ForeignKey, Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
import enum

from app.core.database import Base


def utcnow() -> datetime:
    return datetime.now(timezone.utc).replace(tzinfo=None)


class Channel(str, enum.Enum):
    whatsapp = "whatsapp"
    email = "email"
    call = "call"


class EnquiryStatus(str, enum.Enum):
    pending = "pending"       # just created, task not yet processed
    processing = "processing" # background task is running
    open = "open"             # SOP matched, response ready
    follow_up = "follow_up"   # follow-up scheduled
    escalated = "escalated"   # escalated to human agent
    resolved = "resolved"     # closed


class Enquiry(Base):
    __tablename__ = "enquiries"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    customer_name: Mapped[str] = mapped_column(String(255), nullable=False)
    channel: Mapped[Channel] = mapped_column(SAEnum(Channel), nullable=False)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    status: Mapped[EnquiryStatus] = mapped_column(SAEnum(EnquiryStatus), default=EnquiryStatus.pending)

    # SOP matching results (filled by background task)
    matched_sop: Mapped[str | None] = mapped_column(String(100), nullable=True)
    suggested_response: Mapped[str | None] = mapped_column(Text, nullable=True)

    # Escalation
    escalation_reason: Mapped[str | None] = mapped_column(Text, nullable=True)

    # Follow-up
    followup_delay_minutes: Mapped[int | None] = mapped_column(nullable=True)
    followup_message_template: Mapped[str | None] = mapped_column(Text, nullable=True)
    followup_due_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow, onupdate=utcnow)

    timeline: Mapped[list["TimelineEvent"]] = relationship(
        "TimelineEvent", back_populates="enquiry", order_by="TimelineEvent.created_at"
    )


class TimelineEvent(Base):
    __tablename__ = "timeline_events"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    enquiry_id: Mapped[str] = mapped_column(ForeignKey("enquiries.id"), nullable=False)
    event_type: Mapped[str] = mapped_column(String(50), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    metadata_json: Mapped[str | None] = mapped_column(Text, nullable=True)  # JSON string
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow)

    enquiry: Mapped["Enquiry"] = relationship("Enquiry", back_populates="timeline")
