from fastapi import FastAPI

from .auth.routes import router as auth_router
from .db import get_mongo_connection
from .routes.core import router as core_router

app = FastAPI(title="MoodSense AI", version="2.0.0")
app.include_router(core_router)
app.include_router(auth_router)


@app.on_event("startup")
def startup_event() -> None:
    mongo = get_mongo_connection()
    mongo.ensure_users_collection()
