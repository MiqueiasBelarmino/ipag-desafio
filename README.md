# iPag Desafio — Order Management com RabbitMQ

## Este projeto implementa uma **API REST** para gestão de pedidos e um **Worker** que consome mensagens do **RabbitMQ** para registrar logs de notificações e processar mudanças de status.
### ⚠️ Por ora, devido a questões técnicas (me faltou certa profundidade de conhecimento) na utilização do RabbitMQ e, principalmente, estruturar o projeto para rodar totalmente pelo Docker, o worker não está totalmente desacoplado na solução proposta. Para fazer a atualização na tabela `notification_logs`, ele faz uma interação direta com a API.

### ⚠️ Todas as tecnologias utilizadas e não utilizadas foram conscientes, inclusive a utilização de commonjs ao invés de ESM. A minha ideia é, independentemente do resultado do desafio, fazer propositalmente a migração do projeto para tecnologias de certa forma mais consolidadas e que tragam mais produtividade e segurança na arquitetura do projeto.

## Possíveis mudanças estudadas:

- Utilização de TypeScript
- Substituir Knex por Prisma ORM
  
---

## Tecnologias

- Node.js (Express)
- MySQL 8
- RabbitMQ (amqplib)
  - https://www.npmjs.com/package/amqplib
  - https://www.cloudamqp.com/docs/nodejs.html
  - https://medium.com/@obaff/rabbitmq-and-node-js-tutorial-1ef7c48089b7
- Docker & Docker Compose
- Knex.js (migrations e queries)
  - https://knexjs.org/guide/schema-builder.html
- Zod (validações)
- Logging (winston)
  - https://www.npmjs.com/package/winston
  - https://www.luiztools.com.br/post/logging-de-aplicacoes-node-js-com-winston/
- Testing (Jest)
  - https://jestjs.io/docs/getting-started

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

O `docker-compose.yml` esperado está presente no repositório

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
