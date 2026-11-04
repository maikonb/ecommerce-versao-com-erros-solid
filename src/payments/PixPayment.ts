import { injectable } from 'inversify';
import { IPaymentMethod } from './IPaymentMethod';
import logger from '../lib/logger';

@injectable()
export class PixPayment implements IPaymentMethod {
  readonly type = 'pix';

  async process(paymentDetails: any): Promise<void> {
    logger.info('Processando pagamento via Pix...');

    // Simulação do processamento do Pix
  }
}