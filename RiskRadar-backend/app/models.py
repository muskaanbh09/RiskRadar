from datetime import datetime
from sqlalchemy import String, Text, Integer, Boolean, Float, DateTime
from sqlalchemy.orm import Mapped, mapped_column
from .database import Base

class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(120))
    username: Mapped[str] = mapped_column(String(120), unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(300))
    role: Mapped[str] = mapped_column(String(30), default="worker")

class Report(Base):
    __tablename__ = "reports"
    id: Mapped[str] = mapped_column(String(30), primary_key=True)
    date: Mapped[str] = mapped_column(String(40))
    time: Mapped[str] = mapped_column(String(30))
    zone: Mapped[str] = mapped_column(String(50))
    equipment: Mapped[str] = mapped_column(String(120))
    description: Mapped[str] = mapped_column(Text)
    hazard: Mapped[str] = mapped_column(String(60))
    risk: Mapped[str] = mapped_column(String(20))
    status: Mapped[str] = mapped_column(String(30))
    is_sif: Mapped[bool] = mapped_column(Boolean, default=False)
    reporter_type: Mapped[str] = mapped_column(String(50))

class Prediction(Base):
    __tablename__ = "predictions"
    id: Mapped[str] = mapped_column(String(30), primary_key=True)
    title: Mapped[str] = mapped_column(String(180))
    equipment: Mapped[str] = mapped_column(String(120))
    facility: Mapped[str] = mapped_column(String(120))
    zone: Mapped[str] = mapped_column(String(50))
    plant: Mapped[str] = mapped_column(String(120))
    failure_mode: Mapped[str] = mapped_column(String(100))
    risk: Mapped[str] = mapped_column(String(20))
    score: Mapped[int] = mapped_column(Integer)
    horizon: Mapped[str] = mapped_column(String(60))
    confidence: Mapped[str] = mapped_column(String(30))
    status: Mapped[str] = mapped_column(String(30))
    created_at: Mapped[str] = mapped_column(String(60))
    evidence_json: Mapped[str] = mapped_column(Text, default="[]")
    sensor_json: Mapped[str] = mapped_column(Text, default="[]")
    observations_json: Mapped[str] = mapped_column(Text, default="[]")
    history_json: Mapped[str] = mapped_column(Text, default="[]")
    pathway_json: Mapped[str] = mapped_column(Text, default="[]")
    recommended_action: Mapped[str] = mapped_column(Text, default="")

class SensorReading(Base):
    __tablename__ = "sensor_readings"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    sensor: Mapped[str] = mapped_column(String(80))
    unit: Mapped[str] = mapped_column(String(30))
    value: Mapped[float] = mapped_column(Float)
    baseline: Mapped[float] = mapped_column(Float)
    zone: Mapped[str] = mapped_column(String(50))
    equipment: Mapped[str] = mapped_column(String(120))
    recorded_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
