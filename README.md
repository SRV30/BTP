# MoodSense AI - Version 8

## What Version 8 adds
Version 8 upgrades Version 7 by replacing ML-based next-day prediction with a deterministic **Smart Prediction Logic** based on today's top emotions.

### Updated API
- `GET /predict-next-day`

Response format:
```json
{
  "predictions": [
    {"emotion": "Neutral", "probability": 43},
    {"emotion": "Joy", "probability": 34},
    {"emotion": "Disgust", "probability": 21}
  ]
}
```

## Smart prediction logic (no ML)
`/predict-next-day` now uses today's emotion profile from MongoDB:

1. Read today's `emotions` for the authenticated user.
2. Pick top 3 emotions by score.
3. Convert each top emotion score into percentage scale.
4. Compute `total = sum(top_3_percentages)`.
5. Compute per-emotion probability:

```text
probability = int((emotion_percentage / total) * 100)
```

The output is a clean list of top-3 probabilities.

## Why top emotions are used
- Top emotions represent the strongest current emotional signals.
- Limiting to top 3 avoids noisy low-signal emotions.
- It gives a clear, interpretable probability distribution for next-day direction.
- It is fully personalized because it uses **today's data for the current user**.

## Sample calculation
Given input:

```json
{
  "top_emotions": [
    {"emotion": "Neutral", "percentage": 81},
    {"emotion": "Joy", "percentage": 64},
    {"emotion": "Disgust", "percentage": 40.5}
  ]
}
```

Total:

```text
total = 81 + 64 + 40.5 = 185.5
```

Probabilities:

```text
Neutral = (81 / 185.5) * 100 = 43.66 -> 43
Joy = (64 / 185.5) * 100 = 34.50 -> 34
Disgust = (40.5 / 185.5) * 100 = 21.83 -> 21
```

## Scheduler setup (from Version 7)
APScheduler remains active for reliable daily mood refresh at UTC times:
- 12:05 AM
- 6:15 AM
- 12:30 PM
- 6:45 PM

At each run:
- update/create today's data per user
- recalculate mood and emotions

## Existing endpoints
- `GET /mood/7days`
- `GET /mood/30days`
- `GET /today`
- `GET /ai-insights`
- `GET /predict-next-day` (Smart Prediction Logic)

## Run locally
```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn backend.app.main:app --reload
```

Docs: `http://127.0.0.1:8000/docs`
