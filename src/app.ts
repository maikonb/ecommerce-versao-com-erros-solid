
import express from 'express';
import { OrderController } from './controllers/OrderController';

const app = express();
app.use(express.json());

const orderController = new OrderController();

app.post('/orders', (req, res) =>
  orderController.processOrder(req, res)
);

export default app;
