# 🚀 Hướng Dẫn Chạy Frontend và Backend

## Cách 1: Chạy tự động (Khuyên dùng)

### Bước 1: Đảm bảo RabbitMQ đã chạy
```powershell
# Nếu chưa có RabbitMQ, chạy Docker:
docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management

# Hoặc nếu đã cài RabbitMQ, đảm bảo service đang chạy
```

### Bước 2: Chạy script tự động
```powershell
.\start-all.ps1
```

Script này sẽ tự động mở 4 cửa sổ terminal và chạy tất cả services.

---

## Cách 2: Chạy thủ công (Từng service)

Mở **4 cửa sổ PowerShell** riêng biệt:

### Terminal 1 - Service 1 (RabbitMQ Publisher)
```powershell
cd backend\service1
npm run dev
```
📍 Chạy tại: **http://localhost:3001**

### Terminal 2 - Service 2 (RabbitMQ Consumer)
```powershell
cd backend\service2
npm run dev
```
📍 Chạy tại: **http://localhost:3002**

### Terminal 3 - JWT Service
```powershell
cd backend\jwt-service
npm run dev
```
📍 Chạy tại: **http://localhost:3003**

### Terminal 4 - Frontend (React)
```powershell
cd frontend
npm run dev
```
📍 Chạy tại: **http://localhost:5173**

---

## Cách 3: Sử dụng npm scripts từ root

Từ thư mục gốc, bạn có thể chạy từng service:

```powershell
# Frontend
npm run dev:frontend

# Service 1
npm run dev:service1

# Service 2
npm run dev:service2

# JWT Service
npm run dev:jwt
```

---

## ✅ Kiểm tra Services đã chạy

Sau khi khởi động, truy cập:

- 🌐 **Frontend**: http://localhost:5173
- 📤 **Service 1**: http://localhost:3001/health
- 📥 **Service 2**: http://localhost:3002/health
- 🔐 **JWT Service**: http://localhost:3003/api/auth/public-key

---

## ⚠️ Lưu ý

1. **RabbitMQ phải chạy trước** Service 1 và Service 2
2. Nếu gặp lỗi port đã được sử dụng, kiểm tra và đóng process đang dùng port đó
3. Để dừng services, đóng các cửa sổ terminal hoặc nhấn `Ctrl+C`

---

## 🐛 Xử lý lỗi

### Port đã được sử dụng
```powershell
# Tìm process đang dùng port
netstat -ano | findstr :3001

# Kill process (thay PID bằng số từ lệnh trên)
taskkill /PID <PID> /F
```

### RabbitMQ không kết nối được
- Kiểm tra RabbitMQ đã chạy: `docker ps` hoặc kiểm tra service
- Kiểm tra port 5672 đã mở
- Thử restart RabbitMQ
