import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from 'db/data-source';
import { UserModule } from './user/user.module';
import { CurrentUserMiddleware } from './utilities/middlewares/current-user.middlewares';
import { FriendModule } from './friend/friend.module';
import { StatusModule } from './status/status.module';
import { ChatModule } from './chat/chat.module';
import { ScheduleModule } from '@nestjs/schedule';
import { AppService } from './app.service';
import { MessageModule } from './message/message.module';
import { AgoraModule } from './agora/agora.module';
import { ImagekitService } from './imagekit/imagekit.service';
import { ImagekitModule } from './imagekit/imagekit.module';
import { ImageModule } from './image/image.module';
import { OnesignalService } from './onesignal/onesignal.service';
import { OtpService } from './otp/otp.service';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    UserModule,
    FriendModule,
    StatusModule,
    ChatModule,
    ScheduleModule.forRoot(),
    MessageModule,
    AgoraModule,
    ImagekitModule,
    ImageModule,
  ],
  controllers: [],
  providers: [AppService, OnesignalService, OtpService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CurrentUserMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
