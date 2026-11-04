
export const TYPES = {
  // Infraestrutura
  MailProvider: Symbol.for('MailProvider'),
  OrderRepository: Symbol.for('OrderRepository'),
  ProductRepository: Symbol.for('ProductRepository'),
  PrismaClient: Symbol.for('PrismaClient'),

  // Pagamentos
  PaymentMethod: Symbol.for('PaymentMethod'),
  PaymentMethodRegistry: Symbol.for('PaymentMethodRegistry'),

  // Serviços
  NotificationService: Symbol.for('NotificationService'),
  OrderService: Symbol.for('OrderService'),

  // Controller
  OrderController: Symbol.for('OrderController')
};
