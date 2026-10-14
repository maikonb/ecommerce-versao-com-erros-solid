
import { IPaymentMethod } from './IPaymentMethod';
import logger from '../lib/logger';

export class CreditCardPayment implements IPaymentMethod {
  async process(paymentDetails: any): Promise<void> {
    logger.info(
      `Processando cartão final ${paymentDetails.cardNumber.slice(-4)}`
    );

    if (paymentDetails.cvv === '000') {
      throw new Error('Cartão recusado');
    }
  }
}