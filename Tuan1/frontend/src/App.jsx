import { useState } from 'react'
import './App.css'
import RabbitMQPanel from './components/RabbitMQPanel'
import JWTPanel from './components/JWTPanel'

function App() {
  const [activeTab, setActiveTab] = useState('rabbitmq')

  return (
    <div className="app">
      <header className="app-header">
        <h1>🚀 Lap Tuan Project</h1>
        <p>RabbitMQ Message Queue & JWT Authentication</p>
      </header>

      <nav className="tabs">
        <button
          className={activeTab === 'rabbitmq' ? 'active' : ''}
          onClick={() => setActiveTab('rabbitmq')}
        >
          📨 Message Queue (RabbitMQ)
        </button>
        <button
          className={activeTab === 'jwt' ? 'active' : ''}
          onClick={() => setActiveTab('jwt')}
        >
          🔐 JWT Authentication
        </button>
      </nav>

      <main className="main-content">
        {activeTab === 'rabbitmq' && <RabbitMQPanel />}
        {activeTab === 'jwt' && <JWTPanel />}
      </main>

      <footer className="app-footer">
        <p>💡 Sử dụng Postman để test các API endpoints</p>
      </footer>
    </div>
  )
}

export default App
