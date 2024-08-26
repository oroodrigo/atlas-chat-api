import { RoomsRepository } from '../repositories/rooms-repository'

interface DeleteRoomUseCaseRequest {
  roomId: string
  ownerId: string
}

export class DeleteRoomUseCase {
  constructor(private roomsRepository: RoomsRepository) {}

  async execute({ roomId, ownerId }: DeleteRoomUseCaseRequest) {
    const room = await this.roomsRepository.findById(roomId)

    if (!room) {
      throw new Error('Resource not found.')
    }

    if (room.ownerId !== ownerId) {
      throw new Error('Not Allowed')
    }

    await this.roomsRepository.delete(room)
  }
}
