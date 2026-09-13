from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Report, User
from ..schemas import ReportCreate, ReportOut
from ..security import get_current_user
from ..analysis import analyze_text

router=APIRouter(prefix="/reports",tags=["Reports"])

def out(r):
    return {"id":r.id,"date":r.date,"time":r.time,"zone":r.zone,"equipment":r.equipment,"description":r.description,"hazard":r.hazard,"risk":r.risk,"status":r.status,"isSIF":r.is_sif,"reporterType":r.reporter_type}

@router.get("",response_model=list[ReportOut])
def list_reports(limit:int=100, db:Session=Depends(get_db), user:User=Depends(get_current_user)):
    return [out(r) for r in db.query(Report).order_by(Report.id.desc()).limit(limit).all()]

@router.get("/{report_id}",response_model=ReportOut)
def get_report(report_id:str,db:Session=Depends(get_db),user:User=Depends(get_current_user)):
    r=db.get(Report,report_id)
    if not r: raise HTTPException(404,"Report not found")
    return out(r)

@router.post("",response_model=ReportOut,status_code=201)
def create_report(payload:ReportCreate,db:Session=Depends(get_db),user:User=Depends(get_current_user)):
    existing=[int(x.id.split("-")[1]) for x in db.query(Report).all() if x.id.startswith("R-") and x.id[2:].isdigit()]
    rid=f"R-{max(existing,default=1092)+1}"
    a=analyze_text(payload.description)
    now=datetime.now()
    r=Report(id=rid,date=now.strftime("%d %b %Y"),time=now.strftime("%I:%M %p"),zone=payload.zone,equipment=payload.equipment,description=payload.description,hazard=payload.hazard if payload.hazard!="Other" else a["hazard"],risk=a["risk"],status="Open",is_sif=a["isSIF"],reporter_type=payload.reporter_type)
    db.add(r); db.commit(); db.refresh(r)
    return out(r)
