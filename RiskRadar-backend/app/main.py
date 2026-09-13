from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .database import Base, engine
from .seed import seed
from .routers import auth, reports, predictions, dashboard, sensors, analysis

app=FastAPI(title=settings.app_name,version="1.0.0",description="Backend API for the RiskRadar industrial safety intelligence platform.")

origins=[x.strip() for x in settings.cors_origins.split(",") if x.strip()]
app.add_middleware(CORSMiddleware,allow_origins=origins,allow_credentials=True,allow_methods=["*"],allow_headers=["*"])

@app.on_event("startup")
def startup():
    seed()

@app.get("/")
def root():
    return {"name":"RiskRadar API","status":"online","docs":"/docs"}

@app.get("/health")
def health():
    return {"status":"healthy"}

app.include_router(auth.router)
app.include_router(reports.router)
app.include_router(predictions.router)
app.include_router(dashboard.router)
app.include_router(sensors.router)
app.include_router(analysis.router)
