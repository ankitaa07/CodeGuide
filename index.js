require("dotenv").config();
const { startRainTrigger } = require("./triggers/rain");
const { startTrafficTrigger } = require("./triggers/traffic");
const { startAQITrigger } = require("./triggers/aqi");
const { startConnectivityTrigger } = require("./triggers/connectivity");
const { startCivicTrigger } = require("./triggers/civic");

console.log("🚀 RiderShield Trigger Service Running...");
if (process.env.DEMO_MODE === "true") {
  console.log("⚡ DEMO MODE ACTIVE - Triggering test payout...");

  setTimeout(async () => {
    const fetch = (await import("node-fetch")).default;

    try {
      const res = await fetch("http://localhost:3000/payout/trigger", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rider_id: 1,
          trigger_type: "demo_rain",
          affected_hours: 1,
          fraud_score: 0.2,
        }),
      });

      console.log("✅ Demo trigger sent");
    } catch (err) {
      console.error("❌ Demo trigger failed", err.message);
    }
  }, 5000);
}

startRainTrigger();
startTrafficTrigger();
startAQITrigger();
startConnectivityTrigger();
startCivicTrigger();