import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as exphbs from 'express-handlebars';
import { ServiceAccount } from 'firebase-admin';
import * as admin from 'firebase-admin';
import { initializeApp } from 'firebase-admin/app';
import firebase from 'firebase/compat/app';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix('api/v1');
  const documentOptions: SwaggerDocumentOptions = {
    ignoreGlobalPrefix: false,
  };
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  const config = new DocumentBuilder()
    .setTitle('Zola Api')
    .setDescription('All api for intergrate with mobile/front-end')
    .setVersion('1.0')
    .addBearerAuth()
    .addSecurityRequirements('bearer')
    .build();
  const document = SwaggerModule.createDocument(app, config, documentOptions);
  SwaggerModule.setup('api', app, document);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    allowedHeaders: '*',
    origin: '*',
    credentials: true,
  });
  await app.listen(3000);
}
bootstrap();
