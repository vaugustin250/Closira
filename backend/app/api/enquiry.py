from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.schemas.enquiry import (
    EnquiryCreate,
    EnquiryCreatedResponse,
    EnquiryDetail,
    FollowUpSchedule,
    EscalationRequest,
)
from app.services import enquiry_service
from app.tasks.sop_processor import dispatch_sop_task
from app.models.enquiry import EnquiryStatus

router = APIRouter(prefix="/enquiry", tags=["Enquiries"])


@router.post(
    "",
    response_model=EnquiryCreatedResponse,
    status_code=status.HTTP_202_ACCEPTED,
    summary="Create a new inbound enquiry",
    description=(
        "Accepts an inbound customer enquiry from WhatsApp, Email, or a phone Call. "
        "Returns a `job_id` immediately and processes the enquiry asynchronously in the background — "
        "SOP matching, response generation, and auto-escalation if no SOP matches."
    ),
)
async def create_enquiry(
    payload: EnquiryCreate,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
):
    enquiry = await enquiry_service.create_enquiry(
        db,
        customer_name=payload.customer_name,
        channel=payload.channel,
        message=payload.message,
    )
    dispatch_sop_task(background_tasks, enquiry.id)

    return EnquiryCreatedResponse(
        job_id=enquiry.id,
        status=enquiry.status,
        message="Enquiry received. Processing in background.",
    )


@router.post(
    "/{enquiry_id}/followup",
    response_model=EnquiryDetail,
    summary="Schedule a follow-up for an open enquiry",
    description=(
        "Schedules a follow-up message for the specified enquiry. "
        "Only allowed when the enquiry is in `open`, `follow_up`, or `escalated` status."
    ),
)
async def schedule_followup(
    enquiry_id: str,
    payload: FollowUpSchedule,
    db: AsyncSession = Depends(get_db),
):
    enquiry = await enquiry_service.get_enquiry(db, enquiry_id)
    if not enquiry:
        raise HTTPException(status_code=404, detail=f"Enquiry '{enquiry_id}' not found.")

    if enquiry.status in (EnquiryStatus.pending, EnquiryStatus.processing):
        raise HTTPException(
            status_code=409,
            detail="Enquiry is still being processed. Please wait a moment and try again.",
        )
    if enquiry.status == EnquiryStatus.resolved:
        raise HTTPException(status_code=409, detail="Cannot schedule a follow-up for a resolved enquiry.")

    updated = await enquiry_service.schedule_followup(
        db,
        enquiry_id=enquiry_id,
        delay_minutes=payload.delay_minutes,
        message_template=payload.message_template,
    )
    if not updated:
        raise HTTPException(status_code=409, detail="Follow-up could not be scheduled in the current state.")

    return updated


@router.post(
    "/{enquiry_id}/escalate",
    response_model=EnquiryDetail,
    summary="Escalate an enquiry to a human agent",
    description=(
        "Marks the enquiry as escalated and records the reason. "
        "This can be called at any time regardless of current status."
    ),
)
async def escalate_enquiry(
    enquiry_id: str,
    payload: EscalationRequest,
    db: AsyncSession = Depends(get_db),
):
    enquiry = await enquiry_service.get_enquiry(db, enquiry_id)
    if not enquiry:
        raise HTTPException(status_code=404, detail=f"Enquiry '{enquiry_id}' not found.")

    updated = await enquiry_service.escalate_enquiry(db, enquiry_id=enquiry_id, reason=payload.reason)
    return updated


@router.get(
    "/{enquiry_id}/history",
    response_model=EnquiryDetail,
    summary="Get full history and status timeline for an enquiry",
    description=(
        "Returns the complete enquiry record including the full status timeline — "
        "every event from creation through SOP matching, follow-ups, and escalations."
    ),
)
async def get_enquiry_history(
    enquiry_id: str,
    db: AsyncSession = Depends(get_db),
):
    enquiry = await enquiry_service.get_enquiry(db, enquiry_id)
    if not enquiry:
        raise HTTPException(status_code=404, detail=f"Enquiry '{enquiry_id}' not found.")
    return enquiry
