# MoodSense AI - Version 10A

## What Version 10A adds
Version 10A upgrades Version 9 by introducing **My Profile** management APIs.

### New profile APIs
- `GET /profile`
- `PUT /profile`

## Profile structure
The profile payload is stored in the user document and uses these fields:
- `name` (string, optional)
- `email` (email, required)
- `profile_photo` (string, optional)
- `phone_number` (string, optional)
- `address` (string, optional)

Example response from `GET /profile`:

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "profile_photo": "https://example.com/avatar.jpg",
  "phone_number": "+1-555-123-4567",
  "address": "123 Main St, San Francisco, CA"
}
```

## Profile update flow
1. User authenticates and includes a Bearer token.
2. User calls `PUT /profile` with one or more updatable fields.
3. Server validates payload and rejects empty updates.
4. Server updates only supplied fields in the user record.
5. Server returns the refreshed profile.
6. Updated values are visible in subsequent `GET /profile` calls.

Example update request:

```bash
curl -X PUT http://127.0.0.1:8000/profile \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "phone_number": "+1-555-123-4567",
    "address": "123 Main St, San Francisco, CA"
  }'
```

## Existing Version 9 features
- Secure password recovery APIs:
  - `POST /auth/forgot-password`
  - `POST /auth/reset-password`
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
