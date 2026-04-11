from datetime import date
from typing import Dict


def build_daily_log_document(
    user_id: str,
    log_date: date,
    screen_time: float,
    steps: int,
    sleep: float,
    streak: int,
    emotions: Dict[str, float],
    mood: str,
) -> dict:
    return {
        "user_id": user_id,
        "date": log_date.isoformat(),
        "screen_time": screen_time,
        "steps": steps,
        "sleep": sleep,
        "streak": streak,
        "emotions": emotions,
        "mood": mood,
    }
