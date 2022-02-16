import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { MessagesModule } from '../messages/messages.module';
import { EventsGateway } from './events.gateway';

@Module({
  providers: [
    EventsGateway
  ],
  imports: [UsersModule, MessagesModule]
})
export class EventsModule {}
