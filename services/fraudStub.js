function getFraudScore(trigger_type, affected_hours) {
    let score = 0.1; 
    
    // Simple demo logic simulating behavior checks
    if (affected_hours > 5) score += 0.4;
    if (trigger_type === "rain") score += 0.1;
    
    const fraud_score = Math.min(score, 1.0);
    
    let decision = "green";
    let action = "auto_approve";
    
    if (fraud_score >= 0.7) {
        decision = "red";
        action = "block_manual_review";
    } else if (fraud_score >= 0.4) {
        decision = "amber";
        action = "delay_30min_reverify";
    }
    
    return { fraud_score: parseFloat(fraud_score.toFixed(2)), decision, action };
}

module.exports = { getFraudScore };
