from fastapi import APIRouter, Depends, HTTPException, status
from pymongo.errors import DuplicateKeyError

from ..db import get_mongo_connection
from ..models.user import build_user_document
from ..schemas.auth import LoginRequest, MeResponse, MessageResponse, SignupRequest, TokenResponse
from .dependencies import get_current_user
from .utils import create_access_token, hash_password, verify_password

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


@router.get("/me", response_model=MeResponse)
async def me(current_user: dict = Depends(get_current_user)) -> MeResponse:
    return MeResponse(email=current_user["email"])
