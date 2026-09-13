import json
from collections import Counter
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Report, Prediction, User
from ..security import get_current_user

router=APIRouter(prefix="/dashboard",tags=["Dashboard"])

@router.get("/summary")
def summary(db:Session=Depends(get_db),user:User=Depends(get_current_user)):
    reports=db.query(Report).all(); preds=db.query(Prediction).all()
    return {
      "totalReports":len(reports),
      "sifReports":sum(r.is_sif for r in reports),
      "highRiskReports":sum(r.risk in ("HIGH","CRITICAL") for r in reports),
      "activePredictions":sum(p.status=="Active" for p in preds),
      "criticalPredictions":sum(p.risk=="CRITICAL" for p in preds),
      "openInvestigations":sum(r.status=="Investigate" for r in reports),
      "hazardCategories":[{"name":k,"count":v} for k,v in Counter(r.hazard for r in reports).most_common()],
    }

@router.get("/heatmap")
def heatmap(db:Session=Depends(get_db),user:User=Depends(get_current_user)):
    zones={}
    for r in db.query(Report).all():
        z=zones.setdefault(r.zone,{"id":r.zone[-1:],"name":r.zone,"sif":0,"highRisk":0,"reports":0})
        z["reports"]+=1; z["sif"]+=int(r.is_sif); z["highRisk"]+=int(r.risk in ("HIGH","CRITICAL"))
    for p in db.query(Prediction).all():
        z=zones.setdefault(p.zone,{"id":p.zone[-1:],"name":p.zone,"sif":0,"highRisk":0,"reports":0})
        z["activePredictions"]=z.get("activePredictions",0)+int(p.status=="Active")
    return list(zones.values())

@router.get("/analytics")
def analytics(db:Session=Depends(get_db),user:User=Depends(get_current_user)):
    reports=db.query(Report).all()
    return {"riskDistribution":dict(Counter(r.risk for r in reports)),"statusDistribution":dict(Counter(r.status for r in reports)),"reporterDistribution":dict(Counter(r.reporter_type for r in reports))}

@router.get("/trends")
def trends(user:User=Depends(get_current_user)):
    return [{"week":"Week 1","sif":5,"predictions":2,"reports":28},{"week":"Week 2","sif":7,"predictions":3,"reports":35},{"week":"Week 3","sif":11,"predictions":5,"reports":42},{"week":"Week 4","sif":15,"predictions":6,"reports":51}]
