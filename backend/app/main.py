from fastapi import FastAPI

from .auth.routes import router as auth_router
from .db import get_mongo_connection
from .routes.core import router as core_router
from .routes.log_data import router as log_data_router
from .routes.mood_insights import router as mood_insights_router

app = FastAPI(title="MoodSense AI", version="4.0.0")
app.include_router(core_router)
app.include_router(auth_router)
app.include_router(log_data_router)
app.include_router(mood_insights_router)


@app.on_event("startup")
def startup_event() -> None:
    mongo = get_mongo_connection()
    mongo.ensure_users_collection()
    mongo.ensure_daily_logs_collection()
