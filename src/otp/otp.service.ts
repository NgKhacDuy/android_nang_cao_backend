import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class OtpService {
  async createOtp(phoneNumber: string, code: string) {
    let data = JSON.stringify({
      apiKey: process.env.OTP_KEY,
      mobile: phoneNumber,
      tpCode: process.env.TP_CODE,
      params: code,
    });

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'http://sms.cloudsms.vn/sendapi/',
      headers: {
        'Content-Type': 'application/json',
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
