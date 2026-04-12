from typing import Literal

from pydantic import BaseModel, EmailStr, Field, model_validator


class ProfileResponse(BaseModel):
    name: str | None = None
    email: EmailStr
    profile_photo: str | None = None
    phone_number: str | None = None
    address: str | None = None
    age: int | None = Field(default=None, ge=0, le=130)
    gender: Literal["male", "female", "other"] | None = None
    disability: bool | None = None
    menstruation_cycle: bool | None = None
    cycle_days: int | None = Field(default=None, ge=1, le=15)


class ProfileUpdateRequest(BaseModel):
    name: str | None = None
    email: EmailStr | None = None
    profile_photo: str | None = None
    phone_number: str | None = None
    address: str | None = None
    age: int | None = Field(default=None, ge=0, le=130)
    gender: Literal["male", "female", "other"] | None = None
    disability: bool | None = None
    menstruation_cycle: bool | None = None
    cycle_days: int | None = Field(default=None, ge=1, le=15)

    @model_validator(mode="after")
    def validate_cycle_fields(self) -> "ProfileUpdateRequest":
        if self.gender and self.gender != "female":
            if self.menstruation_cycle is True or self.cycle_days is not None:
                raise ValueError("menstruation_cycle and cycle_days are only applicable when gender is female")

        if self.menstruation_cycle is False and self.cycle_days is not None:
            raise ValueError("cycle_days can only be set when menstruation_cycle is true")

        return self
