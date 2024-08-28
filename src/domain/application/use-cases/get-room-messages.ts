import { Injectable } from '@nestjs/common'

import { Message } from '@/domain/enterprise/entities/message'

import { MessagesRepository } from '../repositories/messages-repository'
import { RoomsRepository } from '../repositories/rooms-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface GetRoomMessagesUseCaseRequest {
  roomId: string
}

interface GetRoomMessagesUseCaseResponse {
  messages: Message[]
}

@Injectable()
export class GetRoomMessagesUseCase {
  constructor(
    private messagesRepository: MessagesRepository,
    private roomsRepository: RoomsRepository,
  ) {}

  async execute({
    roomId,
  }: GetRoomMessagesUseCaseRequest): Promise<GetRoomMessagesUseCaseResponse> {
    const room = await this.roomsRepository.findById(roomId)

    if (!room) {
      throw new ResourceNotFoundError()
    }

    const messages = await this.messagesRepository.findManyByRoomId(roomId)

    return { messages }
  }
}
