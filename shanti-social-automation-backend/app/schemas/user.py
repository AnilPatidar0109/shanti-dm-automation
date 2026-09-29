from typing import Optional
from pydantic import BaseModel, EmailStr, ConfigDict

# Shared properties
class UserBase(BaseModel):
    email: Optional[EmailStr] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    business_name: Optional[str] = None
    country: Optional[str] = None
    account_type: Optional[str] = None
    is_active: Optional[bool] = True
    is_superuser: bool = False


# Properties to receive via API on creation
class UserCreate(UserBase):
    email: EmailStr
    password: str


class UserRegister(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    business_name: str
    country: str
    account_type: str
    password: str


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


# Properties to receive via API on update
class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    password: Optional[str] = None
    is_active: Optional[bool] = None
    is_superuser: Optional[bool] = None


# Properties to return to client
class User(UserBase):
    id: int

    model_config = ConfigDict(from_attributes=True)


# Database representation
class UserInDBBase(UserBase):
    id: int
    hashed_password: str

    model_config = ConfigDict(from_attributes=True)


# JWT Token Schemas
class Token(BaseModel):
    access_token: str
    token_type: str


class TokenPayload(BaseModel):
    sub: Optional[int] = None
