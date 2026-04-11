# MoodSense AI - Version 1

## What this version does
MoodSense AI V1 provides a foundational backend service with:

- A FastAPI application with basic health and dataset endpoints.
- Dataset loading from `data/data.csv` using `pandas`.
- MongoDB Atlas connectivity via `.env` using `MONGO_URI`.
- Automatic creation of a `users` collection at startup (empty for now).

## Tech stack
- **Python**
- **FastAPI** (REST API)
- **pandas** (dataset loading and sampling)
- **MongoDB Atlas** with **pymongo**
- **python-dotenv** for environment variable loading

## Project structure

```text
backend/
  app/
    __init__.py
    main.py
    db.py
    routes/
      __init__.py
      core.py
data/
  data.csv
requirements.txt
.env
```

## How to run

### 1) Create and activate a virtual environment

```bash
python -m venv .venv
source .venv/bin/activate      # macOS/Linux
# .venv\Scripts\activate      # Windows PowerShell
```

### 2) Install requirements

```bash
pip install -r requirements.txt
```

### 3) Configure environment variables

Open `.env` and set your MongoDB Atlas URI:

```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/moodsense?retryWrites=true&w=majority
```

### 4) Run FastAPI

```bash
uvicorn backend.app.main:app --reload
```

The API will start at: `http://127.0.0.1:8000`

## How to test APIs

### Swagger UI
Open:

- `http://127.0.0.1:8000/docs`

### Endpoints

1. **Health check**

```bash
curl http://127.0.0.1:8000/health
```

Expected response:

```json
{"status":"OK"}
```

2. **Dataset sample (first 10 rows)**

```bash
curl http://127.0.0.1:8000/sample
```

Expected response: JSON array with up to 10 objects from `data/data.csv`.
