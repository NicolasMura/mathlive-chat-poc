import { Module } from '@nestjs/common';
import { MessagesModule } from '../messages/messages.module';
import { MessagesService } from '../messages/messages.service';
import { EventsGateway } from './events.gateway';

@Module({
  providers: [
    // MessagesService,
    EventsGateway
  ],
  imports: [MessagesModule]
})
export class EventsModule {}
