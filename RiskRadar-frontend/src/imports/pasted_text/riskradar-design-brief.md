We are providing our existing Figma folder/design for a Smart India Hackathon (SIH) project called **RiskRadar**.

Your job is to **modify and improve the existing design**, NOT create a completely different design from scratch.

Keep the existing visual style, layout, components, colors, typography, and overall structure wherever possible. Only make the changes required below.

# PROJECT

**Name:** RiskRadar

**Subtitle:** AI-Powered Predictive Safety Intelligence

RiskRadar is an industrial safety intelligence platform.

The MAIN innovation is:

**Predicting potential future safety failures BEFORE they occur.**

RiskRadar combines:

**Sensor Data + Worker Observations + Historical Patterns + AI/NLP**

to identify developing risks and predict potential future equipment/safety failures.

SIF precursor detection, historical reports, causal-failure chains, and the heatmap are supporting features. **Predictive failure analysis must be visually and functionally presented as the CORE feature.**

---

# 1. KEEP THE EXISTING DESIGN

Start by understanding the existing Figma design.

Do NOT:

* Completely redesign the application
* Change the entire visual language
* Remove existing important screens
* Replace the current design unnecessarily

Instead:

* Keep the current design system
* Keep the current components where possible
* Improve existing screens
* Add the missing screens/features
* Make the user flow more logical
* Make predictive intelligence more prominent

The final result should look like the **same RiskRadar product, upgraded**, not like a completely new application.

---

# 2. LOGIN

Create/update the login screen with:

### RiskRadar

**AI-Powered Predictive Safety Intelligence**

Login options:

* Worker Login
* Safety Officer Login
* Demo Worker
* Demo Safety Officer

Keep the login screen consistent with the existing design.

---

# 3. MULTIPLE OIL FACILITIES

The current design focuses too much on Assam.

Update the design so RiskRadar supports multiple facilities.

Example demo facilities:

* Assam Facility
* Duliajan Facility
* Digboi Facility
* Numaligarh Facility
* Barauni Facility

Assam can remain the default facility.

But it must NOT appear as the only facility.

Use the hierarchy:

**Facility → Plant → Zone → Equipment → Sensors**

When the facility changes, the related plant, zone, equipment, sensor, report, prediction and heatmap information should visually change as well.

---

# 4. WORKER REPORTING

Keep the existing worker reporting experience, but make it clear that worker observations are important inputs for predictive analysis.

Worker can:

* Submit text report
* Submit voice report
* Use English
* Use Hindi
* Use Hinglish
* Chat with the AI
* Report abnormal equipment behavior
* Report unsafe conditions
* Report unusual sounds/vibration/temperature/etc.

Example:

> "Compressor se unusual vibration aa rahi hai."

The system should show that this observation can become an important signal for future-failure prediction.

---

# 5. DYNAMIC AI CHATBOT

Improve the existing conversational reporting screen.

The chatbot should NOT look like a fixed questionnaire.

It should appear intelligent and context-aware.

Example:

Worker:

> Compressor se unusual vibration aa rahi hai.

AI:

> I detected an unusual vibration observation related to a compressor. When did you first notice it?

Worker:

> Around 30 minutes ago.

AI:

> Has the vibration been increasing, or has it remained at the same level?

The exact questions should change according to the worker's report.

Design the conversation UI so it visually communicates:

**Worker Observation → AI Understanding → Relevant Follow-up Questions → Structured Safety Information**

---

# 6. PREDICTIVE SAFETY INTELLIGENCE — MAIN SCREEN

Create a major section called:

## Predictive Safety Intelligence

This should be one of the most prominent sections of the Safety Officer dashboard.

Show:

* Active Predictions
* Critical Predictions
* High-Risk Equipment
* Predicted Failures
* Escalating Equipment
* Sensor Anomalies
* Worker Observation Signals

Example prediction card:

### Potential Compressor Mechanical Failure

**Risk:** HIGH

**Score:** 84/100

**Prediction Horizon:** Next 24 Hours

**Confidence:** High

Evidence:

* Temperature increasing
* Vibration above baseline
* Multiple related worker observations
* Similar historical maintenance issue

Recommended Action:

**Inspect compressor bearing and related mechanical conditions.**

Do not use wording that says the failure is guaranteed.

Use:

* Potential Future Failure
* Elevated Failure Risk
* Predicted Risk
* Potential Failure Pathway

---

# 7. SHOW HOW THE PREDICTION IS CREATED

The UI must visually explain the intelligence behind the prediction.

Create an evidence section such as:

### Why is RiskRadar predicting this?

