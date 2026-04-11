import os

from dotenv import load_dotenv
from pymongo import MongoClient
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
        if "users" not in self.db.list_collection_names():
            self.db.create_collection("users")


def get_mongo_connection() -> MongoConnection:
    return MongoConnection()
