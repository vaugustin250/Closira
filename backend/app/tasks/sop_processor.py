"""
Background Task Runner
-----------------------
We use FastAPI's built-in BackgroundTasks instead of Celery.

Why FastAPI BackgroundTasks over Celery?
-----------------------------------------
Celery is the right call when you need:
  • Distributed task queues across multiple worker processes/machines
  • Retry logic with exponential back-off
  • Task scheduling (beat scheduler)
  • Result persistence and task introspection at scale

For this project, FastAPI BackgroundTasks is the better trade-off because:
  • Zero extra infrastructure — no Redis/RabbitMQ broker required to run the project
  • The assignment SOP-matching logic is lightweight (CPU ms, not seconds)
  • A single-process dev setup is far easier to review and run locally
  • We store all state in the DB, so task results are durable without a Celery backend

If this were a production multi-tenant system processing thousands of enquiries per
minute, I would switch to Celery + Redis and add per-tenant rate limiting. The service
layer (`process_enquiry_sop`) is already self-contained so that migration would only
require wrapping it in a `@celery.task`.
"""

import asyncio
from app.core.database import AsyncSessionLocal
from app.services.enquiry_service import process_enquiry_sop
from app.core.logging import get_logger

logger = get_logger(__name__)


async def run_sop_processing(enquiry_id: str) -> None:
    """
    Async background task: open a fresh DB session and run SOP matching.
    FastAPI's BackgroundTasks runs this after the HTTP response is sent.
    """
    logger.info("Background task started", extra={"enquiry_id": enquiry_id})
    async with AsyncSessionLocal() as db:
        try:
            await process_enquiry_sop(db, enquiry_id)
        except Exception as exc:
            logger.error(
                "Background task failed",
                extra={"enquiry_id": enquiry_id, "error": str(exc)},
                exc_info=True,
            )
    logger.info("Background task completed", extra={"enquiry_id": enquiry_id})


def dispatch_sop_task(background_tasks, enquiry_id: str) -> None:
    """
    Enqueue the SOP processing task.
    The `background_tasks` parameter is FastAPI's BackgroundTasks instance.
    """
    background_tasks.add_task(run_sop_processing, enquiry_id)
