const fs = require("fs");

function logTrigger(data) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    ...data
  };

  let logs = [];
  if (fs.existsSync("trigger_log.json")) {
    logs = JSON.parse(fs.readFileSync("trigger_log.json"));
  }

  logs.push(logEntry);
  fs.writeFileSync("trigger_log.json", JSON.stringify(logs, null, 2));
}

module.exports = { logTrigger };