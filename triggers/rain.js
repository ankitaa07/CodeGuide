const axios = require("axios");
const cron = require("node-cron");
const { ZONES, OPENWEATHER_API, DEMO_MODE } = require("../config");
const { increment, reset } = require("../utils/stateManager");
const { emitTrigger } = require("../utils/emitter");
const { logTrigger } = require("../utils/logger");

function startRainTrigger() {
  if (DEMO_MODE) {
    setTimeout(() => {
      emitTrigger({ trigger_type: "rain", zone_id: "demo", severity: "high" });
    }, 10000);
    return;
  }

  cron.schedule("*/5 * * * *", async () => {
    for (const zone of ZONES) {
      const key = `rain_${zone.id}`;

      try {
        const res = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${zone.lat}&lon=${zone.lon}&appid=${OPENWEATHER_API}`
        );

        const rain = res.data?.rain?.["1h"] || 0;

        logTrigger({ type: "rain_check", zone: zone.id, rain });

        if (rain > 20) {
          const count = increment(key);

          if (count >= 2) {
            await emitTrigger({
              trigger_type: "rain",
              zone_id: zone.id,
              severity: "high",
              affected_hours: 1
            });
            reset(key);
          }
        } else {
          reset(key);
        }
      } catch (err) {
        console.error("Rain error:", err.message);
      }
    }
  });
}

module.exports = { startRainTrigger };