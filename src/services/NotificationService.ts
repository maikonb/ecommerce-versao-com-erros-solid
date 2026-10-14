
import { IMailProvider } from '../providers/IMailProvider';

export class NotificationService {
  constructor(private mailProvider: IMailProvider) {}

  async sendOrderConfirmation(
    customer: string,
    orderId: number,
    totalAmount: number,
    productsDetails: any[]
  ) {
    const message = {
      from: '"DevStore" <noreply@devstore.com>',
      to: customer,
      subject: `Confirmação do Pedido #${orderId}`,
      text: `Olá, seu pedido #${orderId} no valor de R$ ${totalAmount} foi confirmado.`,
      html: `
        <h1>Pedido Confirmado!</h1>
        <p>Olá, seu pedido <b>#${orderId}</b> foi processado com sucesso.</p>
        <p>Total: <strong>R$ ${totalAmount}</strong></p>
        <ul>
          ${productsDetails.map(p => `<li>${p.name}</li>`).join('')}
        </ul>
      `
    };

    return this.mailProvider.sendMail(message);
  }
}
