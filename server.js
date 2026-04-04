/**
 * RiderShield — Backend API
 * Port 3000
 *
 * Integrates:
 *   - Trigger Engine  (index.js  → POST /payout/trigger)
 *   - ML Service      (ridershield/app.py  port 5001)
 *   - Fraud Engine    (fraud_engine.py     port 5002)
 *   - Audit Logging   (utils/logger.js     → trigger_log.json)
 */

require("dotenv").config();
const express = require("express");
const axios   = require("axios");
const { logTrigger }     = require("./utils/logger");
const { ML_SERVICE_URL, FRAUD_SERVICE_URL } = require("./config");

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// ---------------------------------------------------------------------------
// Helper: call a service and return null on failure (graceful degradation)
// ---------------------------------------------------------------------------
async function safePost(url, body) {
  try {
    const res = await axios.post(url, body, { timeout: 8000 });
    return res.data;
  } catch (err) {
    console.warn(`⚠️  Service call failed [${url}]:`, err.message);
    return null;
  }
}

// ---------------------------------------------------------------------------
// Helper: map numeric fraud score → decision / action
// ---------------------------------------------------------------------------
function fraudDecisionFromScore(score) {
  if (score < 0.4)  return { decision: "green", action: "auto_approve" };
  if (score < 0.7)  return { decision: "amber", action: "delay_30min_reverify" };
  return              { decision: "red",   action: "block_manual_review" };
}

// ---------------------------------------------------------------------------
// POST /payout/trigger
//
// Expected body:
//   {
//     rider_id            : number | string   (required)
//     trigger_type        : string            (required)
//     affected_hours      : number            (default 1)
//     fraud_score         : number 0-1        (optional – pre-computed)
//     zone_id             : string            (default "Koramangala")
//     rider_income_weekly : number INR        (default 3000)
//     income_history      : number[]          (optional – for ML income baseline)
//     gps_trace           : object[]          (optional – for fraud check)
//     imu_speed_kmh       : number            (optional)
//     trip_count_during_event : number        (optional)
//     zone_active_riders  : number            (optional)
//   }
// ---------------------------------------------------------------------------
app.post("/payout/trigger", async (req, res) => {
  const {
    rider_id,
    trigger_type,
    affected_hours          = 1,
    fraud_score: incomingFraudScore,
    zone_id                 = "Koramangala",
    rider_income_weekly     = 3000,
    income_history          = null,
    gps_trace               = [],
    imu_speed_kmh           = 0,
    trip_count_during_event = 0,
    zone_active_riders      = 0,
  } = req.body;

  if (!rider_id || !trigger_type) {
    return res.status(400).json({ success: false, error: "rider_id and trigger_type are required" });
  }

  // ── 1. Fraud check ──────────────────────────────────────────────────────
  let fraud_score;
  let fraud_components = {};

  if (incomingFraudScore !== undefined && incomingFraudScore !== null) {
    // Pre-computed fraud score supplied by trigger engine
    fraud_score = incomingFraudScore;
  } else {
    // Call fraud engine for real-time analysis
    const fraudResult = await safePost(`${FRAUD_SERVICE_URL}/api/fraud_check`, {
      gps_trace,
      imu_speed_kmh,
      trip_count_during_event,
      zone_active_riders,
      trigger_type,
    });

    if (fraudResult) {
      fraud_score      = fraudResult.fraud_score;
      fraud_components = fraudResult.components || {};
    } else {
      // Fallback: treat as low-risk when service is unavailable
      fraud_score = 0.1;
    }
  }

  const { decision: fraud_decision, action: fraud_action } = fraudDecisionFromScore(fraud_score);

  // ── 2. ML Pricing (ridershield/app.py) ──────────────────────────────────
  const current_date = new Date().toISOString().split("T")[0];

  const pricingResult = await safePost(`${ML_SERVICE_URL}/api/pricing`, {
    zone_id,
    rider_income_weekly,
    week_start: current_date,
  });

  const pricing = pricingResult || {
    premium: 30,
    risk_score: 0.3,
    breakdown: {},
  };

  // ── 3. ML Income Baseline (optional enrichment) ──────────────────────────
  let income_baseline_result = null;
  if (income_history && income_history.length >= 3) {
    income_baseline_result = await safePost(`${ML_SERVICE_URL}/api/income_baseline`, {
      rider_id,
      income_history,
    });
  }

  const expected_hourly = income_baseline_result
    ? income_baseline_result.expected_hourly
    : rider_income_weekly / 40; // fallback: assume 40-hour week

  // ── 4. Payout calculation ────────────────────────────────────────────────
  let payout = 0;

  if (fraud_decision === "green") {
    // Full payout minus fraud-score-adjusted deduction
    payout = affected_hours * expected_hourly * (1 - fraud_score * 0.5);
  }
  // amber → payout withheld pending re-verification (0)
  // red   → payout blocked for manual review (0)

  payout = Math.round(payout * 100) / 100;

  // ── 5. Audit log ─────────────────────────────────────────────────────────
  const auditEntry = {
    rider_id,
    trigger_type,
    zone_id,
    affected_hours,
    fraud_score,
    fraud_decision,
    fraud_action,
    fraud_components,
    pricing: {
      premium:    pricing.premium,
      risk_score: pricing.risk_score,
    },
    expected_hourly,
    payout,
  };

  logTrigger(auditEntry);
  console.log("📋 Payout trigger processed:", auditEntry);

  // ── 6. Response ───────────────────────────────────────────────────────────
  return res.json({
    success:       true,
    rider_id,
    trigger_type,
    payout,
    fraud_score,
    fraud_decision,
    action:        fraud_action,
    pricing_summary: {
      premium:    pricing.premium,
      risk_score: pricing.risk_score,
    },
    expected_hourly,
  });
});

// ---------------------------------------------------------------------------
// GET /health  — liveness probe
// ---------------------------------------------------------------------------
app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "RiderShield API", port: PORT });
});

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 RiderShield API running on port ${PORT}`);
    console.log(`   ML  service : ${ML_SERVICE_URL}`);
    console.log(`   Fraud service: ${FRAUD_SERVICE_URL}`);
  });
}

module.exports = app;
