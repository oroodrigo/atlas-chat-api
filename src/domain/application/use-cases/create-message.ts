import { randomUUID } from 'node:crypto'

import { Injectable } from '@nestjs/common'

import { Message } from '@/domain/enterprise/entities/message'

import { MessagesRepository } from '../repositories/messages-repository'
import { RoomsRepository } from '../repositories/rooms-repository'
import { UsersRepository } from '../repositories/users-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface CreateMessageUseCaseRequest {
  content: string
  roomId: string
  authorId: string
}

interface CreateMessageUseCaseResponse {
  message: Message
}
@Injectable()
export class CreateMessageUseCase {
  constructor(
    private messagesRepository: MessagesRepository,
    private usersRepository: UsersRepository,
    private roomsRepository: RoomsRepository,
  ) {}

  async execute({
    content,
    authorId,
    roomId,
  }: CreateMessageUseCaseRequest): Promise<CreateMessageUseCaseResponse> {
    const user = await this.usersRepository.findById(authorId)
    const room = await this.roomsRepository.findById(roomId)

    if (!room || !user) {
      throw new ResourceNotFoundError()
    }

    const message = Message.create({
      id: randomUUID(),
      content,
      authorId,
      authorName: user.name,
      roomId: room.id,
    })

    await this.messagesRepository.create(message)

    return { message }
  }
}
