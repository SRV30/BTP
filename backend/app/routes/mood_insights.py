from datetime import datetime, timedelta, timezone
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
    earlier_window = sadness_values[:midpoint]
    recent_window = sadness_values[midpoint:]
    earlier_avg = sum(earlier_window) / len(earlier_window)
    recent_avg = sum(recent_window) / len(recent_window) if recent_window else sadness_values[-1]
    sadness_trend = max(0.0, min(1.0, recent_avg - earlier_avg + 0.5))

    avg_sleep = sum(sleep_values) / len(sleep_values)
    sleep_deficit = max(0.0, min(1.0, (8.0 - avg_sleep) / 8.0))

    avg_steps = sum(steps_values) / len(steps_values)
    low_activity = max(0.0, min(1.0, (7000.0 - avg_steps) / 7000.0))

    high_stress_streak_days = 0
    for day in reversed(logs):
        emotions = day.get("emotion_percentages") or {}
        sadness = float(emotions.get("Sadness", 0.0))
        fear = float(emotions.get("Fear", 0.0))
        anger = float(emotions.get("Anger", 0.0))
        stress_avg = (sadness + fear + anger) / 3.0
        if stress_avg >= 60.0:
            high_stress_streak_days += 1
        else:
            break
    high_stress_streak = max(0.0, min(1.0, high_stress_streak_days / 7.0))

    weighted_score = (
        0.35 * sadness_trend
        + 0.25 * sleep_deficit
        + 0.20 * low_activity
        + 0.20 * high_stress_streak
    )
    percentage = round(weighted_score * 100.0, 2)

    return {
        "percentage": percentage,
        "severity": _severity_from_percentage(percentage),
    }


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
            "screen_time": 1,
            "sleep": 1,
            "steps": 1,
            "streak": 1,
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
                "screen_time": float(row.get("screen_time", 0.0)),
                "sleep": float(row.get("sleep", 0.0)),
                "steps": int(row.get("steps", 0)),
                "streak": int(row.get("streak", 0)),
            }
        )
    return results


def _build_ai_insights(last_7_days: list[dict[str, Any]], last_30_days: list[dict[str, Any]], current_mood: str | None) -> dict[str, Any]:
    baseline = last_7_days if last_7_days else last_30_days

    if not baseline:
        return {
            "emotional_assessment": "Not enough personal history yet. Log daily data for tailored insights.",
            "recommendations": [
                "Track screen time, sleep, and steps daily for at least a week to unlock personalized guidance."
            ],
        }

    avg_screen = sum(day["screen_time"] for day in baseline) / len(baseline)
    avg_sleep = sum(day["sleep"] for day in baseline) / len(baseline)
    avg_steps = sum(day["steps"] for day in baseline) / len(baseline)

    mood_counts: dict[str, int] = {}
    for day in baseline:
        mood = str(day.get("mood") or "Unknown")
        mood_counts[mood] = mood_counts.get(mood, 0) + 1
    dominant_mood = max(mood_counts, key=mood_counts.get)

    mood_label = current_mood or dominant_mood
    assessment_parts = [
        f"Current mood signal is '{mood_label}' and your recent dominant pattern is '{dominant_mood}'.",
        f"In your recent personal data: average screen time is {avg_screen:.2f}h/day, sleep is {avg_sleep:.2f}h/night, and steps are {avg_steps:.0f}/day.",
    ]

    if avg_sleep >= 7 and avg_steps >= 7000 and avg_screen <= 6:
        assessment_parts.append("Your routine appears well balanced and supportive of emotional stability.")
    else:
        assessment_parts.append("Your routine has a few stress-linked signals that may be affecting emotional balance.")

    recommendations: list[str] = []
    if avg_screen > 6:
        recommendations.append(
            f"Reduce screen time gradually (current avg {avg_screen:.2f}h). Try a 45-minute digital cutoff before bed and two 15-minute no-screen breaks."
        )
    if avg_sleep < 7:
        recommendations.append(
            f"Improve sleep duration (current avg {avg_sleep:.2f}h). Aim for a consistent sleep window and target 7-8 hours nightly."
        )
    if avg_steps < 7000:
        recommendations.append(
            f"Increase activity (current avg {avg_steps:.0f} steps). Add one 20-minute walk daily to move toward 7,000+ steps."
        )

    if not recommendations:
        recommendations.append("Keep your current habits steady and focus on consistency to maintain a healthy mood profile.")

    return {
        "emotional_assessment": " ".join(assessment_parts),
        "recommendations": recommendations,
    }


