from fastapi import APIRouter, Depends, HTTPException, status
from pymongo.errors import DuplicateKeyError

from ..auth.dependencies import get_current_user
from ..db import get_mongo_connection
from ..schemas.profile import ProfileResponse, ProfileUpdateRequest

router = APIRouter(prefix="/profile", tags=["Profile"])



def _build_profile_response(user: dict) -> ProfileResponse:
    return ProfileResponse(
        name=user.get("name"),
        email=user["email"],
        profile_photo=user.get("profile_photo"),
        phone_number=user.get("phone_number"),
        address=user.get("address"),
        age=user.get("age"),
        gender=user.get("gender"),
        disability=user.get("disability"),
        menstruation_cycle=user.get("menstruation_cycle"),
        cycle_days=user.get("cycle_days"),
    )


@router.get("", response_model=ProfileResponse)
async def get_profile(current_user: dict = Depends(get_current_user)) -> ProfileResponse:
    return _build_profile_response(current_user)


@router.put("", response_model=ProfileResponse)
async def update_profile(
    payload: ProfileUpdateRequest,
    current_user: dict = Depends(get_current_user),
) -> ProfileResponse:
    mongo = get_mongo_connection()
    users = mongo.get_users_collection()

    update_data = payload.model_dump(exclude_unset=True)
    if not update_data:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No fields provided for update")

    if update_data.get("gender") and update_data["gender"] != "female":
        update_data["menstruation_cycle"] = None
        update_data["cycle_days"] = None

    if update_data.get("menstruation_cycle") is False:
        update_data["cycle_days"] = None

    try:
        users.update_one({"_id": current_user["_id"]}, {"$set": update_data})
    except DuplicateKeyError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already exists")

    updated_user = users.find_one({"_id": current_user["_id"]})
    if not updated_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Profile not found")

    return _build_profile_response(updated_user)
