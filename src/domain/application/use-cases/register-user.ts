import { randomUUID } from 'node:crypto'

import { Injectable } from '@nestjs/common'

import { User } from '@/domain/enterprise/entities/user'

import { HashGenerator } from '../cryptography/hash-generator'
import { UsersRepository } from '../repositories/users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

interface RegisterUserUseCaseRequest {
  name: string
  email: string
  password: string
}

interface RegisterUserUseCaseResponse {
  user: User
}

@Injectable()
export class RegisterUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    email,
    password,
  }: RegisterUserUseCaseRequest): Promise<RegisterUserUseCaseResponse> {
    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError(email)
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    const user = User.create({
      id: randomUUID(),
      email,
      name,
      password: hashedPassword,
    })

    await this.usersRepository.create(user)

    return { user }
  }
}
