#requires -RunAsAdministrator

Write-Host "=== LMS Application Fix Script ===" -ForegroundColor Green
Write-Host "Running with Administrator privileges..." -ForegroundColor Yellow

# Stop all existing Node processes
Write-Host "Stopping existing Node.js processes..." -ForegroundColor Cyan
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Get-Process -Name next -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue

# Add firewall rules
Write-Host "Adding Windows Firewall exceptions..." -ForegroundColor Cyan
netsh advfirewall firewall add rule name="LMS Backend" dir=in action=allow protocol=TCP localport=5001 enable=yes
netsh advfirewall firewall add rule name="LMS Frontend" dir=in action=allow protocol=TCP localport=3000 enable=yes

# Start backend
Write-Host "Starting LMS Backend..." -ForegroundColor Cyan
Set-Location "C:\Users\Anurag\lms\backend"
Start-Process -FilePath "npm" -ArgumentList "run dev" -NoNewWindow

# Wait for backend to start
Start-Sleep -Seconds 5

# Test backend
Write-Host "Testing Backend API..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5001/api/health" -Method GET -TimeoutSec 10
    Write-Host "✅ Backend is working! Status: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend test failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Start frontend
Write-Host "Starting LMS Frontend..." -ForegroundColor Cyan
Set-Location "C:\Users\Anurag\lms\frontend"
Start-Process -FilePath "npm" -ArgumentList "run dev" -NoNewWindow

# Wait for frontend to start
Start-Sleep -Seconds 8

# Test frontend
Write-Host "Testing Frontend..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -Method GET -TimeoutSec 10
    Write-Host "✅ Frontend is working! Status: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "❌ Frontend test failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Open browser
Write-Host "Opening LMS in browser..." -ForegroundColor Cyan
Start-Process "http://localhost:3000"

Write-Host ""
Write-Host "=== LMS Application Status ===" -ForegroundColor Green
Write-Host "Backend: http://localhost:5001" -ForegroundColor White
Write-Host "Frontend: http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "If still not working, try refreshing the browser or restarting your computer." -ForegroundColor Yellow