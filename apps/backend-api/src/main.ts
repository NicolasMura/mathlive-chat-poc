import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { WsAdapter } from '@nestjs/platform-ws';

import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // WebSockets
  app.useWebSocketAdapter(new WsAdapter(app));
  // app.useWebSocketAdapter(app.getHttpServer());

  // get env variables from .env file through ConfigService
  const config =  app.get(ConfigService);

  // configure CORS
  const ALLOWED_CORS: string = config.get<string>('ALLOWED_CORS');
  if(ALLOWED_CORS) {
    let whitelist: string[];
    try {
      whitelist = ALLOWED_CORS.split(',');
    } catch (e) {
      Logger.error('Error while retrieving ALLOWED_CORS variable...');
    }
    if (whitelist?.length > 0) {
      app.enableCors({
        origin: whitelist
        // credentials: true,
      });
    }
  }

  // serve static files
  console.log(__dirname);
  console.log(process.cwd());

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  // const port = process.env.PORT || 3333;
  const port = config.get<number>('NODE_PORT') || 3333;
  await app.listen(port, () => {
    Logger.log(`Running in <${config.get<string>('NODE_ENV')}> environment`);
    // Logger.log('Listening at http://localhost:' + port);
    Logger.log('Listening at http://localhost:' + port + '/' + globalPrefix);
  });
  Logger.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
