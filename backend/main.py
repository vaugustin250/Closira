from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.core.database import init_db
from app.core.logging import get_logger
from app.api import enquiry, health

logger = get_logger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialise the database on startup."""
    logger.info("Starting Closira API", extra={"version": settings.APP_VERSION})
    await init_db()
    yield
    logger.info("Shutting down Closira API")


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description=(
        "## Closira Enquiry-Handling API\n\n"
        "A lightweight backend service that simulates Closira's core customer enquiry pipeline.\n\n"
        "### Features\n"
        "- **Inbound enquiry intake** across WhatsApp, Email, and Call channels\n"
        "- **Async SOP matching** — background task classifies each message and generates a suggested response\n"
        "- **Follow-up scheduling** with configurable delay and message templates\n"
        "- **Escalation management** — manual or automatic (no SOP match)\n"
        "- **Full history & timeline** for every enquiry\n"
        "- **Structured JSON logging** for all key events\n\n"
        "All data is stored in SQLite (configurable to PostgreSQL via `DATABASE_URL`)."
    ),
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    logger.error(
        f"Unhandled exception: {type(exc).__name__}",
        extra={"path": request.url.path, "error": str(exc)},
        exc_info=True,
    )
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error. Check logs for details."},
    )


# Include routers
app.include_router(health.router)
app.include_router(enquiry.router)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
