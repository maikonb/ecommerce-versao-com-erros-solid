
import { Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { OrderService } from '../services/OrderService';
import { TYPES } from '../container/types';
import logger from '../lib/logger';

@injectable()
export class OrderController {
  constructor(
    @inject(TYPES.OrderService)
    private orderService: OrderService
  ) {}

  async processOrder(req: Request, res: Response) {
    try {
      const {
        customer,
        items,
        paymentMethod,
        paymentDetails
      } = req.body;

      if (!items || items.length === 0) {
        logger.error('Tentativa de pedido sem itens');

        return res.status(400).json({
          error: 'Carrinho vazio'
        });
      }

      const result = await this.orderService.processOrder(
        customer,
        items,
        paymentMethod,
        paymentDetails
      );

      return res.json({
        message: 'Pedido processado com sucesso',
        orderId: result.order.id,
        emailPreview: result.emailPreview
      });

    } catch (error: unknown) {
      logger.error('Erro ao processar pedido:', error);

      return res.status(500).json({
        error: error instanceof Error
          ? error.message
          : 'Erro desconhecido'
      });
    }
  }
}
