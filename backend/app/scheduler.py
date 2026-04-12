from __future__ import annotations

import logging
from datetime import datetime, timezone

from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger

from .db import get_mongo_connection
from .mood_engine import calculate_emotions, determine_mood
from .models.daily_log import build_daily_log_document

logger = logging.getLogger(__name__)

scheduler = BackgroundScheduler(
    timezone="UTC",
    job_defaults={
        "coalesce": True,
        "max_instances": 1,
        "misfire_grace_time": 1800,
    },
)


def update_today_data_and_recalculate_mood() -> None:
    """Update today's log for each user and recalculate mood from latest available metrics."""
    mongo = get_mongo_connection()
    users_cursor = mongo.get_users_collection().find({}, {"_id": 1})
    today = datetime.now(timezone.utc).date()

    updates = 0
    skipped = 0

    for user in users_cursor:
        user_id = str(user.get("_id"))
        latest_log = mongo.get_daily_logs_collection().find_one(
            {"user_id": user_id},
            {"_id": 0, "screen_time": 1, "steps": 1, "sleep": 1, "streak": 1},
            sort=[("date", -1)],
        )

        if not latest_log:
            skipped += 1
            continue

        screen_time = float(latest_log.get("screen_time", 0.0))
        steps = int(latest_log.get("steps", 0))
        sleep = float(latest_log.get("sleep", 0.0))
        streak = int(latest_log.get("streak", 0))

        emotions = calculate_emotions(
            screen_time=screen_time,
            steps=steps,
            sleep=sleep,
            streak=streak,
        )
        mood = determine_mood(emotions)

        doc = build_daily_log_document(
            user_id=user_id,
            log_date=today,
            screen_time=screen_time,
            steps=steps,
            sleep=sleep,
            streak=streak,
            emotions=emotions,
            mood=mood,
        )

        mongo.get_daily_logs_collection().update_one(
            {"user_id": user_id, "date": today.isoformat()},
            {"$set": doc},
            upsert=True,
        )
        updates += 1

    logger.info(
        "Scheduler run completed at %s UTC: updated=%s skipped_no_data=%s",
        datetime.now(timezone.utc).isoformat(),
        updates,
        skipped,
    )


def start_scheduler() -> None:
    if scheduler.running:
        return

    run_times = [
        {"hour": 0, "minute": 5},
        {"hour": 6, "minute": 15},
        {"hour": 12, "minute": 30},
        {"hour": 18, "minute": 45},
    ]

    for run_time in run_times:
        scheduler.add_job(
            update_today_data_and_recalculate_mood,
            trigger=CronTrigger(hour=run_time["hour"], minute=run_time["minute"], timezone="UTC"),
            id=f"mood_refresh_{run_time['hour']:02d}_{run_time['minute']:02d}",
            replace_existing=True,
        )

    scheduler.start()
    logger.info("APScheduler started with 4 daily mood refresh jobs.")


def stop_scheduler() -> None:
    if scheduler.running:
        scheduler.shutdown(wait=False)
        logger.info("APScheduler stopped.")
