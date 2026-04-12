from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends

from ..auth.dependencies import get_current_user
from ..db import get_mongo_connection
from ..models.daily_log import build_daily_log_document
from ..mood_engine import calculate_emotions, determine_mood
from ..schemas.logs import LogDataRequest, LogDataResponse

router = APIRouter(tags=["Daily Logs"])



def _compute_personal_baseline(user_id: str, days: int = 14) -> dict[str, float] | None:
    mongo = get_mongo_connection()
    end_date = datetime.now(timezone.utc).date()
    start_date = end_date - timedelta(days=days)

    cursor = mongo.get_daily_logs_collection().find(
        {
            "user_id": user_id,
            "date": {"$gte": start_date.isoformat(), "$lt": end_date.isoformat()},
        },
        {"_id": 0, "screen_time": 1, "sleep": 1, "steps": 1},
    )

    rows = list(cursor)
    if not rows:
        return None

    return {
        "avg_screen_time": sum(float(row.get("screen_time", 0.0)) for row in rows) / len(rows),
        "avg_sleep": sum(float(row.get("sleep", 0.0)) for row in rows) / len(rows),
        "avg_steps": sum(float(row.get("steps", 0.0)) for row in rows) / len(rows),
    }


@router.post("/log-data", response_model=LogDataResponse)
async def log_data(payload: LogDataRequest, current_user: dict = Depends(get_current_user)) -> LogDataResponse:
    user_id = str(current_user.get("_id"))
    baseline = _compute_personal_baseline(user_id=user_id)

    emotions = calculate_emotions(
        screen_time=payload.screen_time,
        steps=payload.steps,
        sleep=payload.sleep,
        streak=payload.streak,
        disability=bool(current_user.get("disability", False)),
        gender=current_user.get("gender"),
        menstruation_cycle=bool(current_user.get("menstruation_cycle", False)),
        baseline=baseline,
    )
    mood = determine_mood(emotions)
    today = datetime.now(timezone.utc).date()

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
