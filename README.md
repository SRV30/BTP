# MoodSense AI - Version 2

## What Version 2 adds
MoodSense AI V2 keeps all Version 1 functionality and adds a complete JWT-based authentication module.

### Existing (still supported)
- `GET /health` returns service health.
- `GET /sample` returns the first 10 rows from `data/data.csv` using pandas.

### New in Version 2
- User signup with hashed password storage.
- User login with JWT generation.
- Protected route to fetch current authenticated user.
- MongoDB `users` collection with a unique index on `email`.

## Tech stack
- **Python**
- **FastAPI**
- **MongoDB Atlas** (`pymongo`)
- **pandas**
- **bcrypt** (password hashing)
- **python-jose** (JWT creation/validation)
- **python-dotenv**

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
    auth/
      __init__.py
      routes.py
      utils.py
      dependencies.py
    models/
      __init__.py
      user.py
    schemas/
      __init__.py
      auth.py
data/
  data.csv
requirements.txt
.env
```

## Environment variables
Set these in `.env`:

```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/moodsense?retryWrites=true&w=majority
JWT_SECRET=your_secret_key
```

## How authentication works (JWT flow)
1. **Signup** (`POST /auth/signup`): stores user with hashed password.
2. **Login** (`POST /auth/login`): validates credentials and returns JWT token.
3. **Protected access** (`GET /auth/me`): requires `Authorization: Bearer <token>`.
4. Token settings:
   - Algorithm: `HS256`
   - Expiry: `24 hours`

## How to run

### 1) Create and activate virtual environment

```bash
python -m venv .venv
source .venv/bin/activate      # macOS/Linux
# .venv\Scripts\activate      # Windows PowerShell
```

### 2) Install dependencies

```bash
pip install -r requirements.txt
```

### 3) Run FastAPI

```bash
uvicorn backend.app.main:app --reload
```

App URL: `http://127.0.0.1:8000`
Docs URL: `http://127.0.0.1:8000/docs`

## API testing

### Core APIs (backward compatibility)

#### Health
```bash
curl http://127.0.0.1:8000/health
```

#### Dataset sample
```bash
curl http://127.0.0.1:8000/sample
```

### Auth APIs

#### Signup
```bash
curl -X POST http://127.0.0.1:8000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"user@gmail.com","password":"password123"}'
```

#### Login
```bash
curl -X POST http://127.0.0.1:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@gmail.com","password":"password123"}'
```

#### Access protected route
```bash
curl http://127.0.0.1:8000/auth/me \
  -H "Authorization: Bearer <YOUR_TOKEN>"
```

## Testing with Swagger UI
1. Open `/docs`.
2. Run `POST /auth/login` and copy `access_token`.
3. Click **Authorize**.
4. Paste: `Bearer <token>`.
5. Call `GET /auth/me`.

## Error handling
- Duplicate email on signup → `400`
- Invalid login credentials → `401`
- Invalid/missing token on protected route → `401`
