# RiskRadar Backend

FastAPI backend prepared to match the uploaded RiskRadar frontend.

## What is included
- JWT login for Worker and Safety Officer roles
- Worker safety-report creation
- Rule-based NLP risk/SIF analysis endpoint
- Reports API
- Prediction API with the three prediction cards represented in the frontend
- Sensor time-series API
- Dashboard summary, heatmap and analytics APIs
- SQLite database by default, with `DATABASE_URL` configurable for PostgreSQL/Supabase
- CORS configured for Vite (`5173` and `8443`)
- Automatic demo-data seeding on first startup
- Swagger documentation at `/docs`

## Demo accounts
- Worker: `worker` / `worker123`
- Officer: `officer` / `officer123`

Change these before any real deployment.

## Windows setup
1. Extract this ZIP.
2. Open Command Prompt in the extracted `riskradar-backend` folder.
3. Run:
   `run.bat`
4. Open:
   `http://localhost:8000/docs`

## Frontend connection
Set the frontend API base URL to:
`http://localhost:8000`

Login:
`POST /auth/login`

Then send the returned token on protected requests:
`Authorization: Bearer <token>`

## Main endpoints
- `POST /auth/login`
- `GET /auth/me`
- `GET /reports`
- `POST /reports`
- `GET /reports/{id}`
- `POST /analysis/analyze`
- `GET /predictions`
- `GET /predictions/{id}`
- `GET /dashboard/summary`
- `GET /dashboard/heatmap`
- `GET /dashboard/analytics`
- `GET /dashboard/trends`
- `GET /sensors/timeseries`
- `GET /health`

## Database / Supabase
For a Supabase PostgreSQL database, create `.env` and set `DATABASE_URL` to the SQLAlchemy PostgreSQL connection string supplied by Supabase. The backend uses SQLAlchemy, so the API layer remains the same.

For a hackathon demo, SQLite is simpler and requires no external database service.
