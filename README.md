# MoodSense AI - Version 11

## What Version 11 adds
Version 11 upgrades Version 10B by adding a user connection system with controlled mood sharing.

## Connection system
New APIs under `/connections`:

1. **Search by email**
   - `GET /connections/search?email=user@example.com`
   - Returns whether the user exists and relationship state (`is_connected`, request pending, etc.).

2. **Send request**
   - `POST /connections/request`
   - Body:
     ```json
     { "email": "friend@example.com" }
     ```
   - Creates a pending connection request.

3. **Accept/reject request**
   - `POST /connections/request/respond`
   - Body:
     ```json
     { "email": "friend@example.com", "action": "accept" }
     ```
   - `action` can be `accept` or `reject`.

4. **View connections + shared mood data**
   - `GET /connections`
   - For each accepted connection, returns:
     - current mood
     - last 7 days mood trend
     - last 30 days mood trend

## Privacy considerations
- Mood history is only visible through **accepted connections**.
- Connection sharing is **opt-in**, requiring explicit request + acceptance.
- Pending requests do not grant mood access.
- Search is by exact email and only returns minimal profile context for discovery.
- Users cannot send connection requests to themselves.

## Existing personalization (from Version 10B)
- Profile-aware mood logic includes:
  - disability-aware steps normalization,
  - female-cycle stress adjustment,
  - personal baseline comparison against user history.
- Profile fields available in `GET /profile` and `PUT /profile`:
  - `name`, `email`, `profile_photo`, `phone_number`, `address`
  - `age`, `gender`, `disability`, `menstruation_cycle`, `cycle_days`

## Run locally
```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn backend.app.main:app --reload
```

Docs: `http://127.0.0.1:8000/docs`
