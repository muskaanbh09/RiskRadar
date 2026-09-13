from fastapi import APIRouter, Depends
from ..schemas import AnalyzeRequest, AnalysisOut
from ..security import get_current_user
from ..models import User
from ..analysis import analyze_text
router=APIRouter(prefix="/analysis",tags=["NLP Analysis"])

@router.post("/analyze",response_model=AnalysisOut)
def analyze(payload:AnalyzeRequest,user:User=Depends(get_current_user)):
    return analyze_text(payload.text)
