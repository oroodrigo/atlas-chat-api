import { randomUUID } from 'node:crypto'

import { Room } from '@/domain/enterprise/entities/room'

import { RoomsRepository } from '../repositories/rooms-repository'

interface CreateRoomUseCaseRequest {
  name: string
  ownerId: string
}

interface CreateRoomUseCaseResponse {
  room: Room
}

export class CreateRoomUseCase {
  constructor(private roomsRepository: RoomsRepository) {}

  async execute({
    name,
    ownerId,
  }: CreateRoomUseCaseRequest): Promise<CreateRoomUseCaseResponse> {
    const room = Room.create({
      id: randomUUID(),
      name,
      ownerId,
    })

    await this.roomsRepository.create(room)

    return { room }
  }
}
