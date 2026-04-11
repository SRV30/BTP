# MoodSense AI - Version 4

## What Version 4 adds
Version 4 extends Version 3 by adding mood trend insight APIs for weekly/monthly analysis and a quick today summary.

### Existing APIs (kept working)
- `GET /health`
- `GET /sample`
- `POST /auth/signup`
- `POST /auth/login`
- `GET /auth/me`
- `POST /log-data`

### New APIs
- `GET /mood/7days`
- `GET /mood/30days`
- `GET /today`

All mood insight endpoints require JWT Bearer authentication.

## Tech stack
- Python + FastAPI
- MongoDB Atlas (`pymongo`)
- pandas
- bcrypt
- python-jose (JWT)
- python-dotenv

## Project structure

```text
backend/
  app/
    main.py
    db.py
    mood_engine.py
    auth/
      routes.py
      dependencies.py
      utils.py
    routes/
      core.py
      log_data.py
      mood_insights.py
    models/
      user.py
      daily_log.py
    schemas/
      auth.py
      logs.py
data/
  data.csv
requirements.txt
.env
```

## Environment variables
```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/moodsense?retryWrites=true&w=majority
JWT_SECRET=your_secret_key
```

## How mood engine and graphs are generated
1. `POST /log-data` calculates six emotions (Joy, Sadness, Fear, Anger, Disgust, Neutral) from input signals (`screen_time`, `steps`, `sleep`, `streak`).
2. `mood` is selected as the highest-scoring emotion.
3. Data is upserted into `daily_logs` per user/day.
4. `GET /mood/7days` and `GET /mood/30days` fetch date-sorted logs and convert emotion scores to percentages.
5. Frontend graphing can directly plot:
   - **X-axis:** `date`
   - **Y-axis:** `emotion_percentages.<emotion_name>`

## Optimized query strategy
- Index on `users.email` (unique).
- Compound index on `daily_logs (user_id, date)` (unique) for fast range filtering and per-day upsert.
- Projections are used in mood insight endpoints so only required fields are returned.

## Data storage model (`daily_logs`)
Each document contains:
- `user_id`
- `date`
- `screen_time`
- `steps`
- `sleep`
- `streak`
- `emotions` (object of 6 scores in 0..1)
- `mood`

## Run locally
```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn backend.app.main:app --reload
```

Docs: `http://127.0.0.1:8000/docs`

## Response formats

### `GET /mood/7days` and `GET /mood/30days`
```json
{
  "range_days": 7,
  "data": [
    {
      "date": "2026-04-10",
      "emotion_percentages": {
        "Joy": 71.25,
        "Sadness": 24.16,
        "Fear": 35.9,
        "Anger": 32.4,
        "Disgust": 28.75,
        "Neutral": 80.44
      },
      "mood": "Neutral"
    }
  ]
}
```

### `GET /today`
```json
{
  "date": "2026-04-11",
  "mood": "Joy",
  "top_emotions": [
    {"emotion": "Joy", "percentage": 74.15},
    {"emotion": "Neutral", "percentage": 70.80},
    {"emotion": "Fear", "percentage": 32.70}
  ]
}
```

If no log exists for today:
```json
{
  "date": "2026-04-11",
  "mood": null,
  "top_emotions": [],
  "message": "No log found for today"
}
```

## Example cURL

```bash
# Login first and copy token
curl -X POST http://127.0.0.1:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@gmail.com","password":"password123"}'

# Save today's signals
curl -X POST http://127.0.0.1:8000/log-data \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_TOKEN>" \
  -d '{"screen_time":6.5,"steps":8200,"sleep":7.2,"streak":14}'

# Get last 7 days graph data
curl http://127.0.0.1:8000/mood/7days \
  -H "Authorization: Bearer <YOUR_TOKEN>"

# Get last 30 days graph data
curl http://127.0.0.1:8000/mood/30days \
  -H "Authorization: Bearer <YOUR_TOKEN>"

# Get today's mood summary
curl http://127.0.0.1:8000/today \
  -H "Authorization: Bearer <YOUR_TOKEN>"
```
