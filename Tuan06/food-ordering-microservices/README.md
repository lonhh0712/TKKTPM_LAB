# Food Ordering Microservices

Microservices architecture for online food ordering with:

- API Gateway
- User Service
- Order Service
- Payment Service
- RabbitMQ for event-driven communication
- PostgreSQL database per service

Each service also follows service-based internal layering:

- routes
- controllers
- services
- repositories

## Run locally

1. Open this folder.
2. Start all services:

```bash
docker compose up --build -d
```

Each app service is built from its own Dockerfile:

- `api-gateway/Dockerfile`
- `services/user-service/Dockerfile`
- `services/order-service/Dockerfile`
- `services/payment-service/Dockerfile`

3. Check health:

- Gateway: `GET http://localhost:8080/health`
- User Service: `GET http://localhost:3001/health`
- Order Service: `GET http://localhost:3002/health`
- Payment Service: `GET http://localhost:3003/health`

## Main API via Gateway

- `POST /api/users/register`
- `POST /api/users/login`
- `GET /api/users/:id`
- `POST /api/orders`
- `GET /api/orders/:id`
- `GET /api/orders?userId=<id>`
- `POST /api/payments`

## Event flow

- Order Service creates order with `PENDING` status.
- Order Service calls Payment Service (sync REST).
- Payment Service processes payment and publishes `PaymentCompleted`.
- Order Service subscribes `payment.completed` queue and updates order to `PAID`.

See [docs/architecture.md](docs/architecture.md) for details.

## Service-based structure (inside each service)

- user-service/src/config|routes|controllers|services|repositories
- order-service/src/config|routes|controllers|services|repositories
- payment-service/src/config|routes|controllers|services|repositories
