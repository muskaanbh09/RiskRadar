from fastapi import APIRouter, Depends
from ..security import get_current_user
from ..models import User
router=APIRouter(prefix="/sensors",tags=["Sensors"])

@router.get("/timeseries")
def timeseries(user:User=Depends(get_current_user)):
    return {
      "vibration":[{"t":"Sep 1","v":2.1,"label":"Normal"},{"t":"Sep 3","v":2.2},{"t":"Sep 5","v":2.1},{"t":"Sep 6","v":2.3,"label":"First Anomaly"},{"t":"Sep 7","v":2.2},{"t":"Sep 8","v":2.4},{"t":"Sep 9","v":2.5,"label":"Repeated Anomaly"},{"t":"Sep 10","v":2.5},{"t":"Sep 11","v":2.6,"label":"Escalating"}],
      "temperature":[{"t":"Sep 1","v":68},{"t":"Sep 3","v":69},{"t":"Sep 5","v":70},{"t":"Sep 6","v":72,"label":"Rising"},{"t":"Sep 7","v":74},{"t":"Sep 8","v":78},{"t":"Sep 9","v":81,"label":"Escalating"},{"t":"Sep 10","v":83},{"t":"Sep 11","v":85,"label":"Current"}],
      "current":[{"t":"Sep 1","v":42},{"t":"Sep 3","v":42.2},{"t":"Sep 5","v":42.1},{"t":"Sep 6","v":43},{"t":"Sep 7","v":43.5},{"t":"Sep 8","v":44.2},{"t":"Sep 9","v":45.1},{"t":"Sep 10","v":45.9},{"t":"Sep 11","v":46.7,"label":"Current"}]
    }
