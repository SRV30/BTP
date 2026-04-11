# MoodSense AI - Version 3

## What Version 3 adds
Version 3 keeps all Version 2 authentication and Version 1 core endpoints, and adds a mood logging engine.

### Backward-compatible endpoints
- `GET /health`
- `GET /sample`
- `POST /auth/signup`
- `POST /auth/login`
- `GET /auth/me`

### New endpoint
- `POST /log-data` (JWT protected)

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

## Mood engine (how it works)
`POST /log-data` receives:
- `screen_time` (hours)
- `steps`
- `sleep` (hours)
- `streak` (days)

The engine computes six emotion scores (0 to 1):
- Joy
- Sadness
- Fear
- Anger
- Disgust
- Neutral

The final `mood` is the emotion with the highest score.

Heuristic summary:
- More steps, better sleep, and stronger streak increase Joy.
- High screen time + poor sleep increase Fear/Anger/Disgust.
- Low activity and low sleep increase Sadness.
- Balanced values increase Neutral.

## Data storage model
Logs are stored in MongoDB collection: `daily_logs`

Each document contains:
- `user_id`
- `date`
- `screen_time`
- `steps`
- `sleep`
- `streak`
- `emotions` (object with 6 scores)
- `mood` (top emotion)

## Run locally
```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn backend.app.main:app --reload
```

Open docs: `http://127.0.0.1:8000/docs`

## Sample requests

### 1) Signup
```bash
curl -X POST http://127.0.0.1:8000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"user@gmail.com","password":"password123"}'
```

### 2) Login
```bash
curl -X POST http://127.0.0.1:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@gmail.com","password":"password123"}'
```

### 3) Log mood data (protected)
```bash
curl -X POST http://127.0.0.1:8000/log-data \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_TOKEN>" \
  -d '{"screen_time":6.5,"steps":8200,"sleep":7.2,"streak":14}'
```

### Sample response (`/log-data`)
```json
{
  "message": "Daily log saved successfully",
  "mood": "Joy",
  "emotions": {
    "Joy": 0.7325,
    "Sadness": 0.3117,
    "Fear": 0.4025,
    "Anger": 0.3513,
    "Disgust": 0.2892,
    "Neutral": 0.8012
  },
  "date": "2026-04-11"
}
```

## Test in Swagger
1. Open `/docs`.
2. Login via `POST /auth/login`.
3. Click **Authorize** and paste `Bearer <token>`.
4. Execute `POST /log-data`.
