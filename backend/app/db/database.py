from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.database import Database
from app.core.config import settings

client = AsyncIOMotorClient(settings.MONGODB_URL)
db = client[settings.MONGODB_DB_NAME]

def get_database() -> Database:
    return db

def get_collection(collection_name: str):
    """Get collection from database."""
    return get_database()[collection_name]

async def connect_to_mongo():
    """Create database connection."""
    # Connection is already established when importing the module
    # This function is kept for compatibility with the startup event
    pass

async def close_mongo_connection():
    """Close database connection."""
    client.close() 