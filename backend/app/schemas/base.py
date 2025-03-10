from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class BaseResponse(BaseModel):
    success: bool = True
    message: str = "Operation successful"

class ErrorResponse(BaseModel):
    success: bool = False
    error: str
    details: Optional[str] = None 