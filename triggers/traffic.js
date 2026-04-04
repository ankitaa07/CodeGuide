const axios = require("axios");
const cron = require("node-cron");
const { ZONES, TOMTOM_API, DEMO_MODE } = require("../config");
const { increment, reset } = require("../utils/stateManager");
const { emitTrigger } = require("../utils/emitter");
const { logTrigger } = require("../utils/logger");

function startTrafficTrigger() {
  if (DEMO_MODE) {
    setTimeout(() => {
      emitTrigger({ trigger_type: "traffic", zone_id: "demo" });
    }, 10000);
    return;
  }

  cron.schedule("*/5 * * * *", async () => {
    for (const zone of ZONES) {
      const key = `traffic_${zone.id}`;

      try {
        const res = await axios.get(
          `https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json?point=${zone.lat},${zone.lon}&key=${TOMTOM_API}`
        );

        const speed = res.data.flowSegmentData.currentSpeed;

        logTrigger({ type: "traffic_check", zone: zone.id, speed });

        if (speed < 8) {
          const count = increment(key);
          if (count >= 3) {
            await emitTrigger({
              trigger_type: "traffic",
              zone_id: zone.id,
              severity: "medium"
            });
            reset(key);
          }
        } else {
          reset(key);
        }
      } catch (err) {
        console.error("Traffic error:", err.message);
      }
    }
  });
}

module.exports = { startTrafficTrigger };