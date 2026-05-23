"""
Enquiry Service
---------------
All database interactions and business-logic for enquiries live here.
The API layer only calls these functions — no ORM queries in routes.
"""
import json
from datetime import datetime, timezone, timedelta
from typing import Optional

from sqlalchemy import select
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.enquiry import Enquiry, TimelineEvent, EnquiryStatus
from app.core.logging import get_logger

logger = get_logger(__name__)


def _utcnow() -> datetime:
    return datetime.now(timezone.utc).replace(tzinfo=None)


async def _add_timeline_event(
    db: AsyncSession,
    enquiry_id: str,
    event_type: str,
    description: str,
    metadata: Optional[dict] = None,
) -> TimelineEvent:
    event = TimelineEvent(
        enquiry_id=enquiry_id,
        event_type=event_type,
        description=description,
        metadata_json=json.dumps(metadata) if metadata else None,
    )
    db.add(event)
    return event


async def create_enquiry(
    db: AsyncSession,
    customer_name: str,
    channel: str,
    message: str,
) -> Enquiry:
    enquiry = Enquiry(
        customer_name=customer_name,
        channel=channel,
        message=message,
        status=EnquiryStatus.pending,
    )
    db.add(enquiry)
    await db.flush()  # get the ID without committing

    await _add_timeline_event(
        db, enquiry.id,
        event_type="enquiry_created",
        description=f"Enquiry received via {channel} from {customer_name}.",
        metadata={"channel": channel, "message_preview": message[:80]},
    )
    await db.commit()
    await db.refresh(enquiry)

    logger.info(
        "Enquiry created",
        extra={"enquiry_id": enquiry.id, "channel": channel, "customer": customer_name},
    )
    return enquiry


async def get_enquiry(db: AsyncSession, enquiry_id: str) -> Optional[Enquiry]:
    result = await db.execute(
        select(Enquiry)
        .options(selectinload(Enquiry.timeline))
        .where(Enquiry.id == enquiry_id)
    )
    return result.scalar_one_or_none()


async def process_enquiry_sop(db: AsyncSession, enquiry_id: str) -> None:
    """
    Called by the background task. Matches SOP and updates the record.
    """
    from app.services.sop_matcher import match_sop  # local import to avoid circular deps

    enquiry = await get_enquiry(db, enquiry_id)
    if not enquiry:
        logger.error("Background task: enquiry not found", extra={"enquiry_id": enquiry_id})
        return

    enquiry.status = EnquiryStatus.processing
    await db.commit()

    match = match_sop(enquiry.message)

    if match:
        enquiry.matched_sop = match.sop_name
        enquiry.suggested_response = match.suggested_response
        enquiry.status = EnquiryStatus.open

        await _add_timeline_event(
            db, enquiry_id,
            event_type="sop_matched",
            description=f"Matched SOP: '{match.sop_name}'. Suggested response generated.",
            metadata={"sop_id": match.sop_id, "sop_name": match.sop_name},
        )
        logger.info(
            "SOP matched",
            extra={"enquiry_id": enquiry_id, "sop": match.sop_id},
        )
    else:
        # No SOP matched — auto-escalate
        enquiry.status = EnquiryStatus.escalated
        enquiry.escalation_reason = "No SOP matched the inbound message. Requires human review."

        await _add_timeline_event(
            db, enquiry_id,
            event_type="auto_escalated",
            description="No SOP matched. Enquiry automatically escalated for human review.",
            metadata={"reason": "no_sop_match"},
        )
        logger.warning(
            "No SOP matched — auto-escalated",
            extra={"enquiry_id": enquiry_id},
        )

    await db.commit()


async def schedule_followup(
    db: AsyncSession,
    enquiry_id: str,
    delay_minutes: int,
    message_template: Optional[str],
) -> Optional[Enquiry]:
    enquiry = await get_enquiry(db, enquiry_id)
    if not enquiry:
        return None

    if enquiry.status == EnquiryStatus.escalated:
        # Can still schedule follow-ups on escalated enquiries
        pass
    elif enquiry.status not in (EnquiryStatus.open, EnquiryStatus.follow_up):
        return None  # Caller will return 409

    due_at = _utcnow() + timedelta(minutes=delay_minutes)
    enquiry.followup_delay_minutes = delay_minutes
    enquiry.followup_message_template = message_template
    enquiry.followup_due_at = due_at
    enquiry.status = EnquiryStatus.follow_up

    await _add_timeline_event(
        db, enquiry_id,
        event_type="followup_scheduled",
        description=f"Follow-up scheduled in {delay_minutes} minutes (due at {due_at.isoformat()}).",
        metadata={"delay_minutes": delay_minutes, "due_at": due_at.isoformat()},
    )
    await db.commit()
    await db.refresh(enquiry)

    logger.info(
        "Follow-up scheduled",
        extra={"enquiry_id": enquiry_id, "delay_minutes": delay_minutes, "due_at": due_at.isoformat()},
    )
    return enquiry


async def escalate_enquiry(
    db: AsyncSession,
    enquiry_id: str,
    reason: str,
) -> Optional[Enquiry]:
    enquiry = await get_enquiry(db, enquiry_id)
    if not enquiry:
        return None

    enquiry.status = EnquiryStatus.escalated
    enquiry.escalation_reason = reason

    await _add_timeline_event(
        db, enquiry_id,
        event_type="escalated",
        description=f"Manually escalated to human agent. Reason: {reason}",
        metadata={"reason": reason},
    )
    await db.commit()
    await db.refresh(enquiry)

    logger.warning(
        "Enquiry escalated",
        extra={"enquiry_id": enquiry_id, "reason": reason},
    )
    return enquiry
