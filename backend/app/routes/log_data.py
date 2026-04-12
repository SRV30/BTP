from datetime import datetime, timezone

from fastapi import APIRouter, Depends

from ..auth.dependencies import get_current_user
from ..db import get_mongo_connection
from ..models.daily_log import build_daily_log_document
from ..mood_engine import calculate_emotions, determine_mood
from ..schemas.logs import LogDataRequest, LogDataResponse

router = APIRouter(tags=["Daily Logs"])


@router.post("/log-data", response_model=LogDataResponse)
async def log_data(payload: LogDataRequest, current_user: dict = Depends(get_current_user)) -> LogDataResponse:
    emotions = calculate_emotions(
        screen_time=payload.screen_time,
        steps=payload.steps,
        sleep=payload.sleep,
        streak=payload.streak,
    )
    mood = determine_mood(emotions)
    today = datetime.now(timezone.utc).date()
    user_id = str(current_user.get("_id"))

    daily_log = build_daily_log_document(
        user_id=user_id,
        log_date=today,
        screen_time=payload.screen_time,
        steps=payload.steps,
        sleep=payload.sleep,
        streak=payload.streak,
        emotions=emotions,
        mood=mood,
    )

    mongo = get_mongo_connection()
    mongo.get_daily_logs_collection().update_one(
        {"user_id": user_id, "date": today.isoformat()},
        {"$set": daily_log},
        upsert=True,
    )

    return LogDataResponse(
        message="Daily log saved successfully",
        mood=mood,
        emotions=emotions,
        date=today,
    )
