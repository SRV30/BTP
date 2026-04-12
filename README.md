# MoodSense AI - Version 9

## What Version 9 adds
Version 9 upgrades Version 8 with secure password recovery APIs.

### New auth APIs
- `POST /auth/forgot-password`
- `POST /auth/reset-password`

## Password reset flow
1. User submits email to `POST /auth/forgot-password`.
2. Server generates a random reset token.
3. Server stores only the **SHA-256 hash** of the token in DB + expiry timestamp.
4. Token is sent via:
   - SMTP email (if SMTP env vars are configured), or
   - mock console output (`[MOCK-EMAIL]`) if SMTP is not configured.
5. User submits token + new password to `POST /auth/reset-password`.
6. Server verifies token hash and expiry.
7. If valid, server hashes new password with bcrypt and updates user password.
8. Reset token fields are deleted immediately after successful reset.

## How token security works
- Token is generated with `secrets.token_urlsafe(32)`.
- Raw token is never stored in DB.
- Stored value: `reset_token_hash`.
- Expiry: `reset_token_expires_at` (default 30 minutes).
- Invalid/expired token returns HTTP 400.
- Passwords are always stored as bcrypt hashes.

## How to test password reset APIs

### 1) Request reset token
```bash
curl -X POST http://127.0.0.1:8000/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"user@gmail.com"}'
```

Response:
```json
{"message":"If that email exists, a reset token has been sent"}
```

> If SMTP is not set, copy token from backend logs (`[MOCK-EMAIL]`).

### 2) Reset password with token
```bash
curl -X POST http://127.0.0.1:8000/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{"token":"<TOKEN_FROM_EMAIL_OR_LOG>","new_password":"NewStrongPass123"}'
```

Response:
```json
{"message":"Password reset successful"}
```

### 3) Verify login with new password
```bash
curl -X POST http://127.0.0.1:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@gmail.com","password":"NewStrongPass123"}'
```

## Existing Version 8 features
- Smart deterministic `GET /predict-next-day` based on today’s top emotions.
- `GET /ai-insights` for personalized recommendations.
- APScheduler daily mood refresh jobs at:
  - 12:05 AM UTC
  - 6:15 AM UTC
  - 12:30 PM UTC
  - 6:45 PM UTC

## Environment variables
```env
MONGO_URI=...
JWT_SECRET=...

# Optional for real email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_username
SMTP_PASS=your_password
SMTP_FROM=no-reply@yourapp.com
```

## Run locally
```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn backend.app.main:app --reload
```

Docs: `http://127.0.0.1:8000/docs`
