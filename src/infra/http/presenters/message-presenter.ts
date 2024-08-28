import { Message } from '@/domain/enterprise/entities/message'

export class MessagePresenter {
  static toHTTP(message: Message) {
    return {
      id: message.id,
      content: message.content,
      author_id: message.authorId,
      room_id: message.roomId,
      timestamp: message.timestamp,
    }
  }
}
