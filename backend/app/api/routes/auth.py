from datetime import timedelta, datetime
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm

from app.core.config import settings
from app.core.security import (
    create_access_token,
    create_refresh_token,
    get_password_hash,
    verify_password,
)
from app.db.database import get_database
from app.schemas.user import Token, UserCreate, UserLogin, UserResponse

router = APIRouter()


@router.post("/signup", response_model=UserResponse)
async def create_user(user_in: UserCreate) -> Any:
    """
    Create new user.
    """
    db = get_database()
    
    # Check if user with this email already exists
    existing_user = await db.users.find_one({"email": user_in.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email already exists",
        )
    
    # Create new user
    user_data = user_in.dict()
    hashed_password = get_password_hash(user_data.pop("password"))
    user_data["hashed_password"] = hashed_password
    user_data["is_active"] = True
    user_data["created_at"] = datetime.now()
    user_data["updated_at"] = datetime.now()
    
    result = await db.users.insert_one(user_data)
    created_user = await db.users.find_one({"_id": result.inserted_id})
    
    return created_user


@router.post("/login", response_model=dict)
async def login(user_in: UserLogin) -> Any:
    """
    OAuth2 compatible token login, get an access token for future requests.
    """
    db = get_database()
    
    user = await db.users.find_one({"email": user_in.email})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    
    if not verify_password(user_in.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    
    # Create access and refresh tokens
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(str(user["_id"]), expires_delta=access_token_expires)
    refresh_token = create_refresh_token(str(user["_id"]))
    
    # Remove hashed_password from user data
    user.pop("hashed_password", None)
    
    # Convert ObjectId to string
    user["_id"] = str(user["_id"])
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user": user
    } 