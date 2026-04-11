from __future__ import annotations

from typing import Dict


def _clamp(value: float, min_value: float = 0.0, max_value: float = 1.0) -> float:
    return max(min_value, min(max_value, value))


def calculate_emotions(screen_time: float, steps: int, sleep: float, streak: int) -> Dict[str, float]:
    """Return normalized emotion scores in [0, 1].

    Heuristics:
    - Healthy sleep (7-8h), high steps, and better streak increase Joy.
    - Very high screen time and poor sleep raise Sadness/Fear/Disgust.
    - Low steps and poor streak raise Neutral/Sadness.
    - Anger rises with poor sleep and high screen time.
    """

    norm_screen = _clamp(screen_time / 12.0)
    norm_steps = _clamp(steps / 10000.0)
    norm_sleep = _clamp(sleep / 8.0)
    norm_streak = _clamp(streak / 30.0)

    joy = _clamp(0.35 * norm_steps + 0.35 * norm_sleep + 0.30 * norm_streak)
    sadness = _clamp(0.45 * (1 - norm_sleep) + 0.35 * (1 - norm_steps) + 0.20 * norm_screen)
    fear = _clamp(0.50 * norm_screen + 0.30 * (1 - norm_sleep) + 0.20 * (1 - norm_streak))
    anger = _clamp(0.45 * norm_screen + 0.35 * (1 - norm_sleep) + 0.20 * (1 - norm_steps))
    disgust = _clamp(0.40 * norm_screen + 0.35 * (1 - norm_streak) + 0.25 * (1 - norm_sleep))
    neutral = _clamp(0.40 * (1 - abs(norm_sleep - 0.85)) + 0.30 * (1 - abs(norm_steps - 0.6)) + 0.30 * (1 - abs(norm_screen - 0.4)))

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
