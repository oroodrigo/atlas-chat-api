import { Injectable } from '@nestjs/common'
import { randomUUID } from 'crypto'

import { UserRoom } from '@/domain/enterprise/entities/user-room'

import { RoomsRepository } from '../repositories/rooms-repository'
import { UsersRepository } from '../repositories/users-repository'
import { UsersRoomsRepository } from '../repositories/users-rooms-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { UserAlreadyInChatRoomError } from './errors/user-already-in-chat-room-error'

interface JoinRoomUseCaseRequest {
  roomId: string
  userId: string
}

interface JoinRoomUseCaseResponse {
  userRoom: UserRoom
}

@Injectable()
export class JoinRoomUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private roomsRepository: RoomsRepository,
    private usersRoomsRepository: UsersRoomsRepository,
  ) {}

  async execute({
    roomId,
    userId,
  }: JoinRoomUseCaseRequest): Promise<JoinRoomUseCaseResponse> {
    const room = await this.roomsRepository.findById(roomId)

    if (!room) {
      throw new ResourceNotFoundError()
    }

    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    const userAlreadyInRoom = await this.usersRepository.isUserInRoom(
      userId,
      roomId,
    )

    if (userAlreadyInRoom) {
      throw new UserAlreadyInChatRoomError()
    }

    const userRoom = UserRoom.create({
      id: randomUUID(),
      userId,
      roomId,
      user,
      room,
    })

    await this.usersRoomsRepository.create(userRoom)

    user.rooms.push(userRoom)

    await this.usersRepository.save(user)

    return { userRoom }
  }
}
