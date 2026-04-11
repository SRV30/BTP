import os

from dotenv import load_dotenv
from pymongo import MongoClient
from pymongo.collection import Collection
from pymongo.database import Database

load_dotenv()


class MongoConnection:
    def __init__(self) -> None:
        self.mongo_uri = os.getenv("MONGO_URI")
        if not self.mongo_uri:
            raise ValueError("MONGO_URI is not set. Please configure it in .env")
        self.client = MongoClient(self.mongo_uri)
        self.db: Database = self.client.get_default_database()

    def ensure_users_collection(self) -> None:
        users = self.get_users_collection()
        users.create_index("email", unique=True)

    def ensure_daily_logs_collection(self) -> None:
        daily_logs = self.get_daily_logs_collection()
        daily_logs.create_index([("user_id", 1), ("date", -1)], unique=True)

    def get_users_collection(self) -> Collection:
        return self.db["users"]

    def get_daily_logs_collection(self) -> Collection:
        return self.db["daily_logs"]


def get_mongo_connection() -> MongoConnection:
    return MongoConnection()
