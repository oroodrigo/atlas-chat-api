import { Injectable } from '@nestjs/common'

import { RoomsRepository } from '../repositories/rooms-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { UnauthorizedError } from './errors/unauthorized-error'

interface DeleteRoomUseCaseRequest {
  roomId: string
  ownerId: string
}

@Injectable()
export class DeleteRoomUseCase {
  constructor(private roomsRepository: RoomsRepository) {}

  async execute({ roomId, ownerId }: DeleteRoomUseCaseRequest) {
    const room = await this.roomsRepository.findById(roomId)

    if (!room) {
      throw new ResourceNotFoundError()
    }

    if (room.ownerId !== ownerId) {
      throw new UnauthorizedError()
    }

    await this.roomsRepository.delete(room)
  }
}
