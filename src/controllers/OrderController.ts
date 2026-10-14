import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { OrderService } from '../services/OrderService';
import { PrismaOrderRepository } from '../repositories/PrismaOrderRepository';
import { NotificationService } from '../services/NotificationService';
import { EtherealMailProvider } from '../providers/EtherealMailProvider';
import { ProductFactory } from '../domain/ProductFactory';
import { CreditCardPayment } from '../payments/CreditCardPayment';
import { PixPayment } from '../payments/PixPayment';
import { IPaymentMethod } from '../payments/IPaymentMethod';
import logger from '../lib/logger';

const prisma = new PrismaClient();



export class OrderController {
  private orderService = new OrderService(
    new PrismaOrderRepository(),
    new NotificationService(new EtherealMailProvider())
  );
private getPaymentMethod(paymentMethod: string): IPaymentMethod {
    if (paymentMethod === 'credit_card') {
      return new CreditCardPayment();
    }

    if (paymentMethod === 'pix') {
      return new PixPayment();
    }

    throw new Error('Método de pagamento não suportado');
}

  

  // Fábrica / Seletor de método de pagamento (Strategy Pattern)
 
  async processOrder(req: Request, res: Response) {
    try {
      const { customer, items, paymentMethod, paymentDetails } = req.body;

      // 1. Validação básica de entrada
      if (!items || items.length === 0) {
        logger.error('Tentativa de pedido sem itens');
        return res.status(400).json({ error: 'Carrinho vazio' });
      }

      let totalAmount = 0;
      let productsDetails = [];

      // 2. Cálculo de preço e frete usando a ProductFactory e polimorfismo (OCP / LSP)
      for (const item of items) {
        const productData = await prisma.product.findUnique({
          where: { id: item.productId }
        });

        if (!productData) {
          return res.status(400).json({ error: `Produto ${item.productId} não encontrado` });
        }

        const product = ProductFactory.create(productData);
        const freight = product.calculateFreight();

        totalAmount += (product.price * item.quantity) + freight;
        productsDetails.push({ ...productData, quantity: item.quantity });
      }

      // 3. Processamento de Pagamento (OCP respeitado)
      const payment = this.getPaymentMethod(paymentMethod);
      await payment.process(paymentDetails);

      // 4 & 5. Persistência e Notificação delegadas ao OrderService (SRP respeitado)
      const result = await this.orderService.saveOrder(
        customer,
        productsDetails,
        totalAmount
      );

      return res.json({
        message: 'Pedido processado com sucesso',
        orderId: result.order.id,
        emailPreview: result.emailPreview
      });

    /*} catch (error: any) {
      logger.error(`Erro ao processar pedido: ${error.message}`);
      return res.status(500).json({ error: error.message || 'Erro interno' });
    }*/

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