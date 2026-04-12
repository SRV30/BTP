from datetime import datetime, timezone


def build_user_document(email: str, hashed_password: str) -> dict:
    return {
        "email": email,
        "hashed_password": hashed_password,
        "created_at": datetime.now(timezone.utc),
        "connections": [],
        "incoming_requests": [],
        "outgoing_requests": [],
    }
