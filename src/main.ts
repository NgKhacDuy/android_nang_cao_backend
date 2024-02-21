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

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // const adminConfig: ServiceAccount = {
  //   clientEmail: process.env.CLIENT_EMAIL,
  //   privateKey: process.env.PRIVATE_KEY_FIREBASE.replace(/\\n/g, '\n'),
  //   projectId: process.env.PROJECT_ID,
  // };
  // admin.initializeApp({
  //   credential: admin.credential.cert(adminConfig),
  //   databaseURL: process.env.DATABASE_URL,
  // });

  // const firebaseConfig = {
  //   apiKey: 'AIzaSyBj2IViBbqh9Umsn2--IbBoIUBNuhWwz7Y',
  //   authDomain: 'app-chat-zola.firebaseapp.com',
  //   databaseURL:
  //     'https://app-chat-zola-default-rtdb.asia-southeast1.firebasedatabase.app',
  //   projectId: 'app-chat-zola',
  //   storageBucket: 'app-chat-zola.appspot.com',
  //   messagingSenderId: '939427858010',
  //   appId: '1:939427858010:web:cbf13567a5dea35fbf3a63',
  //   measurementId: 'G-J58QB8YS6F',
  // };

  // firebase.initializeApp(firebaseConfig);
  app.setGlobalPrefix('api/v1');
  const documentOptions: SwaggerDocumentOptions = {
    ignoreGlobalPrefix: false,
  };

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
