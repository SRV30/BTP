from datetime import date
from typing import Dict

from pydantic import BaseModel, Field


class LogDataRequest(BaseModel):
    screen_time: float = Field(ge=0, le=24)
    steps: int = Field(ge=0, le=100000)
    sleep: float = Field(ge=0, le=24)
    streak: int = Field(ge=0, le=3650)


class LogDataResponse(BaseModel):
    message: str
    mood: str
    emotions: Dict[str, float]
    date: date
