// ===== BASE URL =====
const BASE_URL = "https://codeguide-o07s.onrender.com";

// ===== STATE =====
let state = {
    riderId: null,
    policyId: null,
    isActive: false
};

// ===== ELEMENTS =====
const btnRegister = document.getElementById('btn-register');
const adminRiderIdBadge = document.getElementById('admin-rider-id');
const btnActivate = document.getElementById('btn-activate');
const appPremium = document.getElementById('app-premium');
const appCap = document.getElementById('app-cap');
const rToggle = document.querySelector('.toggle');
const selectHazard = document.getElementById('select-hazard');
const checkSpoof = document.getElementById('check-spoof');
const btnTrigger = document.getElementById('btn-trigger');
const riderAlert = document.getElementById('trigger-alert');
const riderAlertMsg = document.getElementById('trigger-alert-msg');
const triggerBanner = document.getElementById('trigger-payout-banner');
const btnRefreshAudit = document.getElementById('btn-refresh-audit');
const auditTableBody = document.getElementById('audit-table-body');

// ===== SAFE FETCH (IMPORTANT) =====
async function safeFetch(url, options = {}) {
    const res = await fetch(url, options);
    const text = await res.text();

    try {
        return JSON.parse(text);
    } catch {
        console.error("NOT JSON RESPONSE:", text);
        throw new Error("Server returned HTML instead of JSON");
    }
}

// ================= REGISTER =================
btnRegister.addEventListener('click', async () => {
    btnRegister.disabled = true;
    btnRegister.innerText = "Connecting...";

    try {
        const id = 'R-ZPTO-' + Math.floor(Math.random() * 10000);

        const data = await safeFetch(`${BASE_URL}/api/register-rider`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                rider_id: id
            })
        });

        state.riderId = data.rider?.id || id;

        adminRiderIdBadge.innerText = state.riderId;
        adminRiderIdBadge.style.color = '#34d399';
        btnRegister.innerText = "✓ Connected";

        btnActivate.disabled = false;
        refreshAudit();

    } catch (e) {
        alert("Failed to connect rider: " + e.message);
        btnRegister.disabled = false;
        btnRegister.innerText = "Register Demo Rider";
    }
});

// ================= ACTIVATE =================
btnActivate.addEventListener('click', async () => {
    if(!state.riderId) return;

    btnActivate.disabled = true;
    btnActivate.innerText = "Calculating...";

    try {
        const data = await safeFetch(`${BASE_URL}/policy/activate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                rider_id: state.riderId
            })
        });

        state.isActive = true;

        appPremium.innerText = `₹ ${data.premium || 50}`;
        appCap.innerText = `₹ ${data.cap || 100}/hr`;
        rToggle.classList.add('active');

        btnActivate.innerText = "✅ Active";
        btnTrigger.disabled = false;

    } catch (e) {
        alert("Activation failed: " + e.message);
        btnActivate.disabled = false;
        btnActivate.innerText = "Activate Policy Now";
    }
});

// ================= TRIGGER =================
btnTrigger.addEventListener('click', async () => {
    if(!state.isActive) return;

    btnTrigger.disabled = true;

    const hazard = selectHazard.value;

    riderAlert.classList.remove('hidden');
    triggerBanner.innerText = "Processing...";
    triggerBanner.style.background = "orange";

    try {
        const data = await safeFetch(`${BASE_URL}/events/trigger`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                rider_id: state.riderId,
                trigger_type: hazard
            })
        });

        triggerBanner.style.background = "green";
        triggerBanner.innerText = `₹ ${data.payout || 100} credited`;

        refreshAudit();

    } catch (e) {
        alert("Trigger failed: " + e.message);
        btnTrigger.disabled = false;
    }
});

// ================= AUDIT =================
btnRefreshAudit.addEventListener('click', refreshAudit);

async function refreshAudit() {
    try {
        const logs = await safeFetch(`${BASE_URL}/api/logs`);

        auditTableBody.innerHTML = '';

        logs.forEach(log => {
            const tr = document.createElement('tr');

            tr.innerHTML = `
                <td>${log.time || '--'}</td>
                <td>${log.rider || '--'}</td>
                <td>${log.event || '--'}</td>
                <td>${log.fraud_score || '--'}</td>
                <td>${log.decision || '--'}</td>
                <td>₹${log.payout || 0}</td>
            `;

            auditTableBody.appendChild(tr);
        });

    } catch (e) {
        console.error("Audit error:", e);
    }
}

// INITIAL LOAD
refreshAudit();