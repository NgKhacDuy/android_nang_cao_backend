import { Module } from '@nestjs/common';
import { AgoraService } from './agora.service';
import { AgoraController } from './agora.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Agora } from './entities/agora.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Agora])],
  controllers: [AgoraController],
  providers: [AgoraService],
})
export class AgoraModule {}
