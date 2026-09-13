Design a complete, realistic, production-style web application UI for an industrial safety intelligence platform based on this problem:

“AI/NLP Engine to Detect Serious Injury & Fatality (SIF) Precursors in OIL's Unsafe-Act/Unsafe-Condition and Near-Miss Reports.”

The product should NOT look like a generic AI chatbot or generic admin dashboard. It should look like a serious industrial safety monitoring system that could realistically be used by safety officers and frontline workers in an oil and gas environment.

CORE PRODUCT IDEA:

The system receives safety reports from frontline workers through text or voice. AI/NLP understands the report, asks follow-up questions when important information is missing, detects potential SIF precursors, searches historical reports for related events, identifies possible hidden causal-failure chains, and shows the resulting risk on a safety officer dashboard and plant threat heatmap.

MAIN TECHNICAL FLOW:

Worker Report
→ Voice/Text Input
→ Conversational Clarification
→ NLP Information Extraction
→ SIF Precursor Detection
→ Historical Report Search
→ Related Report Matching
→ Potential Causal-Failure Chain Detection
→ Risk Analysis
→ Plant Threat Heatmap
→ Safety Officer Dashboard

DESIGN TWO MAIN USER EXPERIENCES:

1. FRONTLINE WORKER INTERFACE
2. SAFETY OFFICER / ANALYST DASHBOARD

---

## GLOBAL DESIGN LANGUAGE

Use a professional industrial safety visual language.

Style:

* Modern enterprise SaaS
* Industrial control-room feel
* Clean and serious
* Minimal but visually impressive
* High information clarity
* No unnecessary decorative elements
* No futuristic sci-fi graphics
* No excessive gradients
* No cartoon illustrations

Use:

* White/light neutral surfaces
* Dark navy/charcoal text
* Safety-oriented amber/orange/red for warnings
* Green only for safe/normal states
* Subtle borders and shadows
* Rounded cards but not overly rounded
* Strong hierarchy
* Clear status badges
* Professional charts and data visualizations

Typography:
Use a modern font such as Inter.

Create a consistent design system:

* 8px spacing system
* Consistent card radius
* Consistent button styles
* Consistent status colors
* Reusable components
* Consistent icons

The interface should look like a real enterprise safety product rather than a student project.

---

## SCREEN 1 — WORKER REPORTING HOME

Create a simple mobile-friendly worker reporting screen.

Header:

* Company/project logo placeholder
* “Safety Report”
* Worker profile/status

Main heading:
“Report a Safety Issue”

Subheading:
“Report unsafe acts, unsafe conditions, or near misses.”

Large input card:

“Describe what you observed…”

Placeholder:
“Example: Wire open hai near compressor…”

Include two input methods:

[ Type Report ]

[ 🎙 Speak ]

Location selector:
“Plant / Zone”
Example:
“Assam Facility → Compressor Area → Zone B”

Optional equipment selector:
“Equipment”
Example:
“Compressor C-204”

Large primary button:
“Continue”

Keep this screen extremely simple because a frontline worker should be able to report something quickly with minimum friction.

---

## SCREEN 2 — VOICE REPORTING

Design the voice reporting state.

Large microphone button in the center.

Text:
“Listening…”

Show live speech transcription:

“Compressor ke paas oil leak hai aur floor slippery hai.”

Below:
[ Stop Recording ]

After recording:
[ Use Report ]

[ Record Again ]

Show language indicator:
“Hinglish detected”

Do not make this look like a generic voice assistant.

---

## SCREEN 3 — CONVERSATIONAL REPORTING

Design a chat-style safety reporting interface.

Title:
“Complete your safety report”

System message:

“I need a little more information to assess the safety risk.”

Worker message:

“Wire open hai.”

AI asks:

“Where is the exposed wire located?”

Worker:
“Near compressor.”

AI asks:

“Is the equipment currently running?”

Worker:
“Yes.”

AI asks only relevant safety questions.

Show progress indicator:
“Report completeness: 80%”

At the bottom:
[ Type your answer... ] [🎙]

Primary button:
“Analyze Report”

The bot should feel like a structured safety-report assistant, NOT ChatGPT.

---

## SCREEN 4 — REPORT ANALYSIS

Create an AI processing screen.

Title:
“Analyzing Safety Report”

Show a vertical processing pipeline:

✓ Report received
✓ Information extracted
✓ Hazard identified
● Checking SIF indicators
○ Searching historical reports
○ Checking related events
○ Building risk picture

Show subtle progress animation/state.

After completion, transition to the result screen.

---

## SCREEN 5 — REPORT RESULT / SIF DETECTION

Create a detailed report analysis screen.

Header:
“Safety Report Analysis”

Show the original report:

“Exposed electrical wire near compressor. Equipment is running and worker exposure is possible.”

Create an information extraction card:

Detected Information:

Hazard:
Electrical exposure

Equipment:
Compressor C-204

Location:
Zone B

Condition:
Equipment energized

Worker exposure:
Possible

Then create a prominent risk card:

“POTENTIAL SIF PRECURSOR”

Risk Level:
HIGH

Show reasons:

✓ Electrical hazard detected
✓ Energized equipment
✓ Worker exposure possible
✓ Related hazardous conditions detected

Do NOT display fake precision such as “98.7% accuracy”.

Instead show explainable reasons.

Include:
“Why was this flagged?”

Clicking this should reveal the detected safety indicators.

---

## SCREEN 6 — RELATED HISTORICAL REPORTS

Create a screen showing how the current report connects with historical reports.

Title:
“Related Historical Reports”

Subtitle:
“Potentially connected events found in the same operational context.”

Show 3–5 report cards.

Example:

R-1024
Maintenance delayed
Compressor Area
01 Sep 2026

R-1041
Equipment condition unclear
Compressor Area
03 Sep 2026

R-1078
Unsafe maintenance workaround
Compressor Area
05 Sep 2026

R-1092
Near miss during maintenance
Compressor Area
07 Sep 2026

Each card should show:

* Report ID
* Date
* Zone
* Equipment
* Short description
* Relationship indicators

Example badges:
“Same equipment”
“Same zone”
“Earlier event”
“Semantically related”

Show a small “Connection strength” indicator, but avoid fake scientific percentages.

---

## SCREEN 7 — HIDDEN CAUSAL-FAILURE CHAIN

This is the MOST IMPORTANT innovation screen.

Create a visual causal chain.

Title:
“Potential Causal-Failure Chain”

Subtitle:
“Related reports indicate a possible sequence of failures.”

Display a horizontal or vertical node-based timeline:

01 Sep
Maintenance Delay
↓
03 Sep
Equipment Condition Unknown
↓
05 Sep
Unsafe Workaround
↓
07 Sep
Near Miss
↓
Current
Electrical Hazard

Each node should contain:

* Date
* Short event description
* Report ID
* Location
* Equipment

Use connecting arrows to visually show the sequence.

Add a side panel:

“Why these reports were connected”

✓ Same operational area
✓ Same equipment/system
✓ Logical time sequence
✓ Related safety conditions
✓ Similar hazard context

Important wording:
Use “Potential Causal Chain” or “Possible Failure Pathway”.

Do NOT claim that the AI has proven causality.

Add:
“This is an AI-generated potential relationship for safety investigation.”

Add a CTA:
“View Connected Reports”

---

## SCREEN 8 — SAFETY OFFICER DASHBOARD

Create the main desktop dashboard.

Left sidebar navigation:

Overview
Reports
SIF Precursors
Causal Chains
Threat Heatmap
Analytics
Settings

Top header:
“Safety Intelligence Dashboard”

Facility selector:
“OIL Facility — Assam”

Date range:
“Last 30 Days”

Main KPI cards:

Total Reports
1,284

SIF Precursors
47

High-Risk Reports
12

Active Potential Chains
6

Do not use unrealistic fake accuracy numbers.

---

## DASHBOARD — THREAT HEATMAP

Create a major dashboard section titled:

“Live Threat Heatmap”

Show a simplified 2D plant layout/grid rather than a generic geographic map.

Example:

┌────────────┬────────────┬────────────┐
│ Zone A     │ Zone B     │ Zone C     │
│     3      │     14     │     5      │
├────────────┼────────────┼────────────┤
│ Zone D     │ Zone E     │ Zone F     │
│     2      │      8     │     1      │
└────────────┴────────────┴────────────┘

Use risk intensity to visually distinguish zones.

Zone B should clearly appear as the highest-risk area.

When a zone is selected, show:

Zone B
SIF Precursors: 14
High-Risk Reports: 5
Potential Chains: 2

Top detected patterns:

* Electrical hazards
* Maintenance issues
* Equipment-related failures

Make the heatmap feel like a real operational monitoring tool.

---

## DASHBOARD — HIGH RISK REPORTS

Create a table/list:

Recent High-Risk Reports

Columns:
Report
Time
Zone
Hazard
Risk
Status

Example:

R-1092
10:42 AM
Zone B
Electrical
HIGH
Investigate

R-1087
09:31 AM
Zone B
Maintenance
HIGH
Open

R-1079
08:52 AM
Zone D
Equipment
MEDIUM
Monitoring

Use clear risk badges.

---

## DASHBOARD — CAUSAL CHAINS

Create a card titled:

“Potential Failure Pathways”

Example:

⚠ Compressor Maintenance Pathway

Maintenance delay
↓
Equipment condition issue
↓
Unsafe workaround
↓
Near miss

Zone B
4 connected reports
Risk: HIGH

CTA:
“Investigate Chain”

---

## SCREEN 9 — REPORT DETAIL

Create a detailed report page.

Sections:

Report information

* Report ID
* Date/time
* Location
* Equipment
* Reporter type

Original report

AI-extracted information

Detected hazards

SIF precursor indicators

Risk explanation

Related historical reports

Potential causal chain

Investigation status

Buttons:

“Mark for Investigation”
“Assign to Safety Team”
“View Related Reports”

---

## SCREEN 10 — CAUSAL CHAIN DETAIL

Create a dedicated investigation page.

Top:

“Potential Causal-Failure Chain”

Risk:
HIGH

Location:
Compressor Area — Zone B

Timeline:

Maintenance delay
↓
Equipment condition uncertainty
↓
Unsafe workaround
↓
Near miss

Below the timeline, show the individual reports that created the chain.

Each report can be expanded.

Right-side panel:

Common factors:

* Compressor system
* Zone B
* Maintenance activity

Potential contributing factors:

* Maintenance delay
* Equipment condition uncertainty
* Unsafe workaround

Suggested investigation focus:
“Review maintenance readiness and safety controls around Compressor C-204.”

Important:
Frame this as a safety investigation aid, not an automated final conclusion.

---

## SCREEN 11 — SEARCH / REPORT EXPLORER

Create a report search page.

Search bar:
“Search safety reports…”

Filters:
Plant
Zone
Equipment
Hazard
Date
Risk level
SIF precursor
Near miss

Results should show report cards/table.

Include:
“Related reports” indicator.

---

## SCREEN 12 — ANALYTICS

Create an analytics page showing:

SIF precursor trend over time

Example chart:
Week 1 → 5
Week 2 → 7
Week 3 → 11
Week 4 → 15

Also show:

Top hazard categories
Top high-risk zones
Repeated equipment issues
Potential failure chains by zone

Keep charts clean and easy to understand.

---

## IMPORTANT PRODUCT BEHAVIOUR

The UI should clearly communicate this complete workflow:

1. Worker submits a report.
2. System asks relevant follow-up questions if information is missing.
3. NLP extracts structured safety information.
4. Safety engine checks for SIF precursor indicators.
5. Historical reports are searched for related events.
6. Related reports are evaluated using location, equipment, semantic similarity, time sequence, and safety relationships.
7. The system identifies a POTENTIAL causal-failure chain.
8. Risk information is aggregated by plant zone.
9. Safety officer sees the result through the dashboard and threat heatmap.
10. Officer can investigate the connected reports.

Do not make the product look like it is simply classifying text.

The core innovation must visually communicate:

“Individual reports can hide a larger failure pathway. The system connects them to make the developing risk visible.”

---

## FIGMA REQUIREMENTS

Create all screens as a connected prototype.

Use reusable components for:

* Navigation
* Buttons
* Cards
* Status badges
* Risk badges
* Report cards
* Timeline nodes
* Chat messages
* Heatmap zones
* Tables
* Charts
* Modal/dialogs

Create desktop dashboard screens at approximately 1440×900.

Create worker screens as mobile-first designs around 390×844.

Create realistic sample data throughout the prototype.

Use consistent naming for components and screens.

Create prototype interactions:

* Worker submits report → analysis
* Analysis → risk result
* Risk result → related reports
* Related reports → causal chain
* Dashboard → zone details
* Dashboard → report details
* Dashboard → causal chain investigation
* Heatmap zone click → zone details

Prioritize clarity and realistic workflow over visual decoration.

The final Figma prototype should feel like a serious industrial safety intelligence platform that demonstrates the complete technical concept:
Worker Reporting → AI/NLP → SIF Detection → Historical Connection → Causal-Failure Chain → Risk Visualization → Safety Investigation.