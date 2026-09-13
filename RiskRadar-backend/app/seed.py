import json
from .database import Base, engine, SessionLocal
from .models import User, Report, Prediction, SensorReading
from .security import hash_password

REPORTS = [
("R-1092","11 Sep 2026","10:42 AM","Zone B","Compressor C-101","Compressor se unusual vibration aa rahi hai. Floor bhi thoda slippery lag raha hai.","Electrical","HIGH","Investigate",True,"Frontline Worker"),
("R-1089","11 Sep 2026","09:31 AM","Zone B","Compressor C-101","Compressor making unusual grinding noise since morning shift started.","Mechanical","HIGH","Open",True,"Frontline Worker"),
("R-1085","11 Sep 2026","08:52 AM","Zone B","Compressor C-101","Body of compressor feels unusually hot. Hotter than normal operating temperature.","Equipment","HIGH","Monitoring",False,"Frontline Worker"),
("R-1079","10 Sep 2026","03:00 PM","Zone D","Pump P-312","Oil seepage noticed near pump base. Floor slippery. No warning signs placed.","Equipment","MEDIUM","Monitoring",False,"Frontline Worker"),
("R-1078","05 Sep 2026","02:20 PM","Zone B","Compressor C-101","Unsafe maintenance workaround — bypass valve opened manually due to faulty actuator.","Maintenance","HIGH","Investigate",True,"Contractor"),
("R-1065","08 Sep 2026","04:10 PM","Zone E","Heat Exchanger H-07","Pressure gauge reading abnormal. Operator unsure if instrument fault or process deviation.","Process","MEDIUM","Monitoring",False,"Frontline Worker"),
("R-1058","07 Sep 2026","01:45 PM","Zone C","Valve V-331","Near miss — valve handwheel caught worker's sleeve during manual operation.","Mechanical","MEDIUM","Open",False,"Frontline Worker"),
("R-1041","03 Sep 2026","11:05 AM","Zone B","Compressor C-101","Equipment condition unclear after service. No post-maintenance inspection recorded.","Equipment","MEDIUM","Closed",False,"Supervisor")
]
PREDICTIONS = [
dict(id="PRED-001",title="Potential Compressor Mechanical Failure",equipment="Compressor C-101",facility="Assam Facility",zone="Zone B",plant="Gas Processing Plant",failure_mode="Mechanical Degradation",risk="HIGH",score=84,horizon="Next 24 Hours",confidence="High",status="Active",created_at="11 Sep 2026 · 09:15 AM",
evidence=[{"type":"Sensor Anomaly","points":25,"desc":"Vibration 23% above baseline; temperature rising +13°C over 6h"},{"type":"Trend Escalation","points":20,"desc":"Both vibration and temperature show upward trend for 18 hours"},{"type":"Multi-Sensor Correlation","points":15,"desc":"Vibration, temperature, and current anomalies occurring simultaneously"},{"type":"Worker Observations","points":12,"desc":"3 related worker reports in last 8 hours — vibration, noise, heat"},{"type":"Historical Recurrence","points":8,"desc":"Similar sensor+worker pattern preceded bearing failure 3 months ago"},{"type":"Equipment Criticality","points":4,"desc":"C-101 is a tier-1 critical asset; failure affects downstream processing"}],
sensors=[{"sensor":"Temperature","unit":"°C","baseline":68,"current":85,"delta":"+25%","status":"Critical"},{"sensor":"Vibration","unit":"mm/s","baseline":2.1,"current":2.6,"delta":"+23%","status":"High"},{"sensor":"Current Draw","unit":"A","baseline":42,"current":46.7,"delta":"+11%","status":"Elevated"},{"sensor":"Motor RPM","unit":"rpm","baseline":2950,"current":2891,"delta":"-2%","status":"Watch"}],
observations=[{"id":"R-1092","text":"Compressor se unusual vibration aa rahi hai.","time":"08:30 AM"},{"id":"R-1089","text":"Compressor making unusual grinding noise.","time":"07:45 AM"},{"id":"R-1085","text":"Body of compressor feels hot, more than usual.","time":"06:20 AM"}],
history=[{"desc":"Similar vibration + temp pattern → bearing replacement","date":"12 Jun 2026","similarity":"Very similar"},{"desc":"Abnormal current draw preceded motor winding fault","date":"28 Jul 2026","similarity":"Similar"}],
pathway=["Scheduled Maintenance Missed","Repeated Abnormal Vibration","Worker Observations Filed","Temperature Escalation","Potential Mechanical Failure"],
action="Inspect compressor bearing and mechanical seals. Verify lubrication levels. Consider planned shutdown before failure occurs."),
dict(id="PRED-002",title="Potential Pump Seal Failure",equipment="Pump P-312",facility="Assam Facility",zone="Zone D",plant="Gas Processing Plant",failure_mode="Seal Degradation",risk="MEDIUM",score=61,horizon="Next 72 Hours",confidence="Medium",status="Active",created_at="11 Sep 2026 · 07:40 AM",
evidence=[{"type":"Sensor Anomaly","points":18,"desc":"Pressure differential showing increasing variance"},{"type":"Worker Observations","points":14,"desc":"2 observations of oil seepage near pump base"},{"type":"Trend Escalation","points":12,"desc":"Flow rate efficiency declining over past 4 days"},{"type":"Historical Recurrence","points":10,"desc":"Seal failure preceded by similar pattern 6 months ago"},{"type":"Equipment Criticality","points":7,"desc":"Tier-2 asset; redundant pump available"}],
sensors=[{"sensor":"Pressure Delta","unit":"bar","baseline":4.2,"current":3.8,"delta":"-10%","status":"Elevated"},{"sensor":"Flow Rate","unit":"m³/h","baseline":120,"current":109,"delta":"-9%","status":"Watch"},{"sensor":"Temperature","unit":"°C","baseline":55,"current":61,"delta":"+11%","status":"Elevated"}],
observations=[{"id":"R-1079","text":"Oil seepage noticed near pump base.","time":"10 Sep · 03:00 PM"},{"id":"R-1071","text":"Pump flow seems lower than normal.","time":"09 Sep · 11:20 AM"}],history=[{"desc":"Seal failure — similar pressure drop pattern","date":"14 Mar 2026","similarity":"Similar"}],
pathway=["Flow Efficiency Decline","Pressure Deviation","Worker Seepage Observation","Potential Seal Failure"],action="Inspect pump mechanical seal and bearing housing. Check lubrication system. Plan seal replacement during next maintenance window."),
dict(id="PRED-003",title="Potential Heat Exchanger Fouling",equipment="Heat Exchanger H-07",facility="Assam Facility",zone="Zone E",plant="Gas Processing Plant",failure_mode="Thermal Fouling",risk="MEDIUM",score=53,horizon="Next 5 Days",confidence="Medium",status="Monitoring",created_at="10 Sep 2026 · 02:10 PM",
evidence=[{"type":"Sensor Anomaly","points":16,"desc":"Heat transfer efficiency declining 8% over 7 days"},{"type":"Trend Escalation","points":14,"desc":"Outlet temperature consistently lower than expected"},{"type":"Worker Observations","points":8,"desc":"One report of process deviation observed by operator"},{"type":"Historical Recurrence","points":15,"desc":"Fouling cycle consistent with previous 3-month intervals"}],
sensors=[{"sensor":"Outlet Temp","unit":"°C","baseline":95,"current":87,"delta":"-8%","status":"Elevated"},{"sensor":"Pressure Drop","unit":"bar","baseline":0.8,"current":1.2,"delta":"+50%","status":"High"},{"sensor":"Flow Efficiency","unit":"%","baseline":100,"current":91,"delta":"-9%","status":"Watch"}],
observations=[{"id":"R-1065","text":"Process temperature reading abnormal. Operator unsure if instrument or process.","time":"08 Sep · 04:10 PM"}],history=[{"desc":"Fouling event — same pattern 3 months prior","date":"07 Jun 2026","similarity":"Very similar"}],
pathway=["Heat Transfer Efficiency Drop","Pressure Drop Increase","Operator Observation","Potential Fouling Failure"],action="Schedule chemical cleaning of heat exchanger. Inspect tube bundle. Compare with fouling history to estimate cleaning interval.")
]

