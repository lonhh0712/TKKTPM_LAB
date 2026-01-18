import express from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3003;

app.use(cors());
app.use(express.json());

// Tạo RSA key pair nếu chưa có
const keysDir = path.join(__dirname, 'keys');
if (!fs.existsSync(keysDir)) {
  fs.mkdirSync(keysDir, { recursive: true });
}

let privateKey, publicKey;

// Tạo hoặc load RSA keys
function initializeKeys() {
  const privateKeyPath = path.join(keysDir, 'private.pem');
  const publicKeyPath = path.join(keysDir, 'public.pem');

  if (fs.existsSync(privateKeyPath) && fs.existsSync(publicKeyPath)) {
    // Load existing keys
    privateKey = fs.readFileSync(privateKeyPath, 'utf8');
    publicKey = fs.readFileSync(publicKeyPath, 'utf8');
    console.log('✅ Đã load RSA keys từ file');
  } else {
    // Generate new keys
    const { publicKey: pubKey, privateKey: privKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem'
      }
    });

    privateKey = privKey;
    publicKey = pubKey;

    fs.writeFileSync(privateKeyPath, privateKey);
    fs.writeFileSync(publicKeyPath, publicKey);
    console.log('✅ Đã tạo RSA key pair mới');
  }
}

initializeKeys();

// Access token expires in 15 minutes
const ACCESS_TOKEN_EXPIRY = '15m';
// Refresh token expires in 7 days
const REFRESH_TOKEN_EXPIRY = '7d';

// In-memory store cho refresh tokens (trong production nên dùng database)
const refreshTokens = new Map();

// Mock user database (trong production nên dùng database thật)
const users = [
  { id: 1, username: 'admin', password: 'admin123', role: 'admin' },
  { id: 2, username: 'user', password: 'user123', role: 'user' }
];

// API: Login và tạo tokens
app.post('/api/auth/login', (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username và password là bắt buộc' });
    }

    // Tìm user
    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
      return res.status(401).json({ error: 'Username hoặc password không đúng' });
    }

    // Tạo payload cho tokens
    const payload = {
      userId: user.id,
      username: user.username,
      role: user.role
    };

    // Tạo Access Token (short-lived)
    const accessToken = jwt.sign(payload, privateKey, {
      algorithm: 'RS256',
      expiresIn: ACCESS_TOKEN_EXPIRY
    });

    // Tạo Refresh Token (long-lived)
    const refreshToken = jwt.sign({ userId: user.id }, privateKey, {
      algorithm: 'RS256',
      expiresIn: REFRESH_TOKEN_EXPIRY
    });

    // Lưu refresh token
    refreshTokens.set(refreshToken, {
      userId: user.id,
      createdAt: new Date()
    });

    console.log(`✅ User ${username} đã đăng nhập thành công`);

    res.json({
      success: true,
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    console.error('❌ Lỗi khi login:', error);
    res.status(500).json({ error: error.message });
  }
});

// API: Refresh access token
app.post('/api/auth/refresh', (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token là bắt buộc' });
    }

    // Kiểm tra refresh token có tồn tại không
    if (!refreshTokens.has(refreshToken)) {
      return res.status(401).json({ error: 'Refresh token không hợp lệ' });
    }

    // Verify refresh token
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, publicKey, { algorithm: 'RS256' });
    } catch (error) {
      refreshTokens.delete(refreshToken);
      return res.status(401).json({ error: 'Refresh token đã hết hạn hoặc không hợp lệ' });
    }

    // Tìm user
    const user = users.find(u => u.id === decoded.userId);
    if (!user) {
      return res.status(401).json({ error: 'User không tồn tại' });
    }

    // Tạo access token mới
    const payload = {
      userId: user.id,
      username: user.username,
      role: user.role
    };

    const accessToken = jwt.sign(payload, privateKey, {
      algorithm: 'RS256',
      expiresIn: ACCESS_TOKEN_EXPIRY
    });

    console.log(`✅ Đã refresh access token cho user ${user.username}`);

    res.json({
      success: true,
      accessToken
    });
  } catch (error) {
    console.error('❌ Lỗi khi refresh token:', error);
    res.status(500).json({ error: error.message });
  }
});

// API: Verify token (Resource Server endpoint)
app.get('/api/auth/verify', (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Không có token hoặc format không đúng' });
    }

    const token = authHeader.substring(7); // Remove "Bearer " prefix

    // Verify token với public key
    const decoded = jwt.verify(token, publicKey, { algorithm: 'RS256' });

    res.json({
      valid: true,
      user: {
        userId: decoded.userId,
        username: decoded.username,
        role: decoded.role
      },
      expiresAt: new Date(decoded.exp * 1000).toISOString()
    });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        valid: false, 
        error: 'Token đã hết hạn',
        expiredAt: error.expiredAt
      });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        valid: false, 
        error: 'Token không hợp lệ' 
      });
    } else {
      return res.status(500).json({ 
        valid: false, 
        error: error.message 
      });
    }
  }
});

// API: Logout (revoke refresh token)
app.post('/api/auth/logout', (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (refreshToken && refreshTokens.has(refreshToken)) {
      refreshTokens.delete(refreshToken);
      console.log('✅ Đã revoke refresh token');
    }

    res.json({ success: true, message: 'Đăng xuất thành công' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API: Lấy public key (để verify token ở resource server)
app.get('/api/auth/public-key', (req, res) => {
  res.json({
    publicKey: publicKey,
    algorithm: 'RS256'
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'JWT Service',
    algorithm: 'RS256'
  });
});

// Khởi động server
app.listen(PORT, () => {
  console.log(`🚀 JWT Service đang chạy tại http://localhost:${PORT}`);
  console.log(`📝 API Endpoints:`);
  console.log(`   POST /api/auth/login - Đăng nhập và lấy tokens`);
  console.log(`   POST /api/auth/refresh - Refresh access token`);
  console.log(`   GET  /api/auth/verify - Verify token (Resource Server)`);
  console.log(`   POST /api/auth/logout - Đăng xuất`);
  console.log(`   GET  /api/auth/public-key - Lấy public key`);
});
