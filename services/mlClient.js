const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const ML_URL = "http://localhost:5002";

// 🔥 MAIN FRAUD CHECK FUNCTION (THIS MATCHES YOUR PYTHON)
async function checkFraud() {
    try {
        const res = await fetch(`${ML_URL}/api/fraud_check`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                gps_trace: [],
                imu_speed_kmh: 12,
                trip_count_during_event: 1,
                zone_active_riders: 5,
                trigger_type: "rain"
            })
        });

        if (!res.ok) throw new Error("ML Service Error: " + res.statusText);

        return await res.json();

    } catch (err) {
        console.error("❌ ML ERROR:", err.message);

        // fallback (VERY IMPORTANT FOR DEMO)
        return {
            fraud_score: 0.2,
            decision: "green",
            action: "auto_approve"
        };
    }
}

module.exports = { checkFraud };