import logging
import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .auth.routes import router as auth_router
from .db import get_mongo_connection
from .routes.connections import router as connections_router
from .routes.core import router as core_router
from .routes.location_search import router as location_search_router
from .routes.log_data import router as log_data_router
from .routes.mood_insights import router as mood_insights_router
from .routes.profile import router as profile_router
from .scheduler import start_scheduler, stop_scheduler

app = FastAPI(title="MoodSense AI", version="13.0.0")
app.include_router(core_router)
app.include_router(connections_router)
app.include_router(auth_router)
app.include_router(log_data_router)
app.include_router(mood_insights_router)
app.include_router(profile_router)
app.include_router(location_search_router)

allowed_origins = [
    origin.strip()
    for origin in os.getenv("CORS_ALLOW_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173").split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logger = logging.getLogger(__name__)


@app.on_event("startup")
def startup_event() -> None:
    mongo = get_mongo_connection()
    mongo.ensure_users_collection()
    mongo.ensure_daily_logs_collection()
    start_scheduler()
    logger.info("Version 13 startup completed.")


@app.on_event("shutdown")
def shutdown_event() -> None:
    stop_scheduler()