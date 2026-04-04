# run_services.ps1
Write-Host "Installing NPM dependencies..."
npm install

Write-Host "Starting RiderShield System of Record (Node.js) on Port 3000..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; node server.js" -WindowStyle Normal

Write-Host "Starting ML Pricing Engine (Flask) on Port 5002..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\ridershield'; py app.py" -WindowStyle Normal

Write-Host "Starting Fraud Verification Engine (Flask) on Port 5002..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; py fraud_engine.py" -WindowStyle Normal

Write-Host "✅ All 3 backend services have been launched in separate terminal windows."
Write-Host "Feel free to arrange them for your implementation video."
