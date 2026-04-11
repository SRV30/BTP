from __future__ import annotations

import ast
import pickle
from pathlib import Path
from typing import Any

import pandas as pd
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.metrics import accuracy_score
from sklearn.model_selection import train_test_split

FEATURE_COLUMNS = ["screen_time", "steps", "sleep", "streak"]
EMOTION_COLUMNS = ["Joy", "Sadness", "Fear", "Anger", "Disgust", "Neutral"]

DATA_PATH = Path(__file__).resolve().parents[2] / "data" / "data.csv"
MODEL_PATH = Path(__file__).resolve().parent / "model.pkl"


class MoodPredictor:
    def __init__(self) -> None:
        self.regressor = RandomForestRegressor(n_estimators=300, random_state=42)
        self.classifier = RandomForestClassifier(n_estimators=300, random_state=42)

    def fit(self, features: pd.DataFrame, emotion_targets: pd.DataFrame, mood_targets: pd.Series) -> None:
        self.regressor.fit(features, emotion_targets)
        self.classifier.fit(features, mood_targets)

    def predict(self, screen_time: float, steps: int, sleep: float, streak: int) -> dict[str, Any]:
        input_df = pd.DataFrame(
            [{"screen_time": screen_time, "steps": steps, "sleep": sleep, "streak": streak}]
        )
        predicted_emotions_raw = self.regressor.predict(input_df)[0]
        predicted_mood = str(self.classifier.predict(input_df)[0])

        predicted_emotions = {
            name: round(float(max(0.0, min(100.0, value))), 2)
            for name, value in zip(EMOTION_COLUMNS, predicted_emotions_raw)
        }
        return {
            "predicted_emotions": predicted_emotions,
            "predicted_mood": predicted_mood,
        }


def _load_dataset() -> pd.DataFrame:
    df = pd.read_csv(DATA_PATH)
    parsed_emotions = df["top_emotions"].apply(ast.literal_eval)
    emotions_df = pd.DataFrame(parsed_emotions.tolist())
    combined = pd.concat([df, emotions_df], axis=1)
    return combined


def train_model_and_report() -> dict[str, float]:
    dataset = _load_dataset()
    features = dataset[FEATURE_COLUMNS]
    emotion_targets = dataset[EMOTION_COLUMNS]
    mood_targets = dataset["mood"]

    x_train, x_test, y_train_emotions, y_test_emotions, y_train_mood, y_test_mood = train_test_split(
        features,
        emotion_targets,
        mood_targets,
        test_size=0.2,
        random_state=42,
    )

    predictor = MoodPredictor()
    predictor.fit(x_train, y_train_emotions, y_train_mood)

    mood_predictions = predictor.classifier.predict(x_test)
    mood_accuracy = accuracy_score(y_test_mood, mood_predictions)

    MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)
    with MODEL_PATH.open("wb") as f:
        pickle.dump(predictor, f)

    return {"mood_accuracy": round(float(mood_accuracy), 4)}


def load_or_train_model() -> MoodPredictor:
    if MODEL_PATH.exists():
        with MODEL_PATH.open("rb") as f:
            return pickle.load(f)

    train_model_and_report()
    with MODEL_PATH.open("rb") as f:
        return pickle.load(f)