@router.get("/mood/7days")
async def mood_last_7_days(current_user: dict = Depends(get_current_user)) -> dict[str, Any]:
    user_id = str(current_user.get("_id"))
    history = await _get_mood_history(user_id=user_id, days=7)
    graph_data = [
        {"date": d["date"], "emotion_percentages": d["emotion_percentages"], "mood": d["mood"]}
        for d in history
    ]
    return {"range_days": 7, "data": graph_data}


@router.get("/mood/30days")
async def mood_last_30_days(current_user: dict = Depends(get_current_user)) -> dict[str, Any]:
    user_id = str(current_user.get("_id"))
    history = await _get_mood_history(user_id=user_id, days=30)
    graph_data = [
        {"date": d["date"], "emotion_percentages": d["emotion_percentages"], "mood": d["mood"]}
        for d in history
    ]
    return {"range_days": 30, "data": graph_data}


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
    today = datetime.now(timezone.utc).date().isoformat()

    mongo = get_mongo_connection()
    today_doc = mongo.get_daily_logs_collection().find_one(
        {"user_id": user_id, "date": today},
        {"_id": 0, "emotions": 1},
    )

    if not today_doc or not today_doc.get("emotions"):
        return {
            "predictions": [],
            "message": "No emotion data found for today. Log today's data first.",
        }

    emotions = {name: float(score) for name, score in today_doc.get("emotions", {}).items()}

    history_cursor = mongo.get_daily_logs_collection().find(
        {"user_id": user_id, "date": {"$lt": today}},
        {"_id": 0, "emotions": 1},
    ).sort("date", -1).limit(30)
    history = list(history_cursor)

    if history:
        baseline_emotions: dict[str, float] = {}
        for row in history:
            for emotion, score in (row.get("emotions") or {}).items():
                baseline_emotions[emotion] = baseline_emotions.get(emotion, 0.0) + float(score)

        history_count = len(history)
        for emotion in baseline_emotions:
            baseline_emotions[emotion] = baseline_emotions[emotion] / history_count

        for emotion in emotions:
            baseline_score = baseline_emotions.get(emotion, emotions[emotion])
            emotions[emotion] = (0.7 * emotions[emotion]) + (0.3 * baseline_score)

    # Female + active cycle: increase stress-linked probabilities.
    if str(current_user.get("gender", "")).lower() == "female" and bool(current_user.get("menstruation_cycle", False)):
        for stress_emotion in ("Sadness", "Fear", "Anger"):
            if stress_emotion in emotions:
                emotions[stress_emotion] += 0.08

    top_3 = sorted(emotions.items(), key=lambda item: item[1], reverse=True)[:3]
    total = sum(score for _, score in top_3)

    if total <= 0:
        return {
            "predictions": [],
            "message": "Today's top emotions are not sufficient to calculate probabilities.",
        }

    predictions = [
        {
            "emotion": emotion,
            "probability": int((score / total) * 100),
        }
        for emotion, score in top_3
    ]

    return {
        "predictions": predictions,
        "personalization_applied": {
            "cycle_stress_adjustment": str(current_user.get("gender", "")).lower() == "female" and bool(current_user.get("menstruation_cycle", False)),
            "history_baseline_days": len(history),
        },
    }


@router.get("/ai-insights")
async def ai_insights(current_user: dict = Depends(get_current_user)) -> dict[str, Any]:
    user_id = str(current_user.get("_id"))

    last_7_days = await _get_mood_history(user_id=user_id, days=7)
    last_30_days = await _get_mood_history(user_id=user_id, days=30)

    today = datetime.now(timezone.utc).date().isoformat()
    mongo = get_mongo_connection()
    current_doc = mongo.get_daily_logs_collection().find_one(
        {"user_id": user_id, "date": today},
        {"_id": 0, "mood": 1},
    )
    current_mood = current_doc.get("mood") if current_doc else None

    insights = _build_ai_insights(
        last_7_days=last_7_days,
        last_30_days=last_30_days,
        current_mood=current_mood,
    )

    return {
        "input_summary": {
            "last_7_days_count": len(last_7_days),
            "last_30_days_count": len(last_30_days),
            "current_mood": current_mood,
        },
        **insights,
    }


@router.get("/depression-analysis")
async def depression_analysis(current_user: dict = Depends(get_current_user)) -> dict[str, Any]:
    user_id = str(current_user.get("_id"))
    recent_logs = await _get_mood_history(user_id=user_id, days=14)
    return _calculate_depression_score(recent_logs)
