import axios from "axios";

export class TermiiAdapter {
  private apiKey = process.env.TERMII_API_KEY;

  async sendSms(phone: string, message: string) {
    return await axios.post(
      "https://api.ng.termii.com/api/sms/send",
      {
        to: phone,
        from: "EduNerve",
        sms: message,
        type: "plain",
        api_key: this.apiKey,
        channel: "generic"
      }
    );
  }
}