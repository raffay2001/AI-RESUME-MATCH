from typing import Any, Dict, List, Optional, TypeVar, Generic, Type
from pydantic import BaseModel
from bson import ObjectId
from app.db.database import get_collection

T = TypeVar('T', bound=BaseModel)

class BaseService(Generic[T]):
    def __init__(self, collection_name: str, model: Type[T]):
        self.collection = get_collection(collection_name)
        self.model = model
    
    async def get_by_id(self, id: str) -> Optional[T]:
        """Get a document by ID"""
        if not ObjectId.is_valid(id):
            return None
        document = await self.collection.find_one({"_id": ObjectId(id)})
        if document:
            return self.model(**document)
        return None
    
    async def get_all(self, skip: int = 0, limit: int = 100) -> List[T]:
        """Get all documents with pagination"""
        cursor = self.collection.find().skip(skip).limit(limit)
        documents = await cursor.to_list(length=limit)
        return [self.model(**doc) for doc in documents]
    
    async def create(self, data: Dict[str, Any]) -> T:
        """Create a new document"""
        result = await self.collection.insert_one(data)
        document = await self.collection.find_one({"_id": result.inserted_id})
        return self.model(**document)
    
    async def update(self, id: str, data: Dict[str, Any]) -> Optional[T]:
        """Update a document"""
        if not ObjectId.is_valid(id):
            return None
        
        # Don't update _id field
        if "_id" in data:
            del data["_id"]
            
        result = await self.collection.update_one(
            {"_id": ObjectId(id)},
            {"$set": data}
        )
        
        if result.modified_count:
            return await self.get_by_id(id)
        return None
    
    async def delete(self, id: str) -> bool:
        """Delete a document"""
        if not ObjectId.is_valid(id):
            return False
        
        result = await self.collection.delete_one({"_id": ObjectId(id)})
        return result.deleted_count > 0 