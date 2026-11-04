import { injectable, multiInject } from 'inversify';
import { IPaymentMethod } from './IPaymentMethod';
import { TYPES } from '../container/types';

@injectable()
export class PaymentMethodRegistry {
  constructor(
    @multiInject(TYPES.PaymentMethod)
    private paymentMethods: IPaymentMethod[]
  ) {}

  get(type: string): IPaymentMethod {
    const method = this.paymentMethods.find(
      payment => payment.type === type
    );

    if (!method) {
      throw new Error('Método de pagamento não suportado');
    }

    return method;
  }
}