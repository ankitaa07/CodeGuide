const axios = require("axios");
const cron = require("node-cron");
const { ZONES, WAQI_API, DEMO_MODE } = require("../config");
const { increment, reset } = require("../utils/stateManager");
const { emitTrigger } = require("../utils/emitter");
const { logTrigger } = require("../utils/logger");

function startAQITrigger() {
  if (DEMO_MODE) {
    setTimeout(() => emitTrigger({ trigger_type: "aqi", zone_id: "demo" }), 10000);
    return;
  }

  cron.schedule("*/15 * * * *", async () => {
    for (const zone of ZONES) {
      const key = `aqi_${zone.id}`;

      try {
        const res = await axios.get(
          `https://api.waqi.info/feed/geo:${zone.lat};${zone.lon}/?token=${WAQI_API}`
        );

        const aqi = res.data.data.aqi;

        logTrigger({ type: "aqi_check", zone: zone.id, aqi });

        if (aqi > 450) {
          const count = increment(key);
          if (count >= 3) {
            await emitTrigger({ trigger_type: "aqi", zone_id: zone.id });
            reset(key);
          }
        } else {
          reset(key);
        }
      } catch (err) {
        console.error("AQI error:", err.message);
      }
    }
  });
}

module.exports = { startAQITrigger };