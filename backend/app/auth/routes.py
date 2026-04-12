from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from pymongo.errors import DuplicateKeyError

from ..db import get_mongo_connection
from ..models.user import build_user_document
from ..schemas.auth import (
    ForgotPasswordRequest,
    LoginRequest,
    MeResponse,
    MessageResponse,
    ResetPasswordRequest,
    SignupRequest,
    TokenResponse,
)
from .dependencies import get_current_user
from .utils import (
    create_access_token,
    generate_password_reset_token,
    hash_password,
    hash_reset_token,
    password_reset_expiry,
    send_password_reset_email,
    verify_password,
)

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/signup", response_model=MessageResponse)
async def signup(payload: SignupRequest) -> MessageResponse:
    mongo = get_mongo_connection()
    users = mongo.get_users_collection()

    if users.find_one({"email": payload.email}):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already exists")

    user_document = build_user_document(
        email=payload.email,
        hashed_password=hash_password(payload.password),
    )

    try:
        users.insert_one(user_document)
    except DuplicateKeyError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already exists")

    return MessageResponse(message="User created successfully")


@router.post("/login", response_model=TokenResponse)
async def login(payload: LoginRequest) -> TokenResponse:
    mongo = get_mongo_connection()
    users = mongo.get_users_collection()
    user = users.find_one({"email": payload.email})

    if not user or not verify_password(payload.password, user["hashed_password"]):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")

    token = create_access_token(payload.email)
    return TokenResponse(access_token=token)


@router.post("/forgot-password", response_model=MessageResponse)
async def forgot_password(payload: ForgotPasswordRequest) -> MessageResponse:
    mongo = get_mongo_connection()
    users = mongo.get_users_collection()
    user = users.find_one({"email": payload.email})

    if user:
        raw_token = generate_password_reset_token()
        users.update_one(
            {"_id": user["_id"]},
            {
                "$set": {
                    "reset_token_hash": hash_reset_token(raw_token),
                    "reset_token_expires_at": password_reset_expiry(),
                    "reset_requested_at": datetime.now(timezone.utc),
                }
            },
        )
        send_password_reset_email(payload.email, raw_token)

    return MessageResponse(message="If that email exists, a reset token has been sent")


@router.post("/reset-password", response_model=MessageResponse)
async def reset_password(payload: ResetPasswordRequest) -> MessageResponse:
    mongo = get_mongo_connection()
    users = mongo.get_users_collection()

    user = users.find_one({"reset_token_hash": hash_reset_token(payload.token)})
    if not user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired reset token")

    expires_at = user.get("reset_token_expires_at")
    if not expires_at or expires_at < datetime.now(timezone.utc):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired reset token")

    users.update_one(
        {"_id": user["_id"]},
        {
            "$set": {"hashed_password": hash_password(payload.new_password)},
            "$unset": {
                "reset_token_hash": "",
                "reset_token_expires_at": "",
                "reset_requested_at": "",
            },
        },
    )

    return MessageResponse(message="Password reset successful")


@router.get("/me", response_model=MeResponse)
async def me(current_user: dict = Depends(get_current_user)) -> MeResponse:
    return MeResponse(email=current_user["email"])
