
import { IPaymentMethod } from './IPaymentMethod';
import logger from '../lib/logger';

export class PixPayment implements IPaymentMethod {
  async process(paymentDetails: any): Promise<void> {
    logger.info('Processando pagamento via Pix...');

    // Simulação do processamento do Pix
  }
}