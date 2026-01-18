import { useState } from 'react'
import axios from 'axios'
import './RabbitMQPanel.css'

const SERVICE1_URL = 'http://localhost:3001/api'
const SERVICE2_URL = 'http://localhost:3002/api'

function RabbitMQPanel() {
  const [eventType, setEventType] = useState('user_action')
  const [eventData, setEventData] = useState('{"message": "Hello from Service 1"}')
  const [logs, setLogs] = useState([])
  const [service1Status, setService1Status] = useState(null)
  const [service2Status, setService2Status] = useState(null)

  const addLog = (message, type = 'info') => {
    setLogs(prev => [...prev, {
      id: Date.now(),
      message,
      type,
      timestamp: new Date().toLocaleTimeString()
    }])
  }

  const checkService1Health = async () => {
    try {
      const response = await axios.get(`${SERVICE1_URL.replace('/api', '')}/health`)
      setService1Status(response.data)
      addLog('✅ Service 1 đang hoạt động', 'success')
    } catch (error) {
      addLog('❌ Service 1 không khả dụng', 'error')
      setService1Status(null)
    }
  }

  const checkService2Health = async () => {
    try {
      const response = await axios.get(`${SERVICE2_URL.replace('/api', '')}/health`)
      setService2Status(response.data)
      addLog('✅ Service 2 đang hoạt động', 'success')
    } catch (error) {
      addLog('❌ Service 2 không khả dụng', 'error')
      setService2Status(null)
    }
  }

  const sendEvent = async () => {
    try {
      let parsedData = {}
      try {
        parsedData = JSON.parse(eventData)
      } catch (e) {
        addLog('❌ Event data không phải JSON hợp lệ', 'error')
        return
      }

      addLog(`📤 Đang gửi event: ${eventType}...`, 'info')
      
      const response = await axios.post(`${SERVICE1_URL}/events`, {
        type: eventType,
        data: parsedData
      })

      addLog(`✅ ${response.data.message}`, 'success')
      addLog(`📋 Event ID: ${response.data.event.id}`, 'info')
    } catch (error) {
      addLog(`❌ Lỗi: ${error.response?.data?.error || error.message}`, 'error')
    }
  }

  return (
    <div className="rabbitmq-panel">
      <div className="section">
        <h2>📨 Message Queue với RabbitMQ</h2>
        <p className="description">
          Service 1 sẽ push events vào RabbitMQ, Service 2 sẽ nhận và xử lý events.
        </p>
      </div>

      <div className="section">
        <h3>🔍 Kiểm tra trạng thái Services</h3>
        <div className="status-buttons">
          <button onClick={checkService1Health} className="btn btn-primary">
            Check Service 1
          </button>
          <button onClick={checkService2Health} className="btn btn-primary">
            Check Service 2
          </button>
        </div>
        
        <div className="status-display">
          {service1Status && (
            <div className="status-item">
              <strong>Service 1:</strong> {service1Status.status} 
              {service1Status.rabbitmq && ` | RabbitMQ: ${service1Status.rabbitmq}`}
            </div>
          )}
          {service2Status && (
            <div className="status-item">
              <strong>Service 2:</strong> {service2Status.status}
              {service2Status.rabbitmq && ` | RabbitMQ: ${service2Status.rabbitmq}`}
            </div>
          )}
        </div>
      </div>

      <div className="section">
        <h3>📤 Gửi Event (Service 1)</h3>
        <div className="form-group">
          <label>Event Type:</label>
          <input
            type="text"
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
            placeholder="user_action, order_created, etc."
          />
        </div>
        
        <div className="form-group">
          <label>Event Data (JSON):</label>
          <textarea
            value={eventData}
            onChange={(e) => setEventData(e.target.value)}
            rows="4"
            placeholder='{"key": "value"}'
          />
        </div>
        
        <button onClick={sendEvent} className="btn btn-success">
          🚀 Gửi Event
        </button>
      </div>

      <div className="section">
        <h3>📋 Logs</h3>
        <div className="logs-container">
          {logs.length === 0 ? (
            <p className="no-logs">Chưa có logs...</p>
          ) : (
            logs.map(log => (
              <div key={log.id} className={`log-item log-${log.type}`}>
                <span className="log-time">[{log.timestamp}]</span>
                <span className="log-message">{log.message}</span>
              </div>
            ))
          )}
        </div>
        {logs.length > 0 && (
          <button 
            onClick={() => setLogs([])} 
            className="btn btn-secondary"
            style={{ marginTop: '10px' }}
          >
            Clear Logs
          </button>
        )}
      </div>

      <div className="section api-info">
        <h3>📡 API Endpoints cho Postman</h3>
        <div className="endpoint-list">
          <div className="endpoint">
            <strong>POST</strong> <code>http://localhost:3001/api/events</code>
            <p>Gửi event vào RabbitMQ queue</p>
            <pre>{`Body (JSON):
{
  "type": "user_action",
  "data": {
    "message": "Hello"
  }
}`}</pre>
          </div>
          
          <div className="endpoint">
            <strong>GET</strong> <code>http://localhost:3001/health</code>
            <p>Kiểm tra trạng thái Service 1</p>
          </div>
          
          <div className="endpoint">
            <strong>GET</strong> <code>http://localhost:3002/api/status</code>
            <p>Kiểm tra trạng thái Service 2</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RabbitMQPanel
