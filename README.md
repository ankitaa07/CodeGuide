# RiderShield

**AI-powered parametric income protection for India’s gig delivery workforce (food delivery + q-commerce).**

RiderShield provides **claim-free, automated payouts** when real-world disruptions (rain, traffic gridlock, AQI spikes, civic restrictions, connectivity/platform outages) cause a measurable drop in rider earnings.

---

## 1) Problem & User Scenarios

### Problem
Gig riders’ earnings are directly tied to completed deliveries. When disruptions occur, order volume or delivery feasibility drops, leading to **instant income loss** with no safety net.

**Disruptions covered (parametric):**
- Extreme rainfall / flooding
- Traffic gridlock
- Hazardous air pollution
- Civic restrictions / protests / closures
- Internet or platform access loss

---

### Personas

**Rahul — Full-time food delivery rider**
- Works: **8–10 hrs/day**
- Earnings: **₹900–₹1200/day**
- Risk: high exposure to weather + congestion

**Scenario:** Heavy rain reduces demand and slows travel → fewer deliveries  
**RiderShield:** Detect rain + verify income drop → automatic payout

---

**Priya — Part-time q-commerce partner**
- Works: **4–5 hrs (evenings)**
- Earnings: **₹400–₹700/shift**
- Risk: dependent on platform uptime + order flow

**Scenario:** Platform outage or gridlock → cancellations → lower earnings  
**RiderShield:** Detect outage/gridlock + verify impact → automatic payout

---

## 2) How It Works (End-to-End)

1. **Activate Coverage (Weekly)**
   - Rider enables coverage for the upcoming **week**
   - Coverage is **zone-specific** (~2 km around store/dark-store)

2. **AI-Based Weekly Pricing**
   - Premium computed using:
     - rider history (hours, earnings, volatility)
     - zone risk forecast (next 7 days)

3. **Continuous Monitoring**
   - Track disruption signals via APIs:
     - weather, traffic, AQI, civic events, connectivity/platform health

4. **Expected vs Actual Check**
   - Predict expected earnings/hour
   - Compare with actual performance during disruption

5. **Trigger Logic + Fraud Checks**
   - Payout only if:
     - hazard threshold met
     - impact threshold met
     - fraud checks passed

6. **Automated Payout**
   - Instant payout (Razorpay test/mock)
   - Full audit trail explaining decision

---

## 3) Weekly Premium Model

RiderShield calculates premiums **weekly** to match gig payout cycles and keep costs predictable.

### 3.1 Inputs

**A) Weather risk**
- Rain probability, intensity (>20 mm/hr), alerts  
- Source: OpenWeatherMap (IMD optional)

**B) Traffic risk**
- Congestion vs working hours  
- Source: TomTom / Google Traffic  

**C) Air quality risk**
- AQI spike probability (seasonality + trends)  
- Source: WAQI  

**D) Civic risk**
- Closures, protests, events  
- Source: curated civic feed  

**E) Income exposure**
- predicted weekly earnings + working hours  
- volatility by time window  

---

### 3.2 Model (Expected Loss + Premium)

For each trigger *t* (rain, gridlock, AQI, civic, internet):

- `P(t)` = probability of occurrence  
- `S(t)` = severity (income loss impact)

Define:
- `E_income` = predicted weekly income  
- `coverage_ratio` = protected fraction (0.5–0.7)  
- `max_payout_week` = weekly cap  
- `risk_margin` = 15–30%  
- `ops_fee` = flat fee  
- `ExpectedLoss = Σ_t [ P(t) * S(t) * (E_income * coverage_ratio) ]`
- `ExpectedLoss = min(ExpectedLoss, max_payout_week)`
- `Premium = ExpectedLoss * (1 + risk_margin) + ops_fee`


---

### 3.3 Policy Snapshot (Critical)

When coverage is activated, we store an immutable snapshot:
- premium, caps, thresholds, coverage_ratio  
- pricing features (`zone_week_features`)  

Ensures payouts use **exact same parameters** as pricing.

---

## 4) Parametric Triggers

Two-layer design:
1. **Hazard Trigger** → disruption exceeds threshold  
2. **Impact Trigger** → income drops vs baseline  

### Common Definitions
- **Zone:** ~2 km geofence  
- **Baseline:** expected earnings/hour from historical patterns  
- **Impact threshold:** e.g., `income_drop ≥ 30%` over 60–120 min  

---

### Trigger Examples

**Rain**
- Hazard: `rain_mm_per_hr > 20` (≥ 30 min)  
- Impact: income drop ≥ 30%  

**Traffic**
- Hazard: `avg_speed_kmh < 8` (≥ 45 min)  
- Impact: drop ≥ 25%  

