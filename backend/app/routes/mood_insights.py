from datetime import datetime, timedelta, timezone
from typing import Any

from fastapi import APIRouter, Depends

from ..auth.dependencies import get_current_user
from ..db import get_mongo_connection
from ..ml_pipeline import load_or_train_model

router = APIRouter(tags=["Mood Insights"])


async def _get_mood_history(user_id: str, days: int) -> list[dict[str, Any]]:
    end_date = datetime.now(timezone.utc).date()
    start_date = end_date - timedelta(days=days - 1)

    mongo = get_mongo_connection()
    cursor = mongo.get_daily_logs_collection().find(
        {
            "user_id": user_id,
            "date": {"$gte": start_date.isoformat(), "$lte": end_date.isoformat()},
        },
        {
            "_id": 0,
            "date": 1,
            "emotions": 1,
            "mood": 1,
        },
    ).sort("date", 1)

    results: list[dict[str, Any]] = []
    for row in cursor:
        emotions = row.get("emotions", {})
        emotion_percentages = {k: round(float(v) * 100, 2) for k, v in emotions.items()}
        results.append(
            {
                "date": row.get("date"),
                "emotion_percentages": emotion_percentages,
                "mood": row.get("mood"),
            }
        )
    return results


@router.get("/mood/7days")
async def mood_last_7_days(current_user: dict = Depends(get_current_user)) -> dict[str, Any]:
    user_id = str(current_user.get("_id"))
    history = await _get_mood_history(user_id=user_id, days=7)
    return {"range_days": 7, "data": history}


@router.get("/mood/30days")
async def mood_last_30_days(current_user: dict = Depends(get_current_user)) -> dict[str, Any]:
    user_id = str(current_user.get("_id"))
    history = await _get_mood_history(user_id=user_id, days=30)
    return {"range_days": 30, "data": history}


@router.get("/today")
async def today_mood(current_user: dict = Depends(get_current_user)) -> dict[str, Any]:
    user_id = str(current_user.get("_id"))
    today = datetime.now(timezone.utc).date().isoformat()

    mongo = get_mongo_connection()
    doc = mongo.get_daily_logs_collection().find_one(
        {"user_id": user_id, "date": today},
        {
            "_id": 0,
            "date": 1,
            "mood": 1,
            "emotions": 1,
        },
    )

    if not doc:
        return {
            "date": today,
            "mood": None,
            "top_emotions": [],
            "message": "No log found for today",
        }

    emotions = doc.get("emotions", {})
    sorted_emotions = sorted(emotions.items(), key=lambda item: item[1], reverse=True)
    top_emotions = [
        {"emotion": name, "percentage": round(float(score) * 100, 2)}
        for name, score in sorted_emotions[:3]
    ]

    return {
        "date": doc.get("date"),
        "mood": doc.get("mood"),
        "top_emotions": top_emotions,
    }


@router.get("/predict-next-day")
async def predict_next_day(current_user: dict = Depends(get_current_user)) -> dict[str, Any]:
    user_id = str(current_user.get("_id"))

    mongo = get_mongo_connection()
    latest_log = mongo.get_daily_logs_collection().find_one(
        {"user_id": user_id},
        {"_id": 0, "screen_time": 1, "steps": 1, "sleep": 1, "streak": 1, "date": 1},
        sort=[("date", -1)],
    )

    if not latest_log:
        return {
            "message": "No historical logs found. Add at least one log to predict the next day.",
            "predicted_emotions": {},
            "predicted_mood": None,
        }

    predictor = load_or_train_model()
    prediction = predictor.predict(
        screen_time=float(latest_log.get("screen_time", 0.0)),
        steps=int(latest_log.get("steps", 0)),
        sleep=float(latest_log.get("sleep", 0.0)),
        streak=int(latest_log.get("streak", 0)),
    )

    return {
        "based_on_date": latest_log.get("date"),
        **prediction,
    }
