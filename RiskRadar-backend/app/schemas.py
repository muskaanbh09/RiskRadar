from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, Any

class LoginRequest(BaseModel):
    username: str
    password: str

class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    username: str
    role: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut

class ReportCreate(BaseModel):
    description: str = Field(min_length=3)
    zone: str = "Zone B"
    equipment: str = "Unspecified"
    hazard: str = "Other"
    reporter_type: str = "Frontline Worker"

class ReportOut(BaseModel):
    id: str
    date: str
    time: str
    zone: str
    equipment: str
    description: str
    hazard: str
    risk: str
    status: str
    isSIF: bool
    reporterType: str

class AnalyzeRequest(BaseModel):
    text: str
    zone: str = "Zone B"
    equipment: str = "Unspecified"

class AnalysisOut(BaseModel):
    risk: str
    score: int
    isSIF: bool
    hazard: str
    signals: list[str]
    recommendation: str