**AQI**
- Hazard: `AQI > 450` (≥ 2 hrs)  
- Impact: drop ≥ 20–30%  

**Civic**
- Hazard: disruption in zone (≥ 60 min)  
- Impact: drop ≥ 30%  

**Connectivity**
- Hazard: outage / failure spike (≥ 30 min)  
- Impact: rider online but cannot complete orders  

---

### Payout Logic

- `affected_hours` = duration of disruption  
- `insured_hourly = weekly_income / weekly_hours`  
- `payout = insured_hourly * affected_hours * coverage_ratio`

Caps:
- `payout ≤ max_payout_per_event`
- `payout ≤ max_payout_week`

---

## 5) Platform Strategy

### MVP → Web App
- fastest to build + deploy  
- easy demo via URL  
- simpler API integration  
- better transparency (audit visibility)  

### Future → Mobile Integration
- GPS-based geofencing  
- network diagnostics  
- push notifications + offline support  

---

## 6) AI/ML Components

### A) Risk Prediction
- Goal: predict disruption probability per zone-week  
- Models: RF / GBM / XGBoost  
- Output: `P(t)` or `risk_score ∈ [0,1]`  

---

### B) Income Prediction
- Goal: expected earnings/hour baseline  
- Models: Linear / GBM  
- Inputs: rider history, time, zone, seasonality  
- Output: expected rate + confidence band  

---

### C) Fraud Detection
- Rules:
  - geofence validation  
  - online activity verification  
  - timestamp integrity  

- ML:
  - Isolation Forest (behavior anomalies)  

- Output: `fraud_score ∈ [0,1]`

---

## 6.1) Anti-Spoofing and Adversarial Defense Techniques

RiderShield uses *multi-signal verification* and *graduated UX* rather than a single GPS point to prevent "fake stranded" payouts (GPS spoofing, emulator farms, coordinated rings).

### 1) Distinction (spoofer vs. real stranded rider)

Only when *all three* coincide is a payout authorized:
- Parametric trigger is verified within the rider's geofence/time window (rain/traffic/AQI/outage).
- Hazard signature (e.g., gridlock → slower trips + lower completions; outage → high API failures + stalled events) is consistent with actual earnings/deliveries drop.
- Telemetry demonstrates authentic movement and device behavior (no teleports, no repeated or replayed traces, no simulator-like patterns).

The main idea is that while spoofers can fabricate coordinates, it is much harder to fabricate hazard + impact + plausible motion/network behavior all at once.

### 2) Information beyond GPS (to identify fraud rings and spoofing)

Privacy-conscious signals include:
- Trajectory realism: speed/acceleration jitter, heading changes, map-matching plausibility, teleport jumps, GPS accuracy radius stability.
- Device integrity: mock-location flags, rooted/jailbroken indicators, sensor consistency (accelerometer/gyro vs. movement) where available.
- Network/app signals: timeout/retry patterns, latency/jitter, heartbeat gaps, repeated identical fingerprints from "different" riders.
- Ring detection: repeated near-cap claiming, synchronized behavior across accounts, shared payout identifiers/devices, micro-area/time spikes in claims.

Models:
- Per-rider anomalies: Isolation Forest.
- Coordinated rings: graph/clustering + burst detection.

### 3) UX balance (flagged claims without penalizing honest riders)

Confidence tiers:
- Green: instant payout.
- Amber: delayed payout + passive recheck (telemetry sync grace window, cross-source hazard validation, signal recovery).
- Red: block + manual review (substantial fraud evidence only).

To avoid rejecting honest riders due to missing telemetry, we use grace windows and support delayed verification during inclement weather or network outages.

---

## 7) Tech Stack

**Frontend**
- React  
- Tailwind CSS  
- Mapbox / Google Maps API  

**Backend**
- Node.js + Express / Python Flask  

Services:
- Pricing  
- Policy  
- Monitoring  
- Payout  

**ML**
- Python  
- Pandas, NumPy  
- scikit-learn  

**APIs**
- OpenWeatherMap  
- TomTom / Google Traffic  
- WAQI  
- Cloudflare Radar  
- Razorpay  

**Data**
- Postgres  
- Redis  

---

## 8) Development Plan

### Phase 1 — Foundation
- define zones + policy rules  
- define data contracts  

### Phase 2 — MVP
- rider UI  
- pricing engine  
- monitoring engine  
- payout simulation  
- audit logs  

### Phase 3 — Scale
- train ML models  
- fraud improvements  
- observability + reliability  
- security + privacy  

---

## 9) Key Design Principles

- **Hazard + Impact triggers → trust**
- **Policy snapshot → consistency**
- **Zone-based logic → realism**
- **Small premiums → affordability**

---
