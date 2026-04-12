# MoodSense AI - Version 10B

## What Version 10B adds
Version 10B upgrades Version 10A with richer profile fields and smart personalization logic for mood prediction.

## My Profile fields
`GET /profile` and `PUT /profile` now support:
- `name`
- `email`
- `profile_photo`
- `phone_number`
- `address`
- `age`
- `gender` (`male`, `female`, `other`)
- `disability` (`true`/`false`)
- `menstruation_cycle` (`true`/`false`, applicable when `gender=female`)
- `cycle_days` (number of days, only when `menstruation_cycle=true`)

## Personalization logic
Version 10B introduces profile-aware and history-aware logic:

1. **Female + active cycle adjustment**
   - If `gender=female` and `menstruation_cycle=true`, stress-linked emotions are boosted.
   - This increases probability for stress-correlated outcomes (e.g., Sadness/Fear/Anger) in next-day prediction.

2. **Disability-aware steps normalization**
   - Daily emotion calculation normalizes steps against a lower step goal when `disability=true`.
   - This avoids over-penalizing activity levels for users with accessibility constraints.

3. **Personal baseline comparison**
   - Mood scoring compares today’s metrics with the user’s own recent history (screen time, sleep, and steps).
   - Next-day prediction blends today’s emotions with recent emotional baseline to produce personalized probabilities.

## How profile affects mood prediction
- `POST /log-data` uses profile attributes and personal baseline to compute current-day emotions.
- `GET /predict-next-day` then applies:
  - a history blend using personal emotional trend,
  - and an additional cycle-based stress probability adjustment when applicable.
- This means two users with the same raw inputs can receive different predictions based on profile context and personal history.

## Example profile update
```bash
curl -X PUT http://127.0.0.1:8000/profile \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "age": 29,
    "gender": "female",
    "disability": false,
    "menstruation_cycle": true,
    "cycle_days": 5
  }'
```

## Existing APIs
- Auth:
  - `POST /auth/signup`
  - `POST /auth/login`
  - `POST /auth/forgot-password`
  - `POST /auth/reset-password`
  - `GET /auth/me`
- Logs and insights:
  - `POST /log-data`
  - `GET /mood/7days`
  - `GET /mood/30days`
  - `GET /today`
  - `GET /predict-next-day`
  - `GET /ai-insights`

## Run locally
```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn backend.app.main:app --reload
```

Docs: `http://127.0.0.1:8000/docs`
