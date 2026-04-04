# run_demo_flow.ps1
Write-Host "=================================="
Write-Host " RiderShield Demonstration Script "
Write-Host "=================================="
Write-Host ""
Write-Host "[1/3] Registering Demo Rider (R-DEMO)..."

$registration = Invoke-RestMethod -Method Post -Uri "http://localhost:3000/register" -ContentType "application/json" -Body (@{
    rider_id = "R-DEMO"
    name = "Demo Rider"
    phone = "9999999999"
    zone_id = "Z01"
    weekly_hours = 40
    income_history = @()
} | ConvertTo-Json)

Write-Host "✅ Registered Demo Rider: $($registration.rider_id)"
Start-Sleep -Seconds 2

Write-Host ""
Write-Host "[2/3] Activating Weekly Policy & Hitting ML Pricing Engine..."

$policy = Invoke-RestMethod -Method Post -Uri "http://localhost:3000/policy/activate" -ContentType "application/json" -Body (@{
    rider_id = "R-DEMO"
    week_start = "2026-04-05"
    rider_income_weekly = 5000
} | ConvertTo-Json)

Write-Host "✅ Policy Activated! Policy ID: $($policy.policy_id)"
Write-Host "   Premium Computed: $($policy.snapshot.premium)"
Write-Host "   Caps - Max Total: $($policy.snapshot.caps.max_total_payout), Max Hourly: $($policy.snapshot.caps.max_hourly_payout)"
Start-Sleep -Seconds 2

Write-Host ""
Write-Host "[3/3] Starting Trigger Service to simulate Real-Time Rain Disruption..."
Write-Host "Watch the Node Backend terminal for the payout decision!"

# This runs the trigger service locally in the current window!
$env:DEMO_MODE="true"
node index.js
