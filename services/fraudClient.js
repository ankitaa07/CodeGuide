const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const FRAUD_URL = process.env.FRAUD_BASE_URL || "http://127.0.0.1:5002";

async function getFraudScore(trigger_type, affected_hours, is_spoof_demo = false) {
    try {
        // We simulate a realistic GPS trace here for the hackathon demo.
        // If is_spoof_demo is true, we simulate a teleport/jump to force a block.
        const gps_trace = [];
        let base_lat = 12.9352;
        let base_lon = 77.6245;
        let current_ts = Math.floor(Date.now() / 1000) - 3600;

        for(let i=0; i<10; i++) {
            gps_trace.push({ lat: base_lat, lon: base_lon, ts: current_ts, speed_kmh: 10 });
            if (is_spoof_demo && i === 5) {
                // Massive unrealistic 10km jump in 1 minute
                base_lat += 0.1;
            } else {
                // Normal slight movement
                base_lat += 0.0001; 
            }
            current_ts += 60; // 1 min apart
        }

        const payload = {
            gps_trace,
            imu_speed_kmh: 10,
            trip_count_during_event: trigger_type === "rain" ? 1 : 2,
            zone_active_riders: 15,
            trigger_type
        };

        const res = await fetch(`${FRAUD_URL}/api/fraud_check`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!res.ok) throw new Error("Fraud Service Error: " + res.statusText);
        
        return await res.json();
    } catch (err) {
        console.error("Fraud Engine unreachable, failing open slightly:", err.message);
        // Fallback for demo stability
        return { fraud_score: 0.1, decision: "green", action: "auto_approve" };
    }
}

module.exports = { getFraudScore };
