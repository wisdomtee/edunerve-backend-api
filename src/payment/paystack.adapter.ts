import axios from "axios";

export class PaystackAdapter {
  private secret = process.env.PAYSTACK_SECRET;

  async initializePayment(data: any) {
    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      data,
      {
        headers: {
          Authorization: `Bearer ${this.secret}`
        }
      }
    );

    return response.data;
  }

  async verifyPayment(reference: string) {
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${this.secret}`
        }
      }
    );

    return response.data;
  }
}