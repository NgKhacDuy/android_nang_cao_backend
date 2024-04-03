import { Module } from '@nestjs/common';
import { ImagekitService } from './imagekit.service';
import { ImagekitController } from './imagekit.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import ImageKit from 'imagekit';

@Module({
  controllers: [ImagekitController],
  providers: [ImagekitService],
  exports: [ImagekitService],
})
export class ImagekitModule {}
