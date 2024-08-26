import { Room } from '@/domain/enterprise/entities/room'

import { RoomsRepository } from '../repositories/rooms-repository'
import { UsersRepository } from '../repositories/users-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface FetchUserRoomsUseCaseRequest {
  userId: string
}

interface FetchUserRoomsUseCaseResponse {
  rooms: Room[]
}

export class FetchUserRoomsUseCase {
  constructor(
    private roomsRepository: RoomsRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    userId,
  }: FetchUserRoomsUseCaseRequest): Promise<FetchUserRoomsUseCaseResponse> {
    // TODO: verify user id request in users repository
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    const rooms = await this.roomsRepository.findManyByUserId(userId)

    return { rooms }
  }
}
