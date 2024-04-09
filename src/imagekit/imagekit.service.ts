import { Inject, Injectable } from '@nestjs/common';
import ImageKit from 'imagekit';
import { v4 as uuidv4 } from 'uuid';
import { CreateImagekitDto } from './dto/create-imagekit.dto';
import axios from 'axios';

@Injectable()
export class ImagekitService {
  private imagekit: ImageKit = null;
  constructor() {}

  createImageKit() {
    if (this.imagekit == null) {
      this.imagekit = new ImageKit({
        publicKey: process.env.PUBLIC_KEY_IMAGE_KIT,
        privateKey: process.env.PRIVATE_KEY_IMAGE_KIT,
        urlEndpoint: process.env.URL_ENDPOINT_IMAGE_KIT,
      });
    }
    return this.imagekit;
  }

  async upload(listBase64: string[]) {
    this.imagekit = this.createImageKit();
    const tasks = listBase64.map((base64) => {
      const fileName = `${uuidv4()}.jpg`;
      return this.imagekit.upload({
        file: Buffer.from(base64, 'base64'),
        fileName,
        extensions: [
          {
            name: 'google-auto-tagging',
            maxTags: 5,
            minConfidence: 95,
          },
        ],
      });
    });
    const responses = await Promise.all(tasks);
    return responses.map((response) => response.url);
  }

  async createNotification(title: string, content: string, listUser: string[]) {
    try {
      let data = JSON.stringify({
        app_id: process.env.ONESIGNAL_APP_ID,
        include_subscription_ids: listUser,
        contents: {
          en: `${content}`,
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
        .then((response) => {})
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log('noti sent failed');
      console.log(error);
    }
  }
}
