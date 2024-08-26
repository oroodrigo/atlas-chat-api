import { Room } from '@/domain/enterprise/entities/room'

import { RoomsRepository } from '../repositories/rooms-repository'

interface GetRoomByIdUseCaseRequest {
  roomId: string
}

interface GetRoomByIdUseCaseResponse {
  room: Room
}

export class GetRoomByIdUseCase {
  constructor(private roomsRepository: RoomsRepository) {}

  async execute({
    roomId,
  }: GetRoomByIdUseCaseRequest): Promise<GetRoomByIdUseCaseResponse> {
    const room = await this.roomsRepository.findById(roomId)

    if (!room) {
      throw new Error('Resource not found')
    }

    return { room }
  }
}
