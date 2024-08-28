import { Injectable } from '@nestjs/common'

import { MessagesRepository } from '@/domain/application/repositories/messages-repository'
import { Message } from '@/domain/enterprise/entities/message'

import { PrismaMessageMapper } from '../mappers/prisma-message-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaMessagesRepository implements MessagesRepository {
  constructor(private prisma: PrismaService) {}
  async findById(messageId: string) {
    const message = await this.prisma.message.findUnique({
      where: {
        id: messageId,
      },
    })

    if (!message) {
      return null
    }

    return PrismaMessageMapper.toDomain(message)
  }

  async findManyByRoomId(roomId: string): Promise<Message[]> {
    const messages = await this.prisma.message.findMany({
      where: {
        roomId,
      },
    })

    return messages.map(PrismaMessageMapper.toDomain)
  }

  async create(message: Message): Promise<void> {
    const data = PrismaMessageMapper.toPrisma(message)

    await this.prisma.message.create({
      data,
    })
  }

  async save(message: Message): Promise<void> {
    const data = PrismaMessageMapper.toPrisma(message)

    await this.prisma.message.update({
      data,
      where: {
        id: data.id,
      },
    })
  }

  async delete(message: Message): Promise<void> {
    const data = PrismaMessageMapper.toPrisma(message)

    await this.prisma.message.delete({
      where: {
        id: data.id,
      },
    })
  }
}
