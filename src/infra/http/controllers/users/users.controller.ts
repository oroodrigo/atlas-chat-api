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
import { FetchUserRoomsUseCase } from '@/domain/application/use-cases/fetch-user-rooms'
import { GetProfileUseCase } from '@/domain/application/use-cases/get-profile'
import { RegisterUserUseCase } from '@/domain/application/use-cases/register-user'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { Public } from '@/infra/auth/public'

import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { ProfilePresenter } from '../../presenters/profile-presenter'
import { RoomPresenter } from '../../presenters/room-presenter'
import { UserPresenter } from '../../presenters/user-presenter'
import {
  CreateAccountBodySchema,
  createAccountBodySchema,
} from './schemas/create-account-schema'

@Controller('/users')
export class UsersController {
  constructor(
    private getProfileUseCase: GetProfileUseCase,
    private registerUserUseCase: RegisterUserUseCase,
    private fetchRoomsUseCase: FetchUserRoomsUseCase,
  ) {}

  @Get('/me')
  async me(@CurrentUser() user: UserPayload) {
    const { sub } = user

    try {
      const { user } = await this.getProfileUseCase.execute({
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
      const { user } = await this.registerUserUseCase.execute({
        name,
        email,
        password,
      })

      return { user: UserPresenter.toHTTP(user) }
    } catch (error) {
      if (error instanceof UserAlreadyExistsError) {
        throw new ConflictException(error.message)
      }

      throw new BadRequestException(error)
    }
  }

  @Get('/rooms')
  @HttpCode(200)
  async fetchUserRooms(@CurrentUser() user: UserPayload) {
    const { sub } = user

    try {
      const { rooms } = await this.fetchRoomsUseCase.execute({
        userId: sub,
      })

      console.log(rooms)

      return { rooms: rooms.map(RoomPresenter.toHTTP) }
    } catch (error) {
      if (error instanceof ResourceNotFoundError) {
        throw new BadRequestException(error.message)
      }

      throw new BadRequestException(error)
    }
  }
}
