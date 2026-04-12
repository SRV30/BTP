from math import asin, cos, radians, sin, sqrt
from typing import Literal

from fastapi import APIRouter, Query

router = APIRouter(tags=["Location Search"])

PROVIDER_TYPES = {"psychiatrist", "psychologist"}

MOCK_PROVIDERS = [
    {
        "name": "Harmony Mind Clinic",
        "type": "psychiatrist",
        "latitude": 37.7749,
        "longitude": -122.4194,
        "address": "San Francisco, CA",
    },
    {
        "name": "Golden Gate Psychology Center",
        "type": "psychologist",
        "latitude": 37.8044,
        "longitude": -122.2712,
        "address": "Oakland, CA",
    },
    {
        "name": "Bayview Behavioral Health",
        "type": "psychiatrist",
        "latitude": 37.6879,
        "longitude": -122.4702,
        "address": "Daly City, CA",
    },
    {
        "name": "Downtown Wellness Therapy",
        "type": "psychologist",
        "latitude": 37.3382,
        "longitude": -121.8863,
        "address": "San Jose, CA",
    },
    {
        "name": "Peninsula Mental Care",
        "type": "psychiatrist",
        "latitude": 37.4419,
        "longitude": -122.143,
        "address": "Palo Alto, CA",
    },
]


def _haversine_distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    earth_radius_km = 6371.0

    d_lat = radians(lat2 - lat1)
    d_lon = radians(lon2 - lon1)

    a = sin(d_lat / 2) ** 2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(d_lon / 2) ** 2
    c = 2 * asin(sqrt(a))
    return earth_radius_km * c


@router.get("/location-search")
async def location_search(
    latitude: float = Query(..., ge=-90, le=90, description="User latitude"),
    longitude: float = Query(..., ge=-180, le=180, description="User longitude"),
    radius_km: int = Query(50, ge=50, le=100, description="Search radius in kilometers (50-100)"),
    provider_type: Literal["all", "psychiatrist", "psychologist"] = Query(
        "all",
        description="Filter by provider type",
    ),
) -> dict:
    matches: list[dict] = []

    for provider in MOCK_PROVIDERS:
        if provider_type != "all" and provider["type"] != provider_type:
            continue
        if provider["type"] not in PROVIDER_TYPES:
            continue

        distance = _haversine_distance_km(
            latitude,
            longitude,
            provider["latitude"],
            provider["longitude"],
        )

        if distance <= radius_km:
            matches.append(
                {
                    "name": provider["name"],
                    "type": provider["type"],
                    "address": provider["address"],
                    "distance_km": round(distance, 2),
                }
            )

    matches.sort(key=lambda row: row["distance_km"])

    return {
        "search_center": {"latitude": latitude, "longitude": longitude},
        "radius_km": radius_km,
        "provider_type": provider_type,
        "results": matches,
    }
