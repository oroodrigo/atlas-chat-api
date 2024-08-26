import { Message } from '@/domain/enterprise/entities/message'

import { MessagesRepository } from '../repositories/messages-repository'
import { RoomsRepository } from '../repositories/rooms-repository'

interface GetRoomMessagesUseCaseRequest {
  roomId: string
}

interface GetRoomMessagesUseCaseResponse {
  messages: Message[]
}

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
      throw new Error('Resource not found')
    }

    const messages = await this.messagesRepository.findManyByRoomId(roomId)

    return { messages }
  }
}
