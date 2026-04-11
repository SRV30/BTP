from fastapi import FastAPI

from .db import get_mongo_connection
from .routes.core import router as core_router

app = FastAPI(title="MoodSense AI", version="1.0.0")
app.include_router(core_router)


@app.on_event("startup")
def startup_event() -> None:
    mongo = get_mongo_connection()
    mongo.ensure_users_collection()
