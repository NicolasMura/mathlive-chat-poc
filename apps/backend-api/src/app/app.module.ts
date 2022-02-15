import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { EventsModule } from './events/events.module';
import { MessagesModule } from './messages/messages.module';
import { AllExceptionsFilter } from './utilities/all-exceptions.filter';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    UsersModule,
    EventsModule,
    MessagesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Register a global-scope filter directly to help debugging
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter
    }
  ],
})
export class AppModule {}
