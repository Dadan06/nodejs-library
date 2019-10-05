import { BaseRepository } from '../common/repository/base.repository';
import { Message } from './message.model';
import { MessageDocument, messageSchema } from './message.schema';

class MessageRepository extends BaseRepository<MessageDocument, Message> {
    constructor() {
        super(messageSchema);
    }

    getUndeliveredMessages(to: string): Promise<Message[]> {
        return this.find({ to, delivered: false }).exec();
    }

    setMessageAsDelivered(messageId: string): Promise<Message | null> {
        return this.update(messageId, { delivered: true });
    }
}

export const messageRepository = new MessageRepository();
