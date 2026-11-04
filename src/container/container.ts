
import { Container } from 'inversify';
import { PrismaClient } from '@prisma/client';

// Tipos
import { TYPES } from './types';

// Repositórios
import { PrismaOrderRepository } from '../repositories/PrismaOrderRepository';
import { InMemoryOrderRepository } from '../repositories/InMemoryOrderRepository';
import { PrismaProductRepository } from '../repositories/PrismaProductRepository';
import { InMemoryProductRepository } from '../repositories/InMemoryProductRepository';

// Provedores de e-mail
import { EtherealMailProvider } from '../providers/EtherealMailProvider';
import { ConsoleMailProvider } from '../providers/ConsoleMailProvider';

// Métodos de pagamento
import { CreditCardPayment } from '../payments/CreditCardPayment';
import { DebitCardPayment } from '../payments/DebitCardPayment';
import { PixPayment } from '../payments/PixPayment';
import { IPaymentMethod } from '../payments/IPaymentMethod';
import { PaymentMethodRegistry } from '../payments/PaymentMethodRegistry';

// Serviços e controller
import { NotificationService } from '../services/NotificationService';
import { OrderService } from '../services/OrderService';
import { OrderController } from '../controllers/OrderController';

const container = new Container();

const appEnv = process.env.APP_ENV || 'dev';

// Configuração do ambiente de desenvolvimento
if (appEnv === 'dev') {
  container.bind(TYPES.PrismaClient)
    .toConstantValue(new PrismaClient());

  container.bind(TYPES.OrderRepository)
    .to(PrismaOrderRepository)
    .inSingletonScope();

  container.bind(TYPES.ProductRepository)
    .to(PrismaProductRepository)
    .inSingletonScope();

  container.bind(TYPES.MailProvider)
    .to(EtherealMailProvider)
    .inSingletonScope();
}

// Configuração do ambiente de testes
else if (appEnv === 'test') {
  container.bind(TYPES.OrderRepository)
    .to(InMemoryOrderRepository)
    .inSingletonScope();

  container.bind(TYPES.ProductRepository)
    .to(InMemoryProductRepository)
    .inSingletonScope();

  container.bind(TYPES.MailProvider)
    .to(ConsoleMailProvider)
    .inSingletonScope();
}

else {
  throw new Error(`Ambiente inválido: ${appEnv}`);
}

// Registro dos métodos de pagamento
container.bind<IPaymentMethod>(TYPES.PaymentMethod)
  .to(CreditCardPayment)
  .inSingletonScope();

container.bind<IPaymentMethod>(TYPES.PaymentMethod)
  .to(DebitCardPayment)
  .inSingletonScope();

container.bind<IPaymentMethod>(TYPES.PaymentMethod)
  .to(PixPayment)
  .inSingletonScope();

// Registro das demais dependências
container.bind(TYPES.PaymentMethodRegistry)
  .to(PaymentMethodRegistry)
  .inSingletonScope();

container.bind(TYPES.NotificationService)
  .to(NotificationService)
  .inSingletonScope();

container.bind(TYPES.OrderService)
  .to(OrderService)
  .inSingletonScope();

container.bind(TYPES.OrderController)
  .to(OrderController)
  .inSingletonScope();

export { container };
