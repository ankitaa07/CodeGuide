import json
import numpy as np
import pandas as pd
import requests

from config import DEMO_MODE, ZONE_COORDS, OPENWEATHER_API_KEY

ZONE_HISTORY_FILE = "zone_history.json"
SPILLOVER_FILE = "spillover.json"


def load_zone_history():
    try:
        with open(ZONE_HISTORY_FILE, "r") as f:
            return json.load(f)
    except:
        return {
            "Koramangala": 0.4,
            "Indiranagar": 0.2,
            "default": 0.3
        }


def load_spillover():
    try:
        with open(SPILLOVER_FILE, "r") as f:
            return json.load(f)
    except:
        return {}


def save_spillover(data):
    with open(SPILLOVER_FILE, "w") as f:
        json.dump(data, f, indent=2)


def fetch_weather(zone_id):

    if DEMO_MODE:
        demo_weather = {
            "Koramangala": 0.45,
            "Indiranagar": 0.25,
            "default": 0.30
        }
        return demo_weather.get(zone_id, 0.3)

    coords = ZONE_COORDS.get(zone_id, ZONE_COORDS["default"])

    url = (
        f"https://api.openweathermap.org/data/2.5/forecast?"
        f"lat={coords['lat']}&lon={coords['lon']}&appid={OPENWEATHER_API_KEY}"
    )

    response = requests.get(url).json()

    probs = [
        item.get("pop", 0)
        for item in response.get("list", [])[:8]
    ]

    return float(np.mean(probs))


def calculate_pricing(zone_id, rider_income_weekly, week_start):

    zone_history = load_zone_history()
    spillover = load_spillover()

    # Zone Volatility
    V_zone = zone_history.get(zone_id, 0.3)

    # Weather Probability
    p_weather = fetch_weather(zone_id)

    # Boosted Risk
    p_boosted = min(p_weather * (1 + V_zone), 1.0)

    # Yesterday Spillover
    p_yesterday = spillover.get(zone_id, 0.2)

    # Spillover Calculation
    p_spillover = p_yesterday * (0.66 * V_zone)

    # Effective Probability
    p_effective = max(p_boosted, p_spillover)

    # Expected Loss
    ExpectedLoss = p_effective * rider_income_weekly * 0.6

    # Premium
    Premium = ExpectedLoss * 1.2 + 30

    # Safe Zone Discount
    if p_effective < 0.3:
        Premium -= 2

    # Save Spillover
    spillover[zone_id] = p_effective
    save_spillover(spillover)

    return {
        "premium": round(Premium, 2),
        "risk_score": round(p_effective, 3),
        "breakdown": {
            "p_weather": p_weather,
            "V_zone": V_zone,
            "p_boosted": p_boosted,
            "p_spillover": p_spillover,
            "p_effective": p_effective,
            "expected_loss": ExpectedLoss
        }
    }


def get_zone_risk(zone_id):

    zone_history = load_zone_history()
    spillover = load_spillover()

    V_zone = zone_history.get(zone_id, 0.3)

    p_effective = spillover.get(zone_id, 0.2)

    p_spillover = p_effective * (0.66 * V_zone)

    return {
        "zone": zone_id,
        "V_zone": V_zone,
        "p_effective": p_effective,
        "spillover": p_spillover
    }