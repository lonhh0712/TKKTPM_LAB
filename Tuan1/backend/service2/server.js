import express from 'express';
import amqp from 'amqplib';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;
const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost:5672';
const QUEUE_NAME = process.env.QUEUE_NAME || 'event_queue';

app.use(cors());
app.use(express.json());

let channel = null;

// Kết nối RabbitMQ và bắt đầu lắng nghe
async function connectRabbitMQ() {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    channel = await connection.createChannel();
    
    // Đảm bảo queue tồn tại
    await channel.assertQueue(QUEUE_NAME, {
      durable: true
    });
    
    // Chỉ nhận 1 message tại một thời điểm (fair dispatch)
    channel.prefetch(1);
    
    console.log('✅ Service 2 đã kết nối với RabbitMQ');
    console.log(`👂 Đang chờ nhận events từ queue: ${QUEUE_NAME}`);
    
    // Bắt đầu consume messages
    channel.consume(QUEUE_NAME, async (msg) => {
      if (msg) {
        try {
          const event = JSON.parse(msg.content.toString());
          console.log(`📥 Nhận được event: ${JSON.stringify(event)}`);
          
          // Xử lý event
          await processEvent(event);
          
          // Acknowledge message sau khi xử lý thành công
          channel.ack(msg);
          console.log(`✅ Đã xử lý event thành công: ${event.id}`);
        } catch (error) {
          console.error('❌ Lỗi khi xử lý event:', error);
          // Nack message để gửi lại vào queue
          channel.nack(msg, false, true);
        }
      }
    }, {
      noAck: false // Cần acknowledge message
    });
    
  } catch (error) {
    console.error('❌ Lỗi kết nối RabbitMQ:', error);
    setTimeout(connectRabbitMQ, 5000); // Retry sau 5 giây
  }
}

// Hàm xử lý event
async function processEvent(event) {
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  console.log(`🔄 Đang xử lý event type: ${event.type}`);
  console.log(`📊 Event data:`, event.data);
  
  // Ở đây bạn có thể thêm logic xử lý event cụ thể
  // Ví dụ: lưu vào database, gửi email, cập nhật cache, etc.
  
  return { success: true, processedAt: new Date().toISOString() };
}

// API endpoint để xem trạng thái
app.get('/api/status', (req, res) => {
  res.json({
    service: 'Service 2',
    status: 'running',
    queue: QUEUE_NAME,
    rabbitmq: channel ? 'connected' : 'disconnected'
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'Service 2',
    rabbitmq: channel ? 'connected' : 'disconnected'
  });
});

// Khởi động server
app.listen(PORT, async () => {
  console.log(`🚀 Service 2 đang chạy tại http://localhost:${PORT}`);
  await connectRabbitMQ();
});
