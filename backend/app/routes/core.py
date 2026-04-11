from pathlib import Path

import pandas as pd
from fastapi import APIRouter, HTTPException

router = APIRouter()

DATA_PATH = Path(__file__).resolve().parents[3] / "data" / "data.csv"


@router.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "OK"}


@router.get("/sample")
def sample_data() -> list[dict]:
    if not DATA_PATH.exists():
        raise HTTPException(status_code=404, detail="Dataset not found at data/data.csv")

    df = pd.read_csv(DATA_PATH)
    sample = df.head(10)
    return sample.to_dict(orient="records")
