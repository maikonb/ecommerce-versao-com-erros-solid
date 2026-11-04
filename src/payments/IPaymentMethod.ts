export interface IPaymentMethod {
  readonly type: string;

  process(paymentDetails: any): Promise<void>;
}