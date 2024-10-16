import { Injectable } from '@nestjs/common'

import { Room } from '@/domain/enterprise/entities/room'

import { UsersRepository } from '../repositories/users-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface FetchUserRoomsUseCaseRequest {
  userId: string
}

interface FetchUserRoomsUseCaseResponse {
  rooms: Room[]
}

@Injectable()
export class FetchUserRoomsUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
  }: FetchUserRoomsUseCaseRequest): Promise<FetchUserRoomsUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    const rooms = await this.usersRepository.fetchRooms(userId)

    return { rooms }
  }
}
