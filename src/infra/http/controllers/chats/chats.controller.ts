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

import { CreateMessageUseCase } from '@/domain/application/use-cases/create-message'
import { CreateRoomUseCase } from '@/domain/application/use-cases/create-room'
import { DeleteMessageUseCase } from '@/domain/application/use-cases/delete-message'
import { DeleteRoomUseCase } from '@/domain/application/use-cases/delete-room'
import { ResourceNotFoundError } from '@/domain/application/use-cases/errors/resource-not-found-error'
import { UnauthorizedError } from '@/domain/application/use-cases/errors/unauthorized-error'
import { UserAlreadyInChatRoomError } from '@/domain/application/use-cases/errors/user-already-in-chat-room-error'
import { GetRoomByIdUseCase } from '@/domain/application/use-cases/get-room-by-id'
import { GetRoomMessagesUseCase } from '@/domain/application/use-cases/get-room-messages'
import { JoinRoomUseCase } from '@/domain/application/use-cases/join-room'
import { SearchRoomsByNameUseCase } from '@/domain/application/use-cases/search-rooms-by-name'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'

import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { MessagePresenter } from '../../presenters/message-presenter'
import { RoomPresenter } from '../../presenters/room-presenter'
import { UserPresenter } from '../../presenters/user-presenter'
import { EventsGateway, EventsKind } from '../../websocket/events.gateway'
import {
  CreateMessageBodySchema,
  createMessageBodySchema,
} from './schemas/create-message-schema'
import { DeleteMessageParams } from './schemas/delete-message-params'
import { NewChatBodySchema, newChatBodySchema } from './schemas/new-chat-schema'

@Controller('/chats')
export class ChatsController {
  constructor(
    private eventsGateway: EventsGateway,
    private createRoomUseCase: CreateRoomUseCase,
    private joinRoomUseCase: JoinRoomUseCase,
    private getRoomByIdUseCase: GetRoomByIdUseCase,
    private deleteRoomUseCase: DeleteRoomUseCase,
    private searchRoomsByNameUseCase: SearchRoomsByNameUseCase,
    private createMessageUseCase: CreateMessageUseCase,
    private getMessagesUseCase: GetRoomMessagesUseCase,
    private deleteMessageUseCase: DeleteMessageUseCase,
  ) {}

  // Chat methods

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

      this.eventsGateway.server.emit('new_room', {
        kind: 'new_room' as EventsKind,
        room: RoomPresenter.toHTTP(room),
      })

      return { room: RoomPresenter.toHTTP(room) }
    } catch (error) {
      throw new BadRequestException()
    }
  }

  @Post('/:roomId/join')
  @HttpCode(200)
  async joinChat(
    @Param('roomId') roomId: string,
    @CurrentUser() user: UserPayload,
  ) {
    const { sub } = user

    try {
      const { userRoom } = await this.joinRoomUseCase.execute({
        roomId,
        userId: sub,
      })

      this.eventsGateway.notifyUsersInRoom(roomId, 'user_joined', {
        kind: 'user_joined' as EventsKind,
        user: UserPresenter.toHTTP(userRoom.user),
        roomId,
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

      this.eventsGateway.notifyUsersInRoom(roomId, 'delete_room', {
        roomId,
      })
      this.eventsGateway.deleteRoom(roomId)
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

  // Message methods

  @Post('/:roomId/messages')
  @HttpCode(201)
  async createMessage(
    @Body(new ZodValidationPipe(createMessageBodySchema))
    body: CreateMessageBodySchema,
    @Param('roomId') roomId: string,
    @CurrentUser() user: UserPayload,
  ) {
    const { content } = body
    const { sub } = user

    try {
      const { message } = await this.createMessageUseCase.execute({
        content,
        authorId: sub,
        roomId,
      })

      this.eventsGateway.notifyUsersInRoom(roomId, 'new_message', {
        kind: 'new_message' as EventsKind,
        message: MessagePresenter.toHTTP(message),
      })

      return {
        message: MessagePresenter.toHTTP(message),
      }
    } catch (error) {
      if (error instanceof ResourceNotFoundError) {
        throw new BadRequestException(error.message)
      }
      throw new BadRequestException(error)
    }
  }

  @Get('/:roomId/messages')
  async getMessages(@Param('roomId') roomId: string) {
    try {
      const { messages } = await this.getMessagesUseCase.execute({
        roomId,
      })

      return {
        messages: messages.map(MessagePresenter.toHTTP),
      }
    } catch (error) {
      if (error instanceof ResourceNotFoundError) {
        throw new BadRequestException(error.message)
      }
      throw new BadRequestException(error)
    }
  }

  @Delete('/:roomId/messages/:messageId')
  async deleteMessage(
    @Param() params: DeleteMessageParams,
    @CurrentUser() user: UserPayload,
  ) {
    const { roomId, messageId } = params
    const { sub } = user

    try {
      await this.deleteMessageUseCase.execute({
        authorId: sub,
        roomId,
        messageId,
      })

      this.eventsGateway.notifyUsersInRoom(roomId, 'delete_message', {
        kind: 'new_message' as EventsKind,
        messageId,
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
}
