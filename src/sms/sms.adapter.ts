export interface SmsAdapter {
  sendSms(phone: string, message: string): Promise<any>;
}