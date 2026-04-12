# MoodSense AI - Version 7

## What Version 7 adds
Version 7 upgrades Version 6 with reliable scheduled mood refresh jobs using **APScheduler**.

### New scheduler behavior
Jobs run daily at **UTC** times:
- 12:05 AM
- 6:15 AM
- 12:30 PM
- 6:45 PM

At each run, the scheduler:
1. Reads all users.
2. Uses each user's latest known metrics (`screen_time`, `steps`, `sleep`, `streak`).
3. Updates/creates today's log.
4. Recalculates emotions + mood with the mood engine.

This keeps today's data fresh even if a user has not manually logged new data yet.

## Scheduler setup
- Implemented in `backend/app/scheduler.py` using `BackgroundScheduler` + `CronTrigger`.
- Started from FastAPI `startup` event.
- Stopped cleanly on `shutdown` event.
- Reliability settings:
  - `coalesce=True`
  - `max_instances=1`
  - `misfire_grace_time=1800` (30 minutes)

## How it runs
- On app startup:
  - DB indexes are ensured.
  - ML model training is attempted (skipped gracefully if ML deps are missing).
  - APScheduler starts and registers four daily jobs.
- On every scheduled trigger:
  - `update_today_data_and_recalculate_mood()` executes.
  - It upserts one daily log per user for today and recalculates mood.
- On app shutdown:
  - Scheduler shuts down cleanly.

## Existing Version 6 features
- `GET /ai-insights` for personalized emotional assessment + recommendations.
- `GET /predict-next-day` for ML-based mood/emotion prediction.
- Dynamic recommendation rules in `ai-insights`:
  - high screen time → reduction suggestion
  - low sleep → sleep improvement
  - low steps → activity suggestion

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
