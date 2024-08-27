import { Injectable } from '@nestjs/common'

import { Room } from '@/domain/enterprise/entities/room'

import { RoomsRepository } from '../repositories/rooms-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface GetRoomByIdUseCaseRequest {
  roomId: string
}

interface GetRoomByIdUseCaseResponse {
  room: Room
}
@Injectable()
export class GetRoomByIdUseCase {
  constructor(private roomsRepository: RoomsRepository) {}

  async execute({
    roomId,
  }: GetRoomByIdUseCaseRequest): Promise<GetRoomByIdUseCaseResponse> {
    const room = await this.roomsRepository.findById(roomId)

    if (!room) {
      throw new ResourceNotFoundError()
    }

    return { room }
  }
}
