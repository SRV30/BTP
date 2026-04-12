from typing import Literal

from pydantic import BaseModel, EmailStr


class ConnectionRequestCreate(BaseModel):
    email: EmailStr


class ConnectionRequestRespond(BaseModel):
    email: EmailStr
    action: Literal["accept", "reject"]
