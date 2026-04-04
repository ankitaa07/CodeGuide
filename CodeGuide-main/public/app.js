// Admin Setup
const btnRegister = document.getElementById('btn-register');
const adminRiderIdBadge = document.getElementById('admin-rider-id');

// Rider App
const btnActivate = document.getElementById('btn-activate');
const appPremium = document.getElementById('app-premium');
const appCap = document.getElementById('app-cap');
const rToggle = document.querySelector('.toggle');

// Trigger Simulation
const selectHazard = document.getElementById('select-hazard');
const checkSpoof = document.getElementById('check-spoof');
const btnTrigger = document.getElementById('btn-trigger');
const riderAlert = document.getElementById('trigger-alert');
const riderAlertMsg = document.getElementById('trigger-alert-msg');
const triggerBanner = document.getElementById('trigger-payout-banner');

// Audit
const btnRefreshAudit = document.getElementById('btn-refresh-audit');
const auditTableBody = document.getElementById('audit-table-body');

let state = {
    riderId: null,
    policyId: null,
    isActive: false
};

// 1. Register Rider
btnRegister.addEventListener('click', async () => {
    btnRegister.disabled = true;
    btnRegister.innerText = "Connecting...";
    
    try {
        const id = 'R-ZPTO-' + Math.floor(Math.random() * 10000);
        const res = await fetch('/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                rider_id: id,
                name: 'Priya (Zepto)',
                phone: '9876543210',
                zone_id: 'Koramangala', // Used to fetch weather from ML
                weekly_hours: 40,
                income_history: []
            })
        });

        const data = await res.json();
        state.riderId = data.rider_id;
        
        adminRiderIdBadge.innerText = state.riderId;
        adminRiderIdBadge.style.color = '#34d399';
        btnRegister.innerText = "✓ Connected";
        
        // Unlock Rider App
        btnActivate.disabled = false;
        refreshAudit();
    } catch (e) {
        alert("Failed to connect rider: " + e.message);
        btnRegister.disabled = false;
        btnRegister.innerText = "Register Demo Rider";
    }
});

// 2. Rider Activates Policy
btnActivate.addEventListener('click', async () => {
    if(!state.riderId) return;
    btnActivate.disabled = true;
    btnActivate.innerText = "Calculating Risk Engine...";

    try {
        const res = await fetch('/policy/activate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                rider_id: state.riderId,
                week_start: '2026-04-05',
                rider_income_weekly: 5000
            })
        });

        const data = await res.json();
        if(data.error) throw new Error(data.error);

        state.policyId = data.policy_id;
        state.isActive = true;

        // Update Rider UI
        appPremium.innerText = `₹ ${data.snapshot.premium.toFixed(2)}`;
        appCap.innerText = `₹ ${data.snapshot.caps.max_hourly_payout.toFixed(2)}/hr`;
        rToggle.classList.add('active');
        
        btnActivate.innerText = "✅ Coverage Active";
        btnTrigger.disabled = false;
        refreshAudit();
        
    } catch (e) {
        alert("Failed to activate: " + e.message);
        btnActivate.disabled = false;
        btnActivate.innerText = "Activate Policy Now";
    }
});

// 3. Admin Simulates Hazard
btnTrigger.addEventListener('click', async () => {
    if(!state.isActive) return;
    btnTrigger.disabled = true;
    const hazard = selectHazard.value;
    const isSpoof = checkSpoof.checked;
    
    // Show Rider Alert
    riderAlert.classList.remove('hidden');
    riderAlertMsg.innerText = `Severe ${hazard} detected in your delivery zone. Processing parametric check...`;
    triggerBanner.innerText = "Evaluating Impact...";
    triggerBanner.style.background = "var(--amber)";

    try {
        const res = await fetch('/events/trigger', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                rider_id: state.riderId,
                trigger_type: hazard,
                zone_id: 'Koramangala',
                affected_hours: 2,
                is_spoof_demo: isSpoof
            })
        });

        const data = await res.json();
        
        if (data.decision === 'green') {
            triggerBanner.style.background = "var(--success)";
            triggerBanner.innerText = `✅ Payout Authenticated: ₹${data.payoutAmount}`;
        } else if (data.decision === 'amber') {
             triggerBanner.style.background = "var(--amber)";
             triggerBanner.innerText = `⚠️ Flagged by ML (Score: ${data.fraud_score}). Delayed Payout.`;
        } else {
             triggerBanner.style.background = "var(--danger)";
             triggerBanner.innerText = `🚨 Blocked: GPS Anomaly Detected (Score: ${data.fraud_score})`;
        }
        
        refreshAudit();
        setTimeout(() => { btnTrigger.disabled = false; }, 2000);
        
    } catch (e) {
        alert("Trigger failed: " + e.message);
        btnTrigger.disabled = false;
    }
});

// 4. Audit Table Fetching
btnRefreshAudit.addEventListener('click', refreshAudit);

async function refreshAudit() {
    try {
        const res = await fetch('/audit');
        const logs = await res.json();
        
        if(logs.length === 0) return;
        
        auditTableBody.innerHTML = '';
        
        // Show newest first
        [...logs].reverse().forEach(log => {
            const tr = document.createElement('tr');
            
            const d = new Date(log.timestamp);
            const timeStr = `${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}:${d.getSeconds().toString().padStart(2,'0')}`;
            
            let tagClass = 'green';
            if(log.decision === 'amber') tagClass = 'amber';
            if(log.decision === 'red') tagClass = 'red';
            
            tr.innerHTML = `
                <td class="text-muted">${timeStr}</td>
                <td><span style="font-family: monospace;">${log.rider_id}</span></td>
                <td>${log.event}</td>
                <td><strong>${log.fraud_score ? log.fraud_score.toFixed(2) : '--'}</strong></td>
                <td><span class="tag ${tagClass}">${log.decision || 'N/A'}</span></td>
                <td><strong>₹${log.payout_amount || 0}</strong></td>
            `;
            auditTableBody.appendChild(tr);
        });
        
    } catch (e) {
        console.error("Audit fetch failed", e);
    }
}

// Initial fetch
refreshAudit();
