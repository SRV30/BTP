from __future__ import annotations

from typing import Dict


def _clamp(value: float, min_value: float = 0.0, max_value: float = 1.0) -> float:
    return max(min_value, min(max_value, value))


def calculate_emotions(
    screen_time: float,
    steps: int,
    sleep: float,
    streak: int,
    *,
    disability: bool = False,
    gender: str | None = None,
    menstruation_cycle: bool = False,
    baseline: dict[str, float] | None = None,
) -> Dict[str, float]:
    """Return normalized emotion scores in [0, 1] with profile-aware personalization."""

    norm_screen = _clamp(screen_time / 12.0)

    steps_goal = 7000.0 if disability else 10000.0
    norm_steps = _clamp(steps / steps_goal)

    norm_sleep = _clamp(sleep / 8.0)
    norm_streak = _clamp(streak / 30.0)

    joy = _clamp(0.35 * norm_steps + 0.35 * norm_sleep + 0.30 * norm_streak)
    sadness = _clamp(0.45 * (1 - norm_sleep) + 0.35 * (1 - norm_steps) + 0.20 * norm_screen)
    fear = _clamp(0.50 * norm_screen + 0.30 * (1 - norm_sleep) + 0.20 * (1 - norm_streak))
    anger = _clamp(0.45 * norm_screen + 0.35 * (1 - norm_sleep) + 0.20 * (1 - norm_steps))
    disgust = _clamp(0.40 * norm_screen + 0.35 * (1 - norm_streak) + 0.25 * (1 - norm_sleep))
    neutral = _clamp(
        0.40 * (1 - abs(norm_sleep - 0.85))
        + 0.30 * (1 - abs(norm_steps - 0.6))
        + 0.30 * (1 - abs(norm_screen - 0.4))
    )

    # Female + active cycle: raise stress-linked emotions.
    if (gender or "").lower() == "female" and menstruation_cycle:
        sadness = _clamp(sadness + 0.08)
        fear = _clamp(fear + 0.06)
        anger = _clamp(anger + 0.08)
        joy = _clamp(joy - 0.04)

    # Personal baseline: compare current day with user's own history.
    if baseline:
        avg_screen = baseline.get("avg_screen_time", screen_time)
        avg_sleep = baseline.get("avg_sleep", sleep)
        avg_steps = baseline.get("avg_steps", float(steps))

        if screen_time > avg_screen * 1.2:
            fear = _clamp(fear + 0.05)
            sadness = _clamp(sadness + 0.04)

        if sleep < avg_sleep * 0.9:
            sadness = _clamp(sadness + 0.05)
            anger = _clamp(anger + 0.04)

        if steps < avg_steps * 0.8:
            sadness = _clamp(sadness + 0.04)
            joy = _clamp(joy - 0.04)

    emotions = {
        "Joy": round(joy, 4),
        "Sadness": round(sadness, 4),
        "Fear": round(fear, 4),
        "Anger": round(anger, 4),
        "Disgust": round(disgust, 4),
        "Neutral": round(neutral, 4),
    }
    return emotions


def determine_mood(emotions: Dict[str, float]) -> str:
    return max(emotions, key=emotions.get)
