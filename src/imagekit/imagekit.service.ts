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
}
