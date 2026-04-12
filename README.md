# MoodSense AI - Version 13

MoodSense AI now includes a full React frontend and FastAPI backend integration for end-to-end mental wellness tracking.

## Features in the frontend
- Authentication (signup/login)
- Dashboard with daily log submission
- Prediction view (next-day emotion probabilities)
- AI insights view
- Profile management
- Connections management
- Depression analysis
- Nearby doctor search (psychiatrists + psychologists)

## Full setup

### 1) Backend
```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn backend.app.main:app --reload
```

Backend runs at: `http://127.0.0.1:8000`

### 2) Frontend
```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: `http://127.0.0.1:5173`

### 3) Optional frontend env
Create `frontend/.env`:
```bash
VITE_API_BASE_URL=http://127.0.0.1:8000
```

If not set, frontend defaults to `http://127.0.0.1:8000`.

## Backend integration
The frontend consumes backend APIs via `frontend/src/api.js` using Axios and a JWT token stored in localStorage (`moodsense_token`).

### Auth APIs
- `POST /auth/signup`
- `POST /auth/login`
- `GET /auth/me`

### Daily mood + insights APIs
- `POST /log-data`
- `GET /today`
- `GET /mood/7days`
- `GET /mood/30days`
- `GET /predict-next-day`
- `GET /ai-insights`
- `GET /depression-analysis`

### Profile APIs
- `GET /profile`
- `PUT /profile`

### Connection APIs
- `GET /connections/search?email=...`
- `POST /connections/request`
- `POST /connections/request/respond`
- `GET /connections`

### Nearby doctors API
- `GET /location-search?latitude=...&longitude=...&radius_km=...&provider_type=...`
- Supports `provider_type`: `all`, `psychiatrist`, `psychologist`
- Radius constrained to 50-100 km

## Routing structure (frontend)
Defined in `frontend/src/App.jsx`:

- `/login` → Login page
- `/signup` → Signup page
- `/` → Dashboard
- `/prediction` → Prediction
- `/insights` → AI Insights
- `/depression` → Depression analysis
- `/doctors` → Nearby doctors
- `/connections` → Connections
- `/profile` → Profile

All routes except `/login` and `/signup` are protected by `ProtectedRoute`.

## UI notes
- Modern dark theme with responsive layout
- Card-based information hierarchy
- Chart components implemented using Recharts for clean visualizations

## Nearby doctors location logic
- Current implementation uses mock provider data
- Haversine formula computes distance from user coordinates
- Returns only providers within selected radius (50-100 km)
- Results sorted nearest to farthest
