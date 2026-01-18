import express from 'express';
import amqp from 'amqplib';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost:5672';
const QUEUE_NAME = process.env.QUEUE_NAME || 'event_queue';

app.use(cors());
app.use(express.json());

let channel = null;

// Kết nối RabbitMQ
async function connectRabbitMQ() {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    channel = await connection.createChannel();
    
    // Đảm bảo queue tồn tại
    await channel.assertQueue(QUEUE_NAME, {
      durable: true // Queue sẽ tồn tại khi server restart
    });
    
    console.log('✅ Service 1 đã kết nối với RabbitMQ');
  } catch (error) {
    console.error('❌ Lỗi kết nối RabbitMQ:', error);
    setTimeout(connectRabbitMQ, 5000); // Retry sau 5 giây
  }
}

// API endpoint để push event
app.post('/api/events', async (req, res) => {
  try {
    const event = {
      id: Date.now().toString(),
      type: req.body.type || 'default',
      data: req.body.data || {},
      timestamp: new Date().toISOString()
    };

    if (!channel) {
      return res.status(503).json({ 
        error: 'RabbitMQ chưa sẵn sàng. Vui lòng thử lại sau.' 
      });
    }

    // Gửi message vào queue
    const sent = channel.sendToQueue(
      QUEUE_NAME,
      Buffer.from(JSON.stringify(event)),
      {
        persistent: true // Message sẽ được lưu vào disk
      }
    );

    if (sent) {
      console.log(`📤 Đã gửi event: ${JSON.stringify(event)}`);
      res.json({
        success: true,
        message: 'Event đã được gửi thành công',
        event: event
      });
    } else {
      res.status(500).json({ error: 'Không thể gửi event' });
    }
  } catch (error) {
    console.error('❌ Lỗi khi gửi event:', error);
    res.status(500).json({ error: error.message });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'Service 1',
    rabbitmq: channel ? 'connected' : 'disconnected'
  });
});

// Khởi động server
app.listen(PORT, async () => {
  console.log(`🚀 Service 1 đang chạy tại http://localhost:${PORT}`);
  await connectRabbitMQ();
});
