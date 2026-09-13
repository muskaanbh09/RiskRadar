import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Prediction, User
from ..security import get_current_user

router=APIRouter(prefix="/predictions",tags=["Predictions"])

def out(p):
    return {"id":p.id,"title":p.title,"equipment":p.equipment,"facility":p.facility,"zone":p.zone,"plant":p.plant,"failureMode":p.failure_mode,"risk":p.risk,"score":p.score,"horizon":p.horizon,"confidence":p.confidence,"status":p.status,"createdAt":p.created_at,"evidence":[*json.loads(p.evidence_json)],"sensorReadings":json.loads(p.sensor_json),"workerObservations":json.loads(p.observations_json),"historicalMatches":json.loads(p.history_json),"pathway":json.loads(p.pathway_json),"recommendedAction":p.recommended_action}

@router.get("")
def list_predictions(db:Session=Depends(get_db),user:User=Depends(get_current_user)):
    return [out(p) for p in db.query(Prediction).order_by(Prediction.score.desc()).all()]

@router.get("/{prediction_id}")
def get_prediction(prediction_id:str,db:Session=Depends(get_db),user:User=Depends(get_current_user)):
    p=db.get(Prediction,prediction_id)
    if not p: raise HTTPException(404,"Prediction not found")
    return out(p)
