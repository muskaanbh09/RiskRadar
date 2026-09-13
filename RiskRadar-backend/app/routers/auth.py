from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User
from ..schemas import LoginRequest, TokenResponse, UserOut
from ..security import verify_password, create_token, get_current_user

router=APIRouter(prefix="/auth",tags=["Authentication"])

@router.post("/login",response_model=TokenResponse)
def login(payload: LoginRequest, db: Session=Depends(get_db)):
    user=db.query(User).filter(User.username==payload.username).first()
    if not user or not verify_password(payload.password,user.password_hash):
        raise HTTPException(status_code=401,detail="Invalid username or password")
    return {"access_token":create_token(user),"user":user}

@router.get("/me",response_model=UserOut)
def me(user: User=Depends(get_current_user)):
    return user
