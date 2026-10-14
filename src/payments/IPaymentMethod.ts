
export interface IPaymentMethod {
  process(paymentDetails: any): Promise<void>;
}
