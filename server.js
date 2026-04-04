require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { getRecord, saveRecord, getRecords } = require('./storage/db');
const { checkFraud } = require('./services/mlClient');
const { getFraudScore } = require('./services/fraudClient');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const PORT = process.env.PORT || 3000;

// 1) POST /register
app.post('/register', (req, res) => {
    const { rider_id: custom_id, name, phone, zone_id, income_history, weekly_hours } = req.body;
    const rider_id = custom_id || `R-${Date.now()}`;
    
    const newRider = {
        rider_id, 
        name, 
        phone, 
        zone_id, 
        income_history: income_history || [], 
        weekly_hours: weekly_hours || 40, 
        created_at: new Date().toISOString()
    };
    
    saveRecord('riders', newRider);
    res.json({ rider_id: newRider.rider_id, created_at: newRider.created_at });
});

// 2) POST /policy/activate
app.post('/policy/activate', async (req, res) => {
    const { rider_id, week_start, rider_income_weekly } = req.body;
    const riders = getRecords('riders');
    const rider = riders.find(r => r.rider_id === rider_id);
    if (!rider) return res.status(404).json({ error: "Rider not found" });

    try {
    // 🔥 Call Fraud ML instead (demo workaround)
    const fraud = await checkFraud();

    const policy_id = `POL-${Date.now()}`;
    const policy = {
        policy_id,
        rider_id,
        week_start,
        snapshot: {
            premium: 49, // demo value
            risk_score: fraud.fraud_score,
            breakdown: { note: "AI risk-based pricing (demo)" },
            caps: { 
                max_hourly_payout: rider_income_weekly / rider.weekly_hours, 
                max_total_payout: rider_income_weekly 
            }
        },
        status: "active",
        created_at: new Date().toISOString()
    };

    saveRecord('policies', policy);
    res.json(policy);

} catch (err) {
    res.status(500).json({ error: "ML integration failed", details: err.message });
}
});

// 3) POST /events/trigger
app.post('/events/trigger', async (req, res) => {
    const { rider_id, trigger_type, zone_id, severity, affected_hours = 1, timestamp } = req.body;
    
    // Look up active policy 
    const policies = getRecords('policies');
    // Using simple reverse to get the most recent active policy for the rider
    const activePolicy = [...policies].reverse().find(p => p.rider_id === rider_id && p.status === "active");
    
    if (!activePolicy) {
        return res.status(404).json({ error: "No active policy found for rider" });
    }

    const { fraud_score, decision, action } = await getFraudScore(trigger_type, affected_hours, req.body.is_spoof_demo);
    
    const payoutAmount = activePolicy.snapshot.caps.max_hourly_payout * affected_hours;
    
    const claim = {
        claim_id: `CLM-${Date.now()}`, 
        rider_id, 
        policy_id: activePolicy.policy_id, 
        trigger_type, 
        affected_hours, 
        payoutAmount, 
        fraud_score, 
        decision, 
        action, 
        timestamp: timestamp || new Date().toISOString()
    };
    
    saveRecord('claims', claim);
    
    if (decision === "green") {
        saveRecord('payouts', { claim_id: claim.claim_id, rider_id, amount: payoutAmount, status: "completed" });
    }

    // Audit Log Entry
    const auditEntry = {
        audit_id: `AUD-${Date.now()}`, 
        event: "trigger_processed", 
        rider_id, 
        claim_id: claim.claim_id, 
        fraud_score, 
        decision, 
        payout_amount: decision === "green" ? payoutAmount : 0, 
        timestamp: new Date().toISOString()
    };
    saveRecord('audit_log', auditEntry);

    res.json(claim);
});

// GET /audit
app.get('/audit', (req, res) => {
    res.json(getRecords('audit_log'));
});

// GET /health
app.get('/health', async (req, res) => {
    let mlStatus = "down";
    const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
    try {
        const mlTest = await fetch(`${process.env.ML_BASE_URL || 'http://localhost:5002'}/api/zone_risk/Z01`);
        if (mlTest.ok) mlStatus = "up";
    } catch (e) {
        // Ignore errors, implies service is down
    }

    res.json({
        status: "ok",
        ml_service: mlStatus,
        timestamp: new Date().toISOString()
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Backend System of Record running on port ${PORT}`);
});
