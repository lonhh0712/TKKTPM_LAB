# 🚀 Lap Tuan Project - RabbitMQ & JWT

Project React với backend services cho Message Queue (RabbitMQ) và JWT Authentication.

## 📋 Mục tiêu

### Message Queue (RabbitMQ)
- Hiểu và áp dụng được Event-driven message queue RabbitMQ
- Tạo 2 services: Service 1 push events, Service 2 nhận và xử lý events

### JWT Authentication
- Hiểu và áp dụng được JWT để tạo accessToken và refreshToken
- JWT là gì?
- Ý nghĩa và công dụng của Access token và Refresh Token
- Cách tạo và kiểm tra 1 token hợp lệ
- Hiện thực OAuth Resource Server sử dụng Spring Security OAuth2 Resource Server sử dụng thuật toán RSA

## 🏗️ Cấu trúc Project

```
LapTuan/
├── frontend/              # React frontend application
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── backend/
│   ├── service1/         # Service 1 - Push events to RabbitMQ
│   │   ├── server.js
│   │   └── package.json
│   │
│   ├── service2/         # Service 2 - Receive events from RabbitMQ
│   │   ├── server.js
│   │   └── package.json
│   │
│   └── jwt-service/      # JWT Authentication Service
│       ├── server.js
│       ├── keys/         # RSA keys (auto-generated)
│       └── package.json
│
└── package.json          # Root package.json
```

## 🚀 Cài đặt và Chạy

### Yêu cầu
- Node.js (v18 hoặc cao hơn)
- RabbitMQ Server (cài đặt và chạy trên localhost:5672)
- npm hoặc yarn

### Bước 1: Cài đặt RabbitMQ

**Windows:**
1. Tải và cài đặt RabbitMQ từ: https://www.rabbitmq.com/download.html
2. Hoặc sử dụng Docker:
   ```bash
   docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management
   ```

**Linux/Mac:**
```bash
# Ubuntu/Debian
sudo apt-get install rabbitmq-server
sudo systemctl start rabbitmq-server

# Mac
brew install rabbitmq
brew services start rabbitmq
```

### Bước 2: Cài đặt Dependencies

```bash
# Cài đặt tất cả dependencies
npm run install:all
```

Hoặc cài đặt từng phần:
```bash
# Frontend
cd frontend
npm install

# Service 1
cd ../backend/service1
npm install

# Service 2
cd ../service2
npm install

# JWT Service
cd ../jwt-service
npm install
```

### Bước 3: Chạy các Services

Mở 4 terminal windows:

**Terminal 1 - Service 1 (RabbitMQ Publisher):**
```bash
cd backend/service1
npm run dev
```
Service chạy tại: http://localhost:3001

**Terminal 2 - Service 2 (RabbitMQ Consumer):**
```bash
cd backend/service2
npm run dev
```
Service chạy tại: http://localhost:3002

**Terminal 3 - JWT Service:**
```bash
cd backend/jwt-service
npm run dev
```
Service chạy tại: http://localhost:3003

**Terminal 4 - React Frontend:**
```bash
cd frontend
npm run dev
```
Frontend chạy tại: http://localhost:5173

## 📡 API Endpoints

### Message Queue APIs

#### Service 1 (Publisher)
- **POST** `http://localhost:3001/api/events`
  - Gửi event vào RabbitMQ queue
  - Body:
    ```json
    {
      "type": "user_action",
      "data": {
        "message": "Hello from Service 1"
      }
    }
    ```

- **GET** `http://localhost:3001/health`
  - Kiểm tra trạng thái Service 1

#### Service 2 (Consumer)
- **GET** `http://localhost:3002/api/status`
  - Kiểm tra trạng thái Service 2

- **GET** `http://localhost:3002/health`
  - Health check

### JWT APIs

#### Authentication
- **POST** `http://localhost:3003/api/auth/login`
  - Đăng nhập và lấy access token + refresh token
  - Body:
    ```json
    {
      "username": "admin",
      "password": "admin123"
    }
    ```
  - Response:
    ```json
    {
      "success": true,
      "accessToken": "...",
      "refreshToken": "...",
      "user": {
        "id": 1,
        "username": "admin",
        "role": "admin"
      }
    }
    ```

- **POST** `http://localhost:3003/api/auth/refresh`
  - Refresh access token
  - Body:
    ```json
    {
      "refreshToken": "your_refresh_token"
    }
    ```

- **GET** `http://localhost:3003/api/auth/verify`
  - Verify access token (Resource Server endpoint)
  - Header: `Authorization: Bearer {access_token}`

- **POST** `http://localhost:3003/api/auth/logout`
  - Đăng xuất và revoke refresh token
  - Body:
    ```json
    {
      "refreshToken": "your_refresh_token"
    }
    ```

- **GET** `http://localhost:3003/api/auth/public-key`
  - Lấy public key để verify token

## 🧪 Test với Postman

### Test Message Queue

1. **Gửi Event:**
   - Method: POST
   - URL: `http://localhost:3001/api/events`
   - Body (raw JSON):
     ```json
     {
       "type": "order_created",
       "data": {
         "orderId": "12345",
         "userId": "user123",
         "amount": 100000
       }
     }
     ```

2. **Kiểm tra Service 2:**
   - Xem console của Service 2 để thấy event được nhận và xử lý

### Test JWT

1. **Login:**
   - Method: POST
   - URL: `http://localhost:3003/api/auth/login`
   - Body (raw JSON):
     ```json
     {
       "username": "admin",
       "password": "admin123"
     }
     ```
   - Lưu `accessToken` và `refreshToken` từ response

2. **Verify Token:**
   - Method: GET
   - URL: `http://localhost:3003/api/auth/verify`
   - Headers:
     - Key: `Authorization`
     - Value: `Bearer {access_token}`

3. **Refresh Token:**
   - Method: POST
   - URL: `http://localhost:3003/api/auth/refresh`
   - Body (raw JSON):
     ```json
     {
       "refreshToken": "{refresh_token}"
     }
     ```

4. **Get Public Key:**
   - Method: GET
   - URL: `http://localhost:3003/api/auth/public-key`

## 👤 Test Users

- **Admin:**
  - Username: `admin`
  - Password: `admin123`

- **User:**
  - Username: `user`
  - Password: `user123`

## 🔐 JWT Token Details

- **Algorithm:** RS256 (RSA)
- **Access Token Expiry:** 15 phút
- **Refresh Token Expiry:** 7 ngày
- **Key Pair:** Tự động tạo trong `backend/jwt-service/keys/`

## 📝 Notes

- RabbitMQ phải chạy trước khi start Service 1 và Service 2
- RSA keys sẽ được tự động tạo lần đầu chạy JWT service
- Service 2 sẽ tự động consume messages từ queue khi có event mới
- Access token hết hạn sau 15 phút, sử dụng refresh token để lấy token mới

## 🛠️ Technologies

- **Frontend:** React 18, Vite
- **Backend:** Node.js, Express
- **Message Queue:** RabbitMQ (amqplib)
- **JWT:** jsonwebtoken với RSA algorithm
- **HTTP Client:** Axios

## 📚 Tài liệu tham khảo

- [RabbitMQ Documentation](https://www.rabbitmq.com/documentation.html)
- [JWT.io](https://jwt.io/)
- [OAuth 2.0 Resource Server](https://oauth.net/2/)
