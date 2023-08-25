import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from 'db/data-source';
import { UserModule } from './user/user.module';
import { CurrentUserMiddleware } from './utilities/middlewares/current-user.middlewares';
import { MovieModule } from './movie/movie.module';
import { HallModule } from './hall/hall.module';
import { ShowtimeModule } from './showtime/showtime.module';
import { BookingModule } from './booking/booking.module';
import { RatingModule } from './rating/rating.module';
import { BillModule } from './bill/bill.module';
import { GenreModule } from './genre/genre.module';
import { DirectorModule } from './director/director.module';
import { CastModule } from './cast/cast.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    UserModule,
    MovieModule,
    HallModule,
    ShowtimeModule,
    BookingModule,
    RatingModule,
    BillModule,
    GenreModule,
    DirectorModule,
    CastModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CurrentUserMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
