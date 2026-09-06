import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr


class ProfileOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    user_id: uuid.UUID
    display_name: str | None = None
    organization: str | None = None
    role: str | None = None
    timezone: str | None = None
    created_at: datetime


class ProfileUpdate(BaseModel):
    display_name: str | None = None
    organization: str | None = None
    role: str | None = None
    timezone: str | None = None


class ChangePasswordIn(BaseModel):
    old_password: str
    new_password: str


class ForgotPasswordIn(BaseModel):
    email: EmailStr


class ResetPasswordIn(BaseModel):
    token: str
    new_password: str
