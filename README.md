# MoodSense AI - Version 6

## What Version 6 adds
Version 6 upgrades Version 5 with a personalized agent endpoint:

- `GET /ai-insights` (authenticated)
- Uses user-specific:
  - last 7 days data
  - last 30 days data
  - current mood (today)
- Returns:
  - `emotional_assessment`
  - `recommendations`

Version 5 ML endpoint (`GET /predict-next-day`) remains available.

## Agent logic
The agent computes a personalized routine profile from recent user logs:

1. Pulls the user's last 7-day and 30-day logs.
2. Uses latest available baseline (7-day preferred, else 30-day).
3. Calculates averages:
   - `screen_time`
   - `sleep`
   - `steps`
4. Detects dominant recent mood + merges with current mood signal.
5. Builds dynamic recommendations with explicit rules:
   - **Screen high (`> 6h/day`) → suggest reduction**
   - **Sleep low (`< 7h/night`) → suggest improvement**
   - **Steps low (`< 7000/day`) → suggest activity**

## Personalization concept (different output per user)
`/ai-insights` is user-specific because it is built from each authenticated user’s own stored logs and mood history.

Different users with different averages and mood trends receive different:
- assessments (mood pattern + routine summary)
- recommendations (only triggered for that user’s weak areas)

So two users with the same current mood can still receive different guidance if their sleep/steps/screen patterns differ.

## Existing Version 5 ML features
Version 5 ML pipeline is preserved:

- RandomForestRegressor for emotion prediction
- RandomForestClassifier for mood prediction
- Training from `data/data.csv`
- Pickle persistence at `backend/app/model.pkl`
- Prediction API: `GET /predict-next-day`

## Dependency behavior
- Core APIs still boot even if `scikit-learn` is not installed.
- In that case, startup skips model training and `GET /predict-next-day` returns HTTP 503 with an install hint.

## Run locally
```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn backend.app.main:app --reload
```

Docs: `http://127.0.0.1:8000/docs`
