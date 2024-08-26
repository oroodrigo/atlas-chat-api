import { randomUUID } from 'node:crypto'

import { Message } from '@/domain/enterprise/entities/message'

import { MessagesRepository } from '../repositories/messages-repository'
import { RoomsRepository } from '../repositories/rooms-repository'

interface CreateMessageUseCaseRequest {
  content: string
  roomId: string
  authorId: string
}

interface CreateMessageUseCaseResponse {
  message: Message
}

export class CreateMessageUseCase {
  constructor(
    private messagesRepository: MessagesRepository,
    private roomsRepository: RoomsRepository,
  ) {}

  async execute({
    content,
    authorId,
    roomId,
  }: CreateMessageUseCaseRequest): Promise<CreateMessageUseCaseResponse> {
    const room = await this.roomsRepository.findById(roomId)

    if (!room) {
      throw new Error('Resource not found.')
    }

    const message = Message.create({
      id: randomUUID(),
      content,
      authorId,
      roomId: room.id,
    })

    await this.messagesRepository.create(message)

    return { message }
  }
}
