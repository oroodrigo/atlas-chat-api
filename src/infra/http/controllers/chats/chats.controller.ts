import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  UnauthorizedException,
} from '@nestjs/common'

import { CreateRoomUseCase } from '@/domain/application/use-cases/create-room'
import { DeleteRoomUseCase } from '@/domain/application/use-cases/delete-ROOM'
import { ResourceNotFoundError } from '@/domain/application/use-cases/errors/resource-not-found-error'
import { UnauthorizedError } from '@/domain/application/use-cases/errors/unauthorized-error'
import { UserAlreadyInChatRoomError } from '@/domain/application/use-cases/errors/user-already-in-chat-room-error'
import { GetRoomByIdUseCase } from '@/domain/application/use-cases/get-room-by-id'
import { JoinRoomUseCase } from '@/domain/application/use-cases/join-room'
import { SearchRoomsByNameUseCase } from '@/domain/application/use-cases/search-rooms-by-name'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'

import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { RoomPresenter } from '../../presenters/room-presenter'
import { NewChatBodySchema, newChatBodySchema } from './schemas/new-chat-schema'

@Controller('/chats')
export class ChatsController {
  constructor(
    private createRoomUseCase: CreateRoomUseCase,
    private joinRoomUseCase: JoinRoomUseCase,
    private getRoomByIdUseCase: GetRoomByIdUseCase,
    private deleteRoomUseCase: DeleteRoomUseCase,
    private searchRoomsByNameUseCase: SearchRoomsByNameUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  async createNewChat(
    @Body(new ZodValidationPipe(newChatBodySchema)) body: NewChatBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { name } = body
    const { sub } = user

    try {
      const { room } = await this.createRoomUseCase.execute({
        name,
        ownerId: sub,
      })
      return { room: RoomPresenter.toHTTP(room) }
    } catch (error) {
      console.log(error)
      throw new BadRequestException()
    }
  }

  @Post('/:roomId/join')
  async joinChat(
    @Param('roomId') roomId: string,
    @CurrentUser() user: UserPayload,
  ) {
    const { sub } = user

    try {
      await this.joinRoomUseCase.execute({
        roomId,
        userId: sub,
      })
    } catch (error) {
      if (error instanceof ResourceNotFoundError) {
        throw new BadRequestException(error.message)
      }
      if (error instanceof UserAlreadyInChatRoomError) {
        throw new ConflictException(error.message)
      }

      throw new BadRequestException(error)
    }
  }

  @Get('/:roomId')
  async getChatById(@Param('roomId') roomId: string) {
    try {
      const { room } = await this.getRoomByIdUseCase.execute({
        roomId,
      })

      return {
        room: RoomPresenter.toHTTP(room),
      }
    } catch (error) {
      if (error instanceof ResourceNotFoundError) {
        throw new BadRequestException(error.message)
      }

      throw new BadRequestException(error)
    }
  }

  @Delete('/:roomId')
  async deleteChat(
    @Param('roomId') roomId: string,
    @CurrentUser() user: UserPayload,
  ) {
    const { sub } = user

    try {
      await this.deleteRoomUseCase.execute({
        roomId,
        ownerId: sub,
      })
    } catch (error) {
      if (error instanceof ResourceNotFoundError) {
        throw new BadRequestException(error.message)
      }
      if (error instanceof UnauthorizedError) {
        throw new UnauthorizedException(error.message)
      }

      throw new BadRequestException(error)
    }
  }

  @Get('/')
  async searchChatByName(@Query('name') name: string) {
    try {
      const { rooms } = await this.searchRoomsByNameUseCase.execute({
        roomName: name,
      })

      return {
        rooms: rooms.map(RoomPresenter.toHTTP),
      }
    } catch (error) {
      if (error instanceof ResourceNotFoundError) {
        throw new BadRequestException(error.message)
      }

      throw new BadRequestException(error)
    }
  }
}
