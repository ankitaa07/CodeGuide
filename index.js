require("dotenv").config();

const express = require("express");
const path = require("path");
const cors = require("cors");
const { spawn } = require("child_process");

// ===== TRIGGERS =====
const { startRainTrigger } = require("./triggers/rain");
const { startTrafficTrigger } = require("./triggers/traffic");
const { startAQITrigger } = require("./triggers/aqi");
const { startConnectivityTrigger } = require("./triggers/connectivity");
const { startCivicTrigger } = require("./triggers/civic");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

console.log("🚀 RiderShield System Starting...");

// ================= FRAUD ENGINE =================
function runFraudCheck(data) {
  return new Promise((resolve, reject) => {
    const py = spawn("python", ["fraud_engine.py", JSON.stringify(data)]);

    let result = "";

    py.stdout.on("data", (data) => {
      result += data.toString();
    });

    py.stderr.on("data", (err) => {
      console.error(err.toString());
    });

    py.on("close", () => {
      try {
        resolve(JSON.parse(result));
      } catch {
        resolve({ result });
      }
    });
  });
}

// ================= ROUTES =================

app.get("/api/health", (req, res) => {
  res.json({ status: "OK" });
});

app.post("/api/fraud-check", async (req, res) => {
  try {
    const result = await runFraudCheck(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= FRONTEND =================

app.use(express.static(path.join(__dirname, "public")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ================= START SERVER =================

app.listen(PORT, () => {
  console.log(`🌐 Server running on port ${PORT}`);
});

// ================= START TRIGGERS =================

console.log("⚡ Starting Trigger Services...");

startRainTrigger();
startTrafficTrigger();
startAQITrigger();
startConnectivityTrigger();
startCivicTrigger();

// ================= DEMO MODE =================

if (process.env.DEMO_MODE === "true") {
  console.log("⚡ DEMO MODE ACTIVE");

  setTimeout(async () => {
    const fetch = (await import("node-fetch")).default;

    try {
      await fetch("http://localhost:" + PORT + "/events/trigger", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rider_id: "R-DEMO",
          trigger_type: "demo_rain",
          zone_id: "Z01",
          affected_hours: 1
        }),
      });

      console.log("✅ Demo trigger sent");
    } catch (err) {
      console.error("❌ Demo trigger failed", err.message);
    }
  }, 5000);
}