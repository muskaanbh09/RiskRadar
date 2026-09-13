Add a complete authentication/login flow to the existing industrial safety intelligence web application.

IMPORTANT:

* Do NOT redesign or remove any existing screens.
* Keep the existing visual design system, colors, typography, spacing, components, worker interface, safety officer dashboard, SIF detection, causal-failure-chain screens, and heatmap.
* The login page should feel like a natural part of the existing application.
* This is a frontend prototype for an SIH demo, so demo login buttons should work through frontend navigation without requiring a real backend authentication system.

## 1. LOGIN PAGE

Create a professional industrial safety login page.

Layout:

* Split-screen desktop layout.
* Left side: application branding and short explanation.
* Right side: login card.

Branding:

* Product name: "SIF Sentinel"
* Subtitle: "AI-Powered Safety Intelligence"
* Short description:
  "Detect hidden Serious Injury & Fatality precursors before they become incidents."

Left side should visually communicate:

* AI-powered safety reporting
* SIF precursor detection
* Hidden causal-failure-chain detection
* Real-time safety intelligence

Use subtle industrial/safety visual elements, but keep the interface clean and professional.

## 2. LOGIN CARD

Title:
"Welcome back"

Subtitle:
"Sign in to access your safety intelligence workspace."

Fields:

* Email / Employee ID
* Password

Controls:

* Show/hide password icon
* "Remember me" checkbox
* "Forgot password?" link

Primary button:
"Sign In"

Below the normal login form, add:

"Quick Demo Access"

Two prominent demo buttons:

### Demo Worker

Button text:
"Continue as Worker"

Supporting text:
"Demo access to frontline reporting"

### Demo Safety Officer

Button text:
"Continue as Safety Officer"

Supporting text:
"Demo access to safety intelligence dashboard"

These demo buttons should immediately navigate to their respective interfaces.

## 3. ROLE SELECTION / DEMO FLOW

When the user clicks:

"Continue as Worker"
→ Navigate directly to the existing Worker Reporting Home.

"Continue as Safety Officer"
→ Navigate directly to the existing Safety Officer Intelligence Dashboard.

Do NOT create an unnecessary separate role-selection page if the two demo buttons already clearly provide role selection.

## 4. DEMO LOGIN BEHAVIOR

For the prototype:

Worker Demo:

* Automatically treat the user as a Worker.
* Show the Worker interface.
* Worker should have access to:

  * Report Safety Issue
  * Text reporting
  * Voice reporting
  * Conversational Smart Bot
  * Report analysis
  * SIF precursor result
  * Related historical reports
  * Potential causal-failure chain

Safety Officer Demo:

* Automatically treat the user as a Safety Officer.
* Show the Safety Officer dashboard.
* Safety Officer should have access to:

  * Total reports
  * SIF precursors
  * High-risk reports
  * Active potential causal chains
  * Live Threat Heatmap
  * Recent high-risk reports
  * Causal-failure pathways
  * Report explorer
  * Analytics

## 5. HEADER / USER SESSION

After login, update the existing application header to show the logged-in role.

Worker:

* Avatar
* "Worker"
* Small status indicator
* Dropdown with:

  * Profile
  * My Reports
  * Logout

Safety Officer:

* Avatar
* "Safety Officer"
* Small status indicator
* Dropdown with:

  * Profile
  * Dashboard
  * Logout

Logout should return the user to the Login Page.

## 6. ACCESS CONTROL VISUALIZATION

The prototype should visually communicate role-based access.

Worker should NOT see:

* Safety Officer analytics
* Organization-wide heatmap
* Safety intelligence administration controls

Safety Officer should see:

* Organization/plant-level safety intelligence
* Heatmap
* Causal-chain investigations
* Analytics
* Reports from multiple workers/zones

Do not make this overly complicated; this is primarily a frontend prototype.

## 7. LOGIN ERROR STATE

Create a login error state for the normal email/password form.

Example:
"Invalid Employee ID or password."

Use a subtle warning/error treatment consistent with the existing design system.

Do not show this error when using the Demo buttons.

## 8. RESPONSIVE DESIGN

Desktop:

* 1440 × 900

Mobile:

* 390 × 844

On mobile:

* Stack the branding section above the login card.
* Keep both demo buttons clearly accessible.
* Maintain readable spacing and touch-friendly controls.

## 9. FIGMA PROTOTYPE CONNECTIONS

Create working prototype interactions:

Login Page
↓
Sign In
↓
Role-based destination

Login Page
↓
Continue as Worker
↓
Worker Reporting Home

Login Page
↓
Continue as Safety Officer
↓
Safety Officer Dashboard

Worker
↓
Logout
↓
Login Page

Safety Officer
↓
Logout
↓
Login Page

Add appropriate hover, focus, pressed, and loading states.

## 10. VISUAL STYLE

Maintain the existing application's visual language.

Design should communicate:

* Industrial
* Safety-critical
* Enterprise SaaS
* Trustworthy
* Modern
* Technical
* Professional

Avoid:

* Generic startup landing-page aesthetics
* Excessive gradients
* Cartoon illustrations
* Overly bright colors
* Gaming-style UI
* Unnecessary decorative elements

Use the existing application's safety color semantics:

* Green = safe/normal
* Amber = warning
* Red = high risk/critical
* Neutral colors = normal information

## 11. IMPORTANT SIH DEMO REQUIREMENT

The login page should make the application's two personas immediately understandable to an evaluator.

Within a few seconds, an evaluator should understand:

"Worker → reports safety issues"

"Safety Officer → monitors and investigates safety intelligence"

The demo buttons should make it extremely easy for judges to experience both workflows without entering credentials.

The login page is an entry point to the existing product, NOT a separate redesign.

Create all required components, states, and prototype connections while preserving the existing application screens and design system.