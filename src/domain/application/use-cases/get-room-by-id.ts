import { Injectable } from '@nestjs/common'

import { Room } from '@/domain/enterprise/entities/room'

import { RoomsRepository } from '../repositories/rooms-repository'
// import { UsersRepository } from '../repositories/users-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface GetRoomByIdUseCaseRequest {
  roomId: string
}

interface GetRoomByIdUseCaseResponse {
  room: Room
}
@Injectable()
export class GetRoomByIdUseCase {
  constructor(
    private roomsRepository: RoomsRepository,
    // private usersRepository: UsersRepository,
  ) {}

  async execute({
    roomId,
  }: GetRoomByIdUseCaseRequest): Promise<GetRoomByIdUseCaseResponse> {
    const room = await this.roomsRepository.findById(roomId)

    if (!room) {
      throw new ResourceNotFoundError()
    }

    // const usersInRoom = await this.usersRepository.findManyInRoom(room.id)
    // console.log(room.users)

    return { room }
  }
}
