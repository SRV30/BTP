from pydantic import BaseModel, EmailStr


class ProfileResponse(BaseModel):
    name: str | None = None
    email: EmailStr
    profile_photo: str | None = None
    phone_number: str | None = None
    address: str | None = None


class ProfileUpdateRequest(BaseModel):
    name: str | None = None
    email: EmailStr | None = None
    profile_photo: str | None = None
    phone_number: str | None = None
    address: str | None = None
