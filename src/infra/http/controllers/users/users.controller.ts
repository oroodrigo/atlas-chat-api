import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Get,
  HttpCode,
  Post,
  UsePipes,
} from '@nestjs/common'

import { ResourceNotFoundError } from '@/domain/application/use-cases/errors/resource-not-found-error'
import { UserAlreadyExistsError } from '@/domain/application/use-cases/errors/user-already-exists-error'
import { GetProfileUseCase } from '@/domain/application/use-cases/get-profile'
import { RegisterUserUseCase } from '@/domain/application/use-cases/register-user'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { Public } from '@/infra/auth/public'

import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { ProfilePresenter } from '../../presenters/profile-presenter'
import {
  CreateAccountBodySchema,
  createAccountBodySchema,
} from './schemas/create-account-schema'

@Controller('/users')
export class UsersController {
  constructor(
    private getProfile: GetProfileUseCase,
    private registerUser: RegisterUserUseCase,
  ) {}

  @Get('/me')
  async me(@CurrentUser() user: UserPayload) {
    const { sub } = user

    try {
      const { user } = await this.getProfile.execute({
        userId: sub,
      })

      return { user: ProfilePresenter.toHTTP(user) }
    } catch (error) {
      if (error instanceof ResourceNotFoundError) {
        throw new BadRequestException(error.message)
      }

      throw new BadRequestException(error)
    }
  }

  @Post()
  @Public()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async createNewUser(@Body() body: CreateAccountBodySchema) {
    const { name, email, password } = body

    try {
      const { user } = await this.registerUser.execute({
        name,
        email,
        password,
      })

      return { user }
    } catch (error) {
      if (error instanceof UserAlreadyExistsError) {
        throw new ConflictException(error.message)
      }

      throw new BadRequestException(error)
    }
  }
}