**Sensor Anomaly** +25
**Trend Escalation** +20
**Multi-Sensor Correlation** +15
**Worker Observations** +12
**Historical Recurrence** +8
**Equipment Criticality** +4

### Prediction Score: 84/100

This makes the prediction explainable instead of looking like a random AI-generated number.

---

# 8. SENSOR INTELLIGENCE

Create/update the sensor monitoring interface.

Show realistic industrial sensor data such as:

* Temperature
* Pressure
* Vibration
* Current
* Voltage
* Gas concentration
* Flow rate
* Humidity
* Motor RPM

Sensors should be connected visually to specific equipment.

Example:

**Compressor C-101**

* Temperature Sensor
* Pressure Sensor
* Vibration Sensor
* Current Sensor

Show graphs that demonstrate:

**Normal → Slight Deviation → Repeated Anomaly → Escalation → Current Risk**

Do NOT make the charts look random.

The purpose is to visually demonstrate that RiskRadar detects a developing pattern.

Clearly label demo data as:

**DEMO / SYNTHETIC SENSOR DATA**

---

# 9. SENSOR + WORKER OBSERVATION FUSION

Create a visual section showing how different evidence sources combine.

For example:

### Evidence Fusion

**Sensor Data**

* Vibration +23%
* Temperature increasing

-

**Worker Observations**

* "Compressor vibration unusual"
* "Unusual noise noticed"

-

**Historical Reports**

* Previous compressor maintenance issue

↓

### Emerging Pattern Detected

↓

### Potential Compressor Mechanical Failure

This should be visually prominent because this is the central innovation.

---

# 10. HISTORICAL PATTERN DETECTION

Create a section showing related historical reports.

Example:

### Related Historical Reports

* Similar compressor vibration report — 3 weeks ago
* Bearing maintenance issue — 2 weeks ago
* Abnormal temperature observation — 5 days ago

Show why these reports are relevant to the current prediction.

The UI should communicate:

**Current Signal + Historical Similarity = Stronger Evidence**

---

# 11. COMMON PATTERN DETECTION

Show how RiskRadar connects multiple worker reports.

Example:

Worker Report 1:

> Pump vibration increased.

↓

Worker Report 2:

> Pump making unusual noise.

↓

Worker Report 3:

> Pump temperature feels high.

↓

### Common Pattern Detected

**Possible Pump Mechanical Degradation**

↓

Compare with sensor readings.

This feature should visually show that individually small observations can become significant when combined.

---

# 12. POTENTIAL FAILURE PATHWAY

Keep the existing causal-failure-chain feature, but connect it directly to predictive analysis.

Rename/label it:

## Potential Failure Pathway

Example:

**Maintenance Issue**

↓

**Repeated Abnormal Vibration**

↓

**Worker Observation**

↓

**Temperature Escalation**

↓

### Potential Mechanical Failure

Important:

Do NOT present this as confirmed causality.

Use:

**Potential Failure Pathway**

---

# 13. PREDICTION TIMELINE

Create a visual timeline for a predicted failure.

Example:

**Normal State**

↓

**First Sensor Anomaly**

↓

**Worker Observation**

↓

**Repeated Anomaly**

↓

**Multiple Related Reports**

↓

**Escalating Sensor Trend**

↓

### CURRENT STATE

↓

### POTENTIAL FUTURE FAILURE

This is important for the SIH presentation because judges should immediately understand:

**RiskRadar identifies developing risk BEFORE the failure occurs.**

---

# 14. PREDICTIVE HEATMAP

Update the existing Live Threat Heatmap.

It should show both:

### Current Risk

and

### Predicted Risk

Example:

| Zone   | Current Risk | Predicted Risk |
| ------ | ------------ | -------------- |
| Zone A | Medium       | Medium         |
| Zone B | High         | Critical       |
| Zone C | Low          | High           |

The heatmap should answer two questions:

**Where is the problem now?**

and

**Where is the risk developing?**

Make the predictive aspect visually obvious.

---

# 15. PREDICTION INVESTIGATION PAGE

When a Safety Officer clicks a prediction, create a detailed investigation page.

Show:

### Predicted Future Failure

**Equipment:** Compressor C-101
**Facility:** Assam Facility
**Zone:** Zone B
**Possible Failure Mode:** Mechanical Degradation
**Risk:** HIGH
**Score:** 84/100
**Prediction Horizon:** Next 24 Hours
**Confidence:** HIGH

Then show:

### Sensor Evidence

Temperature:
72°C → 85°C

Vibration:
+23% above baseline

Current:
+11% above baseline

### Worker Evidence