def seed():
    Base.metadata.create_all(bind=engine)
    db=SessionLocal()
    try:
        if not db.query(User).first():
            db.add_all([
                User(name="Rajesh Kumar",username="worker",password_hash=hash_password("worker123"),role="worker"),
                User(name="Safety Officer",username="officer",password_hash=hash_password("officer123"),role="officer")
            ])
        if not db.query(Report).first():
            for r in REPORTS:
                db.add(Report(id=r[0],date=r[1],time=r[2],zone=r[3],equipment=r[4],description=r[5],hazard=r[6],risk=r[7],status=r[8],is_sif=r[9],reporter_type=r[10]))
        if not db.query(Prediction).first():
            for p in PREDICTIONS:
                db.add(Prediction(id=p["id"],title=p["title"],equipment=p["equipment"],facility=p["facility"],zone=p["zone"],plant=p["plant"],failure_mode=p["failure_mode"],risk=p["risk"],score=p["score"],horizon=p["horizon"],confidence=p["confidence"],status=p["status"],created_at=p["created_at"],evidence_json=json.dumps(p["evidence"]),sensor_json=json.dumps(p["sensors"]),observations_json=json.dumps(p["observations"]),history_json=json.dumps(p["history"]),pathway_json=json.dumps(p["pathway"]),recommended_action=p["action"]))
        db.commit()
    finally: db.close()
