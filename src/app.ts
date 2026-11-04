
import express from 'express';
import { container } from './container/container';
import { TYPES } from './container/types';
import { OrderController } from './controllers/OrderController';

const app = express();

app.use(express.json());

// Obtém o OrderController através do Inversify
const orderController = container.get<OrderController>(
  TYPES.OrderController
);

// Registra a rota de pedidos
app.post('/orders', (req, res) => {
  orderController.processOrder(req, res);
});

export default app;