3 related worker observations.

### Historical Evidence

2 similar maintenance observations.

### Pattern Detected

Temperature and vibration increased together while similar worker observations also increased.

### Potential Failure Pathway

Maintenance Issue
→ Repeated Abnormal Vibration
→ Worker Observation
→ Temperature Escalation
→ Potential Mechanical Failure

### Recommended Action

Inspect the equipment and relevant maintenance/safety conditions.

---

# 16. FACILITY / FILTER DESIGN

Make all filters visually functional and consistent.

Include:

* Facility
* Plant
* Zone
* Equipment
* Hazard
* Risk Level
* Report Type
* Time Range
* Prediction Horizon
* Status

Use dependent selection:

**Facility → Plant → Zone → Equipment**

The design should make it obvious that changing these filters changes the displayed information.

---

# 17. WORKER → PREDICTION FLOW

Make the complete product flow clear.

Design the screens so the following journey is obvious:

**Worker Login**

↓

**Worker Reports an Observation**

↓

**AI Asks Relevant Questions**

↓

**NLP Understands the Report**

↓

**Sensor Data is Checked**

↓

**Historical Reports are Compared**

↓

**Common Patterns are Detected**

↓

**Evidence is Combined**

↓

**Potential Failure is Predicted**

↓

**Safety Officer is Alerted**

↓

**Officer Investigates**

↓

**Preventive Action**

---

# 18. SAFETY OFFICER DASHBOARD

The Safety Officer dashboard should prioritize predictive information.

Top-level sections should include:

### Predictive Safety Intelligence

### Active Predictions

### High-Risk Equipment

### Sensor Anomalies

### Human Observation Signals

### Predictive Risk Heatmap

### Potential Failure Pathways

### Recent Worker Reports

### Historical Patterns

The dashboard should feel like a **safety command center**, not just a report management dashboard.

---

# 19. VISUAL HIERARCHY

The most important information should receive the strongest visual emphasis:

### 1. Potential Future Failure

### 2. Risk Level / Prediction Score

### 3. Evidence

### 4. Prediction Horizon

### 5. Affected Equipment / Location

### 6. Potential Failure Pathway

### 7. Recommended Preventive Action

SIF detection and normal report analytics should remain available but should not visually overpower predictive intelligence.

---

# 20. DEMO SCENARIO

Design the screens around this main SIH demonstration:

### Worker

> "Compressor se unusual vibration aa rahi hai."

↓

AI asks relevant questions.

↓

NLP identifies:

**Equipment:** Compressor
**Observation:** Unusual vibration
**Possible Issue:** Mechanical abnormality

↓

System checks sensors.

**Vibration increasing**

**Temperature increasing**

↓

Historical search finds similar observations.

↓

RiskRadar combines:

**Sensor Trend + Multi-Sensor Anomaly + Worker Observations + Historical Recurrence + Equipment Criticality**

↓

### Prediction

**Potential Compressor Mechanical Failure**

**HIGH RISK**

**Next 24 Hours**

↓

Safety Officer sees:

* Active prediction
* Evidence
* Related reports
* Sensor graphs
* Potential failure pathway
* Predictive heatmap
* Recommended action

---

# 21. OVERALL PRODUCT MESSAGE

The design should communicate this difference:

### Traditional Safety

**Report → Analyze → React**

### RiskRadar

**Sensor Signal + Worker Observation + Historical Pattern**

↓

**Detect Emerging Pattern**

↓

**Predict Potential Failure**

↓

**Alert Safety Officer**

↓

**Prevent Incident**

This should be one of the strongest visual messages in the product.

---

# 22. IMPORTANT DESIGN RULES

Keep the application:

* Professional
* Industrial
* Enterprise-grade
* Clean
* Easy to understand
* SIH presentation-friendly
* Technically credible

Avoid:

* Excessive futuristic AI graphics
* Unnecessary animations
* Overloaded dashboards
* Fake-looking AI visuals
* Too many cards
* Random statistics
* Decorative features with no purpose

The interface should look like a **real industrial safety intelligence platform**.

---

# FINAL GOAL

After modifying the provided Figma folder, RiskRadar should clearly communicate:

> **RiskRadar doesn't just detect what went wrong. It identifies signals that suggest what could go wrong next.**

The entire design should revolve around:

**Sensor Data + Worker Observations + Historical Patterns**

↓

**Evidence Fusion**

↓

**Emerging Risk Detection**

↓

**Predictive Failure Analysis**

↓

**Early Safety Intervention**

Do not remove the existing useful features. Upgrade and connect them around this central predictive-safety concept.