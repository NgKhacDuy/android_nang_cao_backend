import { Module } from '@nestjs/common';
import { RecipientDetailService } from './recipient-detail.service';
import { RecipientDetailController } from './recipient-detail.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecipientDetail } from './entities/recipient-detail.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RecipientDetail])],
  controllers: [RecipientDetailController],
  providers: [RecipientDetailService],
  exports: [RecipientDetailService],
})
export class RecipientDetailModule {}
