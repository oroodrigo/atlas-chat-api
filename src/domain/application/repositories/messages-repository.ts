import { Message } from '@/domain/enterprise/entities/message'

export abstract class MessagesRepository {
  abstract findById(messageId: string): Promise<Message | null>
  abstract findManyByRoomId(roomId: string): Promise<Message[]>
  abstract create(message: Message): Promise<void>
  abstract save(message: Message): Promise<void>
  abstract delete(message: Message): Promise<void>
}
