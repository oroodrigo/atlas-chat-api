import { Injectable } from '@nestjs/common'

import { MessagesRepository } from '../repositories/messages-repository'
import { RoomsRepository } from '../repositories/rooms-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { UnauthorizedError } from './errors/unauthorized-error'

interface DeleteMessageUseCaseRequest {
  messageId: string
  authorId: string
  roomId: string
}

@Injectable()
export class DeleteMessageUseCase {
  constructor(
    private messagesRepository: MessagesRepository,
    private roomsRepository: RoomsRepository,
  ) {}

  async execute({ messageId, authorId, roomId }: DeleteMessageUseCaseRequest) {
    const message = await this.messagesRepository.findById(messageId)
    const room = await this.roomsRepository.findById(roomId)

    if (!message || !room) {
      throw new ResourceNotFoundError()
    }

    if (message.authorId !== authorId) {
      throw new UnauthorizedError()
    }

    await this.messagesRepository.delete(message)
  }
}
