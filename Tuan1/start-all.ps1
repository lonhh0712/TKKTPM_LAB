# Script để chạy tất cả services cùng lúc
# Sử dụng: .\start-all.ps1

Write-Host "🚀 Đang khởi động tất cả services..." -ForegroundColor Green

# Kiểm tra RabbitMQ
Write-Host "`n⚠️  LƯU Ý: Đảm bảo RabbitMQ đã chạy trước!" -ForegroundColor Yellow
Write-Host "   Nếu chưa có, chạy: docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management" -ForegroundColor Yellow

Start-Sleep -Seconds 2

# Terminal 1 - Service 1
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend\service1'; Write-Host '📤 Service 1 (RabbitMQ Publisher) - Port 3001' -ForegroundColor Cyan; npm run dev"

Start-Sleep -Seconds 1

# Terminal 2 - Service 2
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend\service2'; Write-Host '📥 Service 2 (RabbitMQ Consumer) - Port 3002' -ForegroundColor Cyan; npm run dev"

Start-Sleep -Seconds 1

# Terminal 3 - JWT Service
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend\jwt-service'; Write-Host '🔐 JWT Service - Port 3003' -ForegroundColor Cyan; npm run dev"

Start-Sleep -Seconds 1

# Terminal 4 - Frontend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; Write-Host '⚛️  Frontend (React) - Port 5173' -ForegroundColor Cyan; npm run dev"

Write-Host "`n✅ Đã khởi động tất cả services!" -ForegroundColor Green
Write-Host "`n📍 Các services đang chạy tại:" -ForegroundColor Yellow
Write-Host "   - Service 1: http://localhost:3001" -ForegroundColor White
Write-Host "   - Service 2: http://localhost:3002" -ForegroundColor White
Write-Host "   - JWT Service: http://localhost:3003" -ForegroundColor White
Write-Host "   - Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "`n💡 Đóng các cửa sổ PowerShell để dừng services" -ForegroundColor Cyan
