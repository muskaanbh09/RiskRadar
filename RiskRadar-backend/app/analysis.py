import re

KEYWORDS = {
    "mechanical": ["vibration","grinding","noise","bearing","valve","handwheel","seal","pump"],
    "electrical": ["spark","shock","exposed wire","electrical","short circuit","current"],
    "process": ["pressure","temperature","flow","leak","gas","process deviation"],
    "maintenance": ["maintenance","bypass","workaround","repair","lockout","loto"],
}
HIGH = ["unusual vibration","grinding","spark","shock","gas leak","bypass","near miss","slippery","leak","hotter than normal","unsafe"]
SIF = ["near miss","gas leak","electrical shock","fire","explosion","bypass","caught","crush","fall","loss of containment"]

def analyze_text(text:str):
    t=text.lower()
    signals=[]
    for phrase in HIGH:
        if phrase in t: signals.append(phrase)
    score=min(95,25+len(signals)*10)
    if any(x in t for x in ["vibration","grinding","leak","gas","spark","shock","caught","crush"]): score += 10
    score=min(score,95)
    risk="CRITICAL" if score>=85 else "HIGH" if score>=70 else "MEDIUM" if score>=45 else "LOW"
    hazard="Other"
    for h, words in KEYWORDS.items():
        if any(w in t for w in words): hazard=h.title(); break
    is_sif=any(x in t for x in SIF) or score>=80
    rec="Immediate supervisor review and field verification recommended." if score>=70 else "Monitor and verify the reported condition."
    return {"risk":risk,"score":score,"isSIF":is_sif,"hazard":hazard,"signals":signals,"recommendation":rec}
