import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  // Create the application
  const app = await NestFactory.create(AppModule);

  // Set global prefix for all routes
  app.setGlobalPrefix('api');

  // Set global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      // remove extra properties from the request body
      whitelist: true,
    }),
  );

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Bookmark App')
    .setDescription('Nest js API for bookmark app')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  // Start the server
  await app.listen(process.env.PORT ?? 3000);
}

// Start the App
bootstrap().catch((err) => {
  // eslint-disable-next-line no-console
  console.log(`Error starting the server: ${err}`);
});
