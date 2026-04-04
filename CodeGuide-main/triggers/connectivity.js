const fs = require("fs");
const cron = require("node-cron");
const { increment, reset } = require("../utils/stateManager");
const { emitTrigger } = require("../utils/emitter");
const { logTrigger } = require("../utils/logger");

function startConnectivityTrigger() {
  cron.schedule("*/5 * * * *", () => {
    const key = "connectivity";

    const data = JSON.parse(fs.readFileSync("mock_outage.json"));
    logTrigger({ type: "connectivity_check", outage: data.outage });

    if (data.outage) {
      const count = increment(key);
      if (count >= 6) {
        emitTrigger({ trigger_type: "connectivity" });
        reset(key);
      }
    } else {
      reset(key);
    }
  });
}

module.exports = { startConnectivityTrigger };