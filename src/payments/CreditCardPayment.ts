import { injectable } from 'inversify';
import { IPaymentMethod } from './IPaymentMethod';
import logger from '../lib/logger';

@injectable()
export class CreditCardPayment implements IPaymentMethod {
  readonly type = 'credit_card';
  async process(paymentDetails: any): Promise<void> {
    logger.info(
      `Processando cartão final ${paymentDetails.cardNumber.slice(-4)}`
    );

    if (paymentDetails.cvv === '000') {
      throw new Error('Cartão recusado');
    }
  }
}