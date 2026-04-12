from datetime import datetime, timedelta, timezone
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Query, status

from ..auth.dependencies import get_current_user
from ..db import get_mongo_connection
from ..schemas.connections import ConnectionRequestCreate, ConnectionRequestRespond

router = APIRouter(prefix="/connections", tags=["Connections"])



def _history_for_days(user_id: str, days: int) -> list[dict[str, Any]]:
    mongo = get_mongo_connection()
    end_date = datetime.now(timezone.utc).date()
    start_date = end_date - timedelta(days=days - 1)

    cursor = mongo.get_daily_logs_collection().find(
        {
            "user_id": user_id,
            "date": {"$gte": start_date.isoformat(), "$lte": end_date.isoformat()},
        },
        {"_id": 0, "date": 1, "mood": 1},
    ).sort("date", 1)

    return [{"date": row.get("date"), "mood": row.get("mood")} for row in cursor]



def _current_mood(user_id: str) -> str | None:
    mongo = get_mongo_connection()
    today = datetime.now(timezone.utc).date().isoformat()
    row = mongo.get_daily_logs_collection().find_one(
        {"user_id": user_id, "date": today},
        {"_id": 0, "mood": 1},
    )
    return row.get("mood") if row else None


@router.get("/search")
async def search_user_by_email(
    email: str = Query(..., description="Email to search"),
    current_user: dict = Depends(get_current_user),
) -> dict[str, Any]:
    mongo = get_mongo_connection()
    users = mongo.get_users_collection()

    user = users.find_one({"email": email}, {"_id": 1, "email": 1, "name": 1})
    if not user:
        return {"found": False}

    current_connections = current_user.get("connections", [])
    incoming = current_user.get("incoming_requests", [])
    outgoing = current_user.get("outgoing_requests", [])

    return {
        "found": True,
        "user": {"email": user.get("email"), "name": user.get("name")},
        "is_self": user.get("email") == current_user.get("email"),
        "is_connected": user.get("email") in current_connections,
        "request_received": user.get("email") in incoming,
        "request_sent": user.get("email") in outgoing,
    }


@router.post("/request")
async def send_connection_request(
    payload: ConnectionRequestCreate,
    current_user: dict = Depends(get_current_user),
) -> dict[str, str]:
    if payload.email == current_user.get("email"):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="You cannot connect with yourself")

    mongo = get_mongo_connection()
    users = mongo.get_users_collection()

    target_user = users.find_one({"email": payload.email})
    if not target_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Target user not found")

    if payload.email in current_user.get("connections", []):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Already connected")

    if payload.email in current_user.get("outgoing_requests", []):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Request already sent")

    users.update_one(
        {"_id": current_user["_id"]},
        {"$addToSet": {"outgoing_requests": payload.email}},
    )
    users.update_one(
        {"_id": target_user["_id"]},
        {"$addToSet": {"incoming_requests": current_user["email"]}},
    )

    return {"message": "Connection request sent"}


@router.post("/request/respond")
async def respond_connection_request(
    payload: ConnectionRequestRespond,
    current_user: dict = Depends(get_current_user),
) -> dict[str, str]:
    mongo = get_mongo_connection()
    users = mongo.get_users_collection()

    requester = users.find_one({"email": payload.email})
    if not requester:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Requesting user not found")

    if payload.email not in current_user.get("incoming_requests", []):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No pending request from this user")

    users.update_one(
        {"_id": current_user["_id"]},
        {
            "$pull": {"incoming_requests": payload.email},
        },
    )
    users.update_one(
        {"_id": requester["_id"]},
        {
            "$pull": {"outgoing_requests": current_user["email"]},
        },
    )

    if payload.action == "accept":
        users.update_one(
            {"_id": current_user["_id"]},
            {"$addToSet": {"connections": payload.email}},
        )
        users.update_one(
            {"_id": requester["_id"]},
            {"$addToSet": {"connections": current_user["email"]}},
        )
        return {"message": "Connection request accepted"}

    return {"message": "Connection request rejected"}


@router.get("")
async def view_connections(current_user: dict = Depends(get_current_user)) -> dict[str, Any]:
    mongo = get_mongo_connection()
    users = mongo.get_users_collection()

    connection_emails = current_user.get("connections", [])
    if not connection_emails:
        return {"connections": []}

    linked_users = users.find(
        {"email": {"$in": connection_emails}},
        {"_id": 1, "email": 1, "name": 1},
    )

    result: list[dict[str, Any]] = []
    for user in linked_users:
        linked_id = str(user.get("_id"))
        result.append(
            {
                "email": user.get("email"),
                "name": user.get("name"),
                "current_mood": _current_mood(linked_id),
                "last_7_days_mood": _history_for_days(linked_id, 7),
                "last_30_days_mood": _history_for_days(linked_id, 30),
            }
        )

    return {"connections": result}
