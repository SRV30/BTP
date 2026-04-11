# MoodSense AI - Version 5

## What Version 5 adds
Version 5 upgrades Version 4 with an end-to-end ML prediction pipeline:

- Train a **RandomForest** ML model from `data/data.csv`
- Persist model to pickle at `backend/app/model.pkl`
- Add authenticated API: `GET /predict-next-day`
- Return:
  - `predicted_emotions`
  - `predicted_mood`

Existing APIs from Version 4 are still available.

## ML model used
Version 5 uses two RandomForest models trained on the same features:

- `RandomForestRegressor` for multi-output emotion prediction (`Joy`, `Sadness`, `Fear`, `Anger`, `Disgust`, `Neutral`)
- `RandomForestClassifier` for mood class prediction (`mood`)

Input features:

- `screen_time`
- `steps`
- `sleep`
- `streak`

## Training steps
1. Load `data/data.csv`
2. Parse `top_emotions` JSON-like string into six numeric emotion targets
3. Build feature matrix from `screen_time`, `steps`, `sleep`, `streak`
4. Split data using `train_test_split(test_size=0.2, random_state=42)`
5. Train regressor + classifier
6. Compute classification accuracy on mood (`accuracy_score`)
7. Save trained predictor to pickle (`backend/app/model.pkl`)

Training runs automatically on app startup (`startup_event`) and can also happen on-demand when the prediction endpoint is called and no saved model exists.

## Accuracy
- Metric used: **Mood classification accuracy**
- Computation: `accuracy_score(y_test_mood, model.predict(X_test))`
- Returned by training utility: `train_model_and_report()` as `mood_accuracy`

> Note: Accuracy value depends on dataset contents and train/test split in your environment. With the default split (`random_state=42`), the value is deterministic for the same input file.

## New API

### `GET /predict-next-day`
Requires JWT bearer token.

Behavior:
- Reads the authenticated user's most recent daily log from MongoDB
- Uses that latest record's lifestyle features as model input
- Returns predicted next-day emotions and mood

Example response:

```json
{
  "based_on_date": "2025-12-31",
  "predicted_emotions": {
    "Joy": 74.83,
    "Sadness": 22.61,
    "Fear": 31.90,
    "Anger": 28.11,
    "Disgust": 24.77,
    "Neutral": 68.54
  },
  "predicted_mood": "Joy"
}
```

If user has no logs:

```json
{
  "message": "No historical logs found. Add at least one log to predict the next day.",
  "predicted_emotions": {},
  "predicted_mood": null
}
```

## Run locally
```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn backend.app.main:app --reload
```

Docs: `http://127.0.0.1:8000/docs`

## Dependency behavior
- Core APIs still boot even if `scikit-learn` is not installed.
- In that case, startup skips model training and `GET /predict-next-day` returns HTTP 503 with an install hint.
