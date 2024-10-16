import { randomUUID } from 'node:crypto'

import { Injectable } from '@nestjs/common'

import { Room } from '@/domain/enterprise/entities/room'
import { UserRoom } from '@/domain/enterprise/entities/user-room'

import { RoomsRepository } from '../repositories/rooms-repository'
import { UsersRepository } from '../repositories/users-repository'
import { UsersRoomsRepository } from '../repositories/users-rooms-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface CreateRoomUseCaseRequest {
  name: string
  ownerId: string
}

interface CreateRoomUseCaseResponse {
  room: Room
}

@Injectable()
export class CreateRoomUseCase {
  constructor(
    private roomsRepository: RoomsRepository,
    private usersRepository: UsersRepository,
    private usersRoomsRepository: UsersRoomsRepository,
  ) {}

  async execute({
    name,
    ownerId,
  }: CreateRoomUseCaseRequest): Promise<CreateRoomUseCaseResponse> {
    const roomOwner = await this.usersRepository.findById(ownerId)

    if (!roomOwner) {
      throw new ResourceNotFoundError()
    }

    const roomId = randomUUID()

    const room = Room.create({
      id: roomId,
      name,
      ownerId,
      users: [],
    })

    const userRoom = UserRoom.create({
      id: randomUUID(),
      userId: ownerId,
      roomId,
      user: roomOwner,
      room,
    })

    userRoom.room = room

    await this.roomsRepository.create(room)
    await this.usersRoomsRepository.create(userRoom)

    return { room }
  }
}
