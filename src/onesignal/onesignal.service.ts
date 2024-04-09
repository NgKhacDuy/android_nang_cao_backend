import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class OnesignalService {
  async createNotification(
    title: string,
    content: string,
    listUser: string[],
    type: string,
    dataType: string,
  ) {
    try {
      let data = JSON.stringify({
        app_id: process.env.ONESIGNAL_APP_ID,
        include_subscription_ids: listUser,
        contents: {
          en: `${content}`,
        },
        data: {
          type: `${type}`,
          data: `${dataType}`,
        },
        headings: { en: `${title}` },
      });

      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://onesignal.com/api/v1/notifications',
        headers: {
          Authorization: `Basic ${process.env.ONESIGNAL_REST_API_KEY}`,
          accept: 'application/json',
          'content-type': 'application/json',
        },
        data: data,
      };

      axios
        .request(config)
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log('noti sent failed');
      console.log(error);
    }
  }
}
