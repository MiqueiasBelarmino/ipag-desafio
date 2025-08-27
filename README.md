# iPag Desafio — Order Management com RabbitMQ

Este projeto implementa uma **API REST** para gestão de pedidos e um **Worker** que consome mensagens do **RabbitMQ** para registrar logs de notificações e processar mudanças de status.

---

## Tecnologias

- Node.js (Express)
- MySQL 8
- RabbitMQ (Management UI)
- Docker & Docker Compose
- Knex.js (migrations e queries)
- Zod (validações)

---

## Estrutura do Projeto

```
ipag-desafio/
  api/ # API REST (Express)
    src/
      controllers/
      database/
      publishers/
      repositories/
      routes/
      services/
      utils/
      index.js
    package.json
    Dockerfile

  worker/ # Worker (RabbitMQ consumer)
    src/
      consumers/
    package.json
    Dockerfile

  docker-compose.yml
  README.md
  .env                         # variáveis de ambiente
```

---

## Variáveis de Ambiente (`.env`)

Crie um arquivo `.env` na raiz com algo como:

```
PORT=3000
DB_HOST=db
DB_USER=ipag
DB_PASSWORD=ipag123
DB_NAME=ipagdb
DB_PORT=3306
API_URL=http://api:3000/api

# RabbitMQ
RABBITMQ_URL=amqp://admin:admin123@rabbitmq:5672
DEFAULT_ORDER_QUEUE=order_status_updates
```

> Observação: dentro dos containers, use os **nomes dos serviços** do docker-compose (`db`, `rabbitmq`) como hosts.

---

## Docker Compose

O `docker-compose.yml` esperado (ajuste se já possuir o seu):

```yaml
services:
  api:
    build: 
      context: ./api
      dockerfile: Dockerfile
    container_name: ipag_api
    restart: always
    ports:
      - "3000:3000"
    env_file:
      - .env
    depends_on:
      db:
        condition: service_started
      rabbitmq:
        condition: service_healthy
    networks:
      - intranet

  worker:
    build: ./worker
    container_name: ipag_worker
    depends_on:
      rabbitmq:
        condition: service_healthy
      api:
        condition: service_started
    environment:
      RABBITMQ_URL: amqp://ipag:ipag123@rabbitmq:5672
      QUEUE_NAME: order_status_updates
      API_URL: http://api:3000/api
    networks:
      - intranet

  db:
    image: mysql:8.0
    container_name: ipag_db
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: ipagdb
      MYSQL_USER: ipag
      MYSQL_PASSWORD: ipag123
    ports:
      - "3307:3306"
    volumes:
      - db_data:/var/lib/mysql
    networks:
      - intranet

  rabbitmq:
    image: rabbitmq:3-management
    container_name: ipag_rabbitmq
    restart: always
    ports:
      - "5672:5672"
      - "15672:15672"
    environment:
      RABBITMQ_DEFAULT_USER: ipag
      RABBITMQ_DEFAULT_PASS: ipag123
    volumes:
      - rabbitmq_data:/var/lib/rabbitmq
    networks:
      - intranet
    healthcheck:
      test: ["CMD", "rabbitmq-diagnostics", "status"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 10s

volumes:
  db_data:
  rabbitmq_data:

networks:
  intranet:
    driver: bridge

```

---

## ▶️ Como Rodar

1. Clone o repositório e entre na pasta:
   ```bash
   git clone https://github.com/MiqueiasBelarmino/ipag-desafio.git
   cd ipag-desafio
   ```

2. Crie o `.env` conforme instruções.

3. Suba os containers:
   ```bash
   docker-compose up --build
   ```

4. Execute as migrations (dentro do container `api`):
   ```bash
   docker compose exec api npm run migrate
   ```

5. Acesse:
   - API: [http://localhost:3000](http://localhost:3000)
   - RabbitMQ UI: [http://localhost:15672](http://localhost:15672) (user: `ipag`, pass: `ipag123`)

---

## Endpoints Principais

### Orders
- `POST /orders` → Cria pedido
- `PATCH /orders/:id/status` → Atualiza status + envia msg RabbitMQ
- `GET /orders/summary` → Retorna resumo estatístico

### Notification Logs
- `GET /notification-logs` → Lista logs de notificações
- `GET /notification-logs/:id` → Detalhe de um log
- `GET /notification-logs/:id/order` → Lista logs de uma order específica

---

## Próximos Passos

- Adicionar testes unitários
- Criar documentação Swagger/OpenAPI
- Adicionar autenticação/autorização (JWT, RBAC)
- Monitoramento (Prometheus/Grafana)
