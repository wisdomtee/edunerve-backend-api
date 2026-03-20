export interface PaymentGatewayAdapter {
  initializePayment(data: any): Promise<any>;
  verifyPayment(reference: string): Promise<any>;
}