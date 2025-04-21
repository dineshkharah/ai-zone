from pydantic import BaseModel

class UserLogin(BaseModel):
    email: str
    password: str

class UserCreate(UserLogin):
    role: str
