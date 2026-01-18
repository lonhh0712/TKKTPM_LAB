import { useState } from 'react'
import axios from 'axios'
import './JWTPanel.css'

const JWT_SERVICE_URL = 'http://localhost:3003/api'

function JWTPanel() {
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('admin123')
  const [accessToken, setAccessToken] = useState('')
  const [refreshToken, setRefreshToken] = useState('')
  const [verifyResult, setVerifyResult] = useState(null)
  const [publicKey, setPublicKey] = useState('')

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${JWT_SERVICE_URL}/auth/login`, {
        username,
        password
      })

      setAccessToken(response.data.accessToken)
      setRefreshToken(response.data.refreshToken)
      setVerifyResult({
        success: true,
        message: 'Đăng nhập thành công!',
        user: response.data.user
      })
    } catch (error) {
      setVerifyResult({
        success: false,
        message: error.response?.data?.error || error.message
      })
    }
  }

  const handleRefresh = async () => {
    if (!refreshToken) {
      setVerifyResult({
        success: false,
        message: 'Chưa có refresh token. Vui lòng đăng nhập trước.'
      })
      return
    }

    try {
      const response = await axios.post(`${JWT_SERVICE_URL}/auth/refresh`, {
        refreshToken
      })

      setAccessToken(response.data.accessToken)
      setVerifyResult({
        success: true,
        message: 'Đã refresh access token thành công!'
      })
    } catch (error) {
      setVerifyResult({
        success: false,
        message: error.response?.data?.error || error.message
      })
    }
  }

  const handleVerify = async () => {
    if (!accessToken) {
      setVerifyResult({
        success: false,
        message: 'Chưa có access token. Vui lòng đăng nhập trước.'
      })
      return
    }

    try {
      const response = await axios.get(`${JWT_SERVICE_URL}/auth/verify`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      setVerifyResult({
        success: true,
        message: 'Token hợp lệ!',
        data: response.data
      })
    } catch (error) {
      setVerifyResult({
        success: false,
        message: error.response?.data?.error || error.message,
        data: error.response?.data
      })
    }
  }

  const handleGetPublicKey = async () => {
    try {
      const response = await axios.get(`${JWT_SERVICE_URL}/auth/public-key`)
      setPublicKey(response.data.publicKey)
    } catch (error) {
      setVerifyResult({
        success: false,
        message: error.response?.data?.error || error.message
      })
    }
  }

  const handleLogout = async () => {
    if (!refreshToken) {
      setAccessToken('')
      setRefreshToken('')
      setVerifyResult(null)
      return
    }

    try {
      await axios.post(`${JWT_SERVICE_URL}/auth/logout`, {
        refreshToken
      })
      setAccessToken('')
      setRefreshToken('')
      setVerifyResult({
        success: true,
        message: 'Đăng xuất thành công!'
      })
    } catch (error) {
      setVerifyResult({
        success: false,
        message: error.response?.data?.error || error.message
      })
    }
  }

  return (
    <div className="jwt-panel">
      <div className="section">
        <h2>🔐 JWT Authentication</h2>
        <p className="description">
          Hệ thống JWT với Access Token (15 phút) và Refresh Token (7 ngày) sử dụng thuật toán RSA.
        </p>
      </div>

      <div className="section">
        <h3>🔑 Đăng nhập</h3>
        <div className="form-group">
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="admin hoặc user"
          />
        </div>
        
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="admin123 hoặc user123"
          />
        </div>
        
        <div className="button-group">
          <button onClick={handleLogin} className="btn btn-success">
            🚀 Đăng nhập
          </button>
          <button onClick={handleLogout} className="btn btn-secondary">
            🚪 Đăng xuất
          </button>
        </div>
      </div>

      <div className="section">
        <h3>📝 Tokens</h3>
        <div className="form-group">
          <label>Access Token:</label>
          <textarea
            value={accessToken || 'Chưa có token. Vui lòng đăng nhập.'}
            readOnly
            rows="3"
            className="token-display"
          />
        </div>
        
        <div className="form-group">
          <label>Refresh Token:</label>
          <textarea
            value={refreshToken || 'Chưa có token. Vui lòng đăng nhập.'}
            readOnly
            rows="3"
            className="token-display"
          />
        </div>
      </div>

      <div className="section">
        <h3>🛠️ Token Operations</h3>
        <div className="button-group">
          <button onClick={handleRefresh} className="btn btn-primary">
            🔄 Refresh Access Token
          </button>
          <button onClick={handleVerify} className="btn btn-primary">
            ✅ Verify Token
          </button>
          <button onClick={handleGetPublicKey} className="btn btn-info">
            🔓 Lấy Public Key
          </button>
        </div>
      </div>

      {verifyResult && (
        <div className={`section result-section ${verifyResult.success ? 'success' : 'error'}`}>
          <h3>{verifyResult.success ? '✅ Kết quả' : '❌ Lỗi'}</h3>
          <p>{verifyResult.message}</p>
          {verifyResult.data && (
            <pre className="result-data">
              {JSON.stringify(verifyResult.data, null, 2)}
            </pre>
          )}
        </div>
      )}

      {publicKey && (
        <div className="section">
          <h3>🔓 Public Key (RSA)</h3>
          <textarea
            value={publicKey}
            readOnly
            rows="10"
            className="token-display"
          />
        </div>
      )}

      <div className="section api-info">
        <h3>📡 API Endpoints cho Postman</h3>
        <div className="endpoint-list">
          <div className="endpoint">
            <strong>POST</strong> <code>http://localhost:3003/api/auth/login</code>
            <p>Đăng nhập và lấy access token + refresh token</p>
            <pre>{`Body (JSON):
{
  "username": "admin",
  "password": "admin123"
}`}</pre>
          </div>
          
          <div className="endpoint">
            <strong>POST</strong> <code>http://localhost:3003/api/auth/refresh</code>
            <p>Refresh access token bằng refresh token</p>
            <pre>{`Body (JSON):
{
  "refreshToken": "your_refresh_token_here"
}`}</pre>
          </div>
          
          <div className="endpoint">
            <strong>GET</strong> <code>http://localhost:3003/api/auth/verify</code>
            <p>Verify access token (Resource Server endpoint)</p>
            <p><strong>Header:</strong> <code>Authorization: Bearer {access_token}</code></p>
          </div>
          
          <div className="endpoint">
            <strong>POST</strong> <code>http://localhost:3003/api/auth/logout</code>
            <p>Đăng xuất và revoke refresh token</p>
            <pre>{`Body (JSON):
{
  "refreshToken": "your_refresh_token_here"
}`}</pre>
          </div>
          
          <div className="endpoint">
            <strong>GET</strong> <code>http://localhost:3003/api/auth/public-key</code>
            <p>Lấy public key để verify token</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default JWTPanel
