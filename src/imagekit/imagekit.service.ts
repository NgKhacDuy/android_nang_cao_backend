import { Inject, Injectable } from '@nestjs/common';
import ImageKit from 'imagekit';
import { v4 as uuidv4 } from 'uuid';
import { CreateImagekitDto } from './dto/create-imagekit.dto';

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
    var listRes = [];
    this.imagekit = this.createImageKit();
    try {
      for (const base64 of listBase64) {
        const response = await this.imagekit.upload({
          file: Buffer.from(base64, 'base64'), // Convert base64 to Buffer
          fileName: `${uuidv4()}.jpg`, // Generate a unique file name
          extensions: [
            {
              name: 'google-auto-tagging',
              maxTags: 5,
              minConfidence: 95,
            },
          ],
        });
        listRes.push(response.url);
      }
      return listRes;
    } catch (error) {
      console.log(error);
    }
  }
}
