import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AppModule } from './app.module';

async function bootstrap() {
  // const app = await NestFactory.create(AppModule);
  // await app.listen(3000);

  const app = await NestFactory.create(AppModule, { rawBody: true });
  const logger = app.get(WINSTON_MODULE_NEST_PROVIDER);

  // Enable CORS
  app.enableCors();
  app.useLogger(logger);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  // |\-------------------------------------------------------------------/|
  // |                    SWAGGER (OPEN API) SETUP CONFIG                  |
  // |/-------------------------------------------------------------------\|
  const config = new DocumentBuilder()
    .setTitle('Example Backend API')
    .setDescription('Backend Service Example Documentation')
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        in: 'Header',
        name: 'Authorization',
      },
      'bearer',
    )
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);

  // |\-------------------------------------------------------------------/|
  // |                                                                     |
  // |/-------------------------------------------------------------------\|
  await app.listen(process.env.APP_PORT ?? 3000);
}
bootstrap();
