import { Room } from '@/domain/enterprise/entities/room'

import { RoomsRepository } from '../repositories/rooms-repository'

interface SearchRoomsByNameUseCaseRequest {
  roomName: string
}

interface SearchRoomsByNameUseCaseResponse {
  rooms: Room[]
}

export class SearchRoomsByNameUseCase {
  constructor(private roomsRepository: RoomsRepository) {}

  async execute({
    roomName,
  }: SearchRoomsByNameUseCaseRequest): Promise<SearchRoomsByNameUseCaseResponse> {
    const rooms = await this.roomsRepository.findByRoomName(roomName)

    if (!rooms) {
      throw new Error('Resource not found')
    }

    return { rooms }
  }
}
