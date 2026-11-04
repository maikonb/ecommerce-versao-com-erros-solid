import { injectable } from 'inversify';
import { IPaymentMethod } from './IPaymentMethod';
import logger from '../lib/logger';

@injectable()
export class DebitCardPayment implements IPaymentMethod {
  readonly type = 'debit_card';

  async process(paymentDetails: any): Promise<void> {
    logger.info(
      `Processando cartão de débito final ${paymentDetails.cardNumber.slice(-4)}`
    );

    if (paymentDetails.cvv === '000') {
      throw new Error('Cartão de débito recusado');
    }
  }
}