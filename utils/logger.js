const fs = require("fs");

function logTrigger(data) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    ...data
  };

  let logs = [];
  if (fs.existsSync("trigger_log.json")) {
    try {
      const raw = fs.readFileSync("trigger_log.json", "utf8").trim();
      if (raw) logs = JSON.parse(raw);
    } catch (_) {
      logs = [];
    }
  }

  logs.push(logEntry);
  fs.writeFileSync("trigger_log.json", JSON.stringify(logs, null, 2));
}

module.exports = { logTrigger };