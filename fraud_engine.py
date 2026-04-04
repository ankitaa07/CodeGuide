from flask import Flask, request, jsonify
import math
import numpy as np
from sklearn.ensemble import IsolationForest

app = Flask(__name__)

# --------------------------------------------------
# Utility Functions
# --------------------------------------------------

def haversine(lat1, lon1, lat2, lon2):
    """Calculate distance in km between two GPS points"""
    R = 6371

    lat1 = math.radians(lat1)
    lon1 = math.radians(lon1)
    lat2 = math.radians(lat2)
    lon2 = math.radians(lon2)

    dlat = lat2 - lat1
    dlon = lon2 - lon1

    a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon/2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))

    return R * c


def gps_variance(trace):
    """Compute GPS variance for fraud batch"""
    lats = [p["lat"] for p in trace]
    lons = [p["lon"] for p in trace]

    if len(lats) < 2:
        return 0

    return float(np.var(lats) + np.var(lons))


# --------------------------------------------------
# Fraud Check Endpoint
# --------------------------------------------------

@app.route("/api/fraud_check", methods=["POST"])
def fraud_check():

    data = request.json

    gps_trace = data.get("gps_trace", [])
    imu_speed = data.get("imu_speed_kmh", 0)
    trip_count = data.get("trip_count_during_event", 0)
    zone_active_riders = data.get("zone_active_riders", 0)
    trigger_type = data.get("trigger_type", "normal")

    score = 0

    gps_jump_flag = False
    imu_mismatch_flag = False
    behavioral_flag = False
    cross_rider_flag = False

    # --------------------------------------------------
    # 1. GPS Jump Check
    # --------------------------------------------------

    for i in range(len(gps_trace) - 1):

        p1 = gps_trace[i]
        p2 = gps_trace[i+1]

        distance = haversine(
            p1["lat"], p1["lon"],
            p2["lat"], p2["lon"]
        )

        time_diff = abs(p2["ts"] - p1["ts"]) / 60

        if distance > 5 and time_diff <= 1:
            score += 0.4
            gps_jump_flag = True
            break


    # --------------------------------------------------
    # 2. IMU vs GPS Mismatch
    # --------------------------------------------------

    gps_speeds = [p.get("speed_kmh", 0) for p in gps_trace]

    if len(gps_speeds) > 0:
        avg_gps_speed = float(np.mean(gps_speeds))

        if abs(avg_gps_speed - imu_speed) > 15:
            score += 0.3
            imu_mismatch_flag = True


    # --------------------------------------------------
    # 3. Behavioral Check
    # --------------------------------------------------

    expected_trips = 3

    if trigger_type == "rain":
        if trip_count > expected_trips * 0.8:
            score += 0.3
            behavioral_flag = True


    # --------------------------------------------------
    # 4. Cross Rider Check
    # --------------------------------------------------

    if zone_active_riders > 10 and trip_count <= 1:
        score += 0.4
        cross_rider_flag = True


    # --------------------------------------------------
    # Final Score
    # --------------------------------------------------

    fraud_score = min(score, 1.0)


    # --------------------------------------------------
    # Decision Logic
    # --------------------------------------------------

    if fraud_score < 0.4:
        decision = "green"
        action = "auto_approve"

    elif 0.4 <= fraud_score < 0.7:
        decision = "amber"
        action = "delay_30min_reverify"

    else:
        decision = "red"
        action = "block_manual_review"


    return jsonify({
        "fraud_score": float(round(fraud_score, 2)),
        "decision": decision,
        "action": action,
        "components": {
            "gps_jump": bool(gps_jump_flag),
            "imu_mismatch": bool(imu_mismatch_flag),
            "behavioral": bool(behavioral_flag),
            "cross_rider": bool(cross_rider_flag)
        }
    })


# --------------------------------------------------
# Fraud Batch Endpoint
# --------------------------------------------------

@app.route("/api/fraud_batch", methods=["POST"])
def fraud_batch():

    data = request.json
    riders = data.get("riders", [])

    features = []
    rider_ids = []

    for r in riders:

        trip_count = r.get("trip_count", 0)
        trace = r.get("gps_trace", [])

        variance = gps_variance(trace)

        features.append([trip_count, variance])
        rider_ids.append(r.get("rider_id"))

    if len(features) < 2:
        return jsonify({"flagged_riders": []})


    clf = IsolationForest(
        contamination=0.25,
        random_state=42
    )

    preds = clf.fit_predict(features)

    flagged = []

    for i, p in enumerate(preds):
        if int(p) == -1:
            flagged.append(rider_ids[i])

    return jsonify({
        "flagged_riders": flagged
    })


# --------------------------------------------------
# Run Server
# --------------------------------------------------

if __name__ == "__main__":
    app.run(port=5002, debug=True)