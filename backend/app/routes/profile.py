from fastapi import APIRouter, Depends, HTTPException, status
from pymongo.errors import DuplicateKeyError

from ..auth.dependencies import get_current_user
from ..db import get_mongo_connection
from ..schemas.profile import ProfileResponse, ProfileUpdateRequest

router = APIRouter(prefix="/profile", tags=["Profile"])


@router.get("", response_model=ProfileResponse)
async def get_profile(current_user: dict = Depends(get_current_user)) -> ProfileResponse:
    return ProfileResponse(
        name=current_user.get("name"),
        email=current_user["email"],
        profile_photo=current_user.get("profile_photo"),
        phone_number=current_user.get("phone_number"),
        address=current_user.get("address"),
    )


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

    try:
        users.update_one({"_id": current_user["_id"]}, {"$set": update_data})
    except DuplicateKeyError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already exists")

    updated_user = users.find_one({"_id": current_user["_id"]})
    if not updated_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Profile not found")

    return ProfileResponse(
        name=updated_user.get("name"),
        email=updated_user["email"],
        profile_photo=updated_user.get("profile_photo"),
        phone_number=updated_user.get("phone_number"),
        address=updated_user.get("address"),
    )
