from datetime import datetime, timedelta, timezone
from random import randint, uniform
from typing import Any

from fastapi import APIRouter, Depends

from ..auth.dependencies import get_current_user
from ..db import get_mongo_connection

router = APIRouter(tags=["Mood Insights"])


def _severity_from_percentage(score: float) -> str:
    if score < 35:
        return "low"
    if score < 65:
        return "moderate"
    return "high"


def _calculate_depression_score(logs: list[dict[str, Any]]) -> dict[str, Any]:
    if not logs:
        return {"percentage": 0.0, "severity": "low"}
    sadness_values = [float((day.get("emotion_percentages") or {}).get("Sadness", 0.0)) / 100.0 for day in logs]
    sleep_values = [float(day.get("sleep", 0.0)) for day in logs]
    steps_values = [float(day.get("steps", 0.0)) for day in logs]
    midpoint = max(1, len(sadness_values) // 2)
    sadness_trend = max(0.0, min(1.0, (sum(sadness_values[midpoint:]) / max(1, len(sadness_values[midpoint:]))) - (sum(sadness_values[:midpoint]) / len(sadness_values[:midpoint])) + 0.5))
    sleep_deficit = max(0.0, min(1.0, (8.0 - (sum(sleep_values) / len(sleep_values))) / 8.0))
    low_activity = max(0.0, min(1.0, (7000.0 - (sum(steps_values) / len(steps_values))) / 7000.0))
    percentage = round((0.35 * sadness_trend + 0.25 * sleep_deficit + 0.4 * low_activity) * 100.0, 2)
    return {"percentage": percentage, "severity": _severity_from_percentage(percentage)}


async def _get_mood_history(user_id: str, days: int) -> list[dict[str, Any]]:
    end_date = datetime.now(timezone.utc).date()
    start_date = end_date - timedelta(days=days - 1)
    mongo = get_mongo_connection()
    cursor = mongo.get_daily_logs_collection().find(
        {"user_id": user_id, "date": {"$gte": start_date.isoformat(), "$lte": end_date.isoformat()}},
        {"_id": 0, "date": 1, "emotions": 1, "mood": 1, "screen_time": 1, "sleep": 1, "steps": 1, "streak": 1},
    ).sort("date", 1)
    results: list[dict[str, Any]] = []
    for row in cursor:
        emotions = row.get("emotions", {})
        emotion_percentages = {k: round(float(v) * 100, 2) for k, v in emotions.items()}
        results.append({"date": row.get("date"), "emotion_percentages": emotion_percentages, "mood": row.get("mood"), "screen_time": float(row.get("screen_time", 0.0)), "sleep": float(row.get("sleep", 0.0)), "steps": int(row.get("steps", 0)), "streak": int(row.get("streak", 0))})
    return results


def _generate_mock_history(days: int) -> list[dict[str, Any]]:
    history = []
    for i in range(days):
        date_str = (datetime.now(timezone.utc).date() - timedelta(days=days - i - 1)).isoformat()
        joy = uniform(0.2, 0.5)
        calm = uniform(0.1, 0.3)
        stress = uniform(0.1, 0.25)
        sadness = max(0.05, 1 - joy - calm - stress)
        history.append({
            "date": date_str,
            "emotion_percentages": {"Joy": round(joy * 100, 2), "Calm": round(calm * 100, 2), "Stress": round(stress * 100, 2), "Sadness": round(sadness * 100, 2)},
            "mood": "Very Good" if joy > 0.4 else "Good",
            "screen_time": round(uniform(3.5, 6.5), 2),
            "sleep": round(uniform(6.5, 8.2), 2),
            "steps": randint(4000, 11000),
            "streak": randint(1, 30),
        })
    return history


@router.get("/dashboard-summary")
async def dashboard_summary(current_user: dict = Depends(get_current_user)) -> dict[str, Any]:
    user_id = str(current_user.get("_id"))
    history = await _get_mood_history(user_id=user_id, days=7)
    if not history:
        history = _generate_mock_history(7)

    today = history[-1]
    stress = today["emotion_percentages"].get("Stress", today["emotion_percentages"].get("Sadness", 20))

    return {
        "today": {
            "mood": today.get("mood"),
            "mood_score": max(1, min(100, int(today["emotion_percentages"].get("Joy", 50)))),
            "stress_level": round(stress, 1),
            "sleep_hours": today.get("sleep", 0),
            "steps": today.get("steps", 0),
            "screen_time": today.get("screen_time", 0),
            "emotions": today.get("emotion_percentages", {}),
        },
        "weekly_mood": [{"date": d["date"], "score": max(1, min(100, int(d["emotion_percentages"].get("Joy", 50))))} for d in history],
        "ai_insight": "You had a productive day. Keep sleep consistency and limit late-night screen usage for stronger mood stability.",
    }


@router.get("/mood/7days")
async def mood_last_7_days(current_user: dict = Depends(get_current_user)) -> dict[str, Any]:
    history = await _get_mood_history(user_id=str(current_user.get("_id")), days=7)
    return {"range_days": 7, "data": [{"date": d["date"], "emotion_percentages": d["emotion_percentages"], "mood": d["mood"]} for d in history]}


@router.get("/ai-insights")
async def ai_insights(current_user: dict = Depends(get_current_user)) -> dict[str, Any]:
    history = await _get_mood_history(user_id=str(current_user.get("_id")), days=7)
    if not history:
        return {"emotional_assessment": "Not enough personal history yet.", "recommendations": ["Log daily data for one week to unlock personalized insights."]}
    avg_sleep = sum(d["sleep"] for d in history) / len(history)
    return {"emotional_assessment": f"Your weekly sleep average is {avg_sleep:.1f}h and mood trend looks stable.", "recommendations": ["Try 30 minutes of light activity after work.", "Keep a consistent bedtime."]}


@router.get("/depression-analysis")
async def depression_analysis(current_user: dict = Depends(get_current_user)) -> dict[str, Any]:
    return _calculate_depression_score(await _get_mood_history(user_id=str(current_user.get("_id")), days=14))
