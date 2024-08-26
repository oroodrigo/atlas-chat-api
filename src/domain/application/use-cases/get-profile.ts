import { Injectable } from '@nestjs/common'

import { User } from '@/domain/enterprise/entities/user'

import { UsersRepository } from '../repositories/users-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface GetProfileUseCaseRequest {
  userId: string
}

interface GetProfileUseCaseResponse {
  user: User
}

@Injectable()
export class GetProfileUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
  }: GetProfileUseCaseRequest): Promise<GetProfileUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    return { user }
  }
}
