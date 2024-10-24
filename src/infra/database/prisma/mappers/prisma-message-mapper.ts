import { Message as PrismaMessage, Prisma } from '@prisma/client'

import { Message } from '@/domain/enterprise/entities/message'

export class PrismaMessageMapper {
  static toDomain(raw: PrismaMessage): Message {
    return Message.create({
      id: raw.id,
      authorId: raw.authorId,
      authorName: raw.authorName,
      roomId: raw.roomId,
      content: raw.content,
      timestamp: raw.timeStamp,
    })
  }

  static toPrisma(message: Message): Prisma.MessageUncheckedCreateInput {
    return {
      id: message.id,
      authorId: message.authorId,
      authorName: message.authorName,
      roomId: message.roomId,
      content: message.content,
      timeStamp: message.timestamp,
    }
  }
}
