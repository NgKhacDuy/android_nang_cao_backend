import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  const documentOptions: SwaggerDocumentOptions = {
    ignoreGlobalPrefix: false,
  };
  const config = new DocumentBuilder()
    .setTitle('Cinema api')
    .setDescription('All api for intergrate with mobile/front-end')
    .setVersion('1.0')
    .addBearerAuth({
      description: `[just text field] Please enter token in following format: Bearer <JWT>`,
      name: 'Authorization',
      bearerFormat: 'Bearer',
      scheme: 'Bearer',
      type: 'http', //
      in: 'Header',
    })
    .build();
  const document = SwaggerModule.createDocument(app, config, documentOptions);
  SwaggerModule.setup('api', app, document);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
