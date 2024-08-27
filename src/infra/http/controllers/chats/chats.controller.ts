import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common'

import { CreateRoomUseCase } from '@/domain/application/use-cases/create-room'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'

import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { RoomPresenter } from '../../presenters/room-presenter'
import { NewChatBodySchema, newChatBodySchema } from './schemas/new-chat-schema'

@Controller('/chats')
export class ChatsController {
  constructor(private createRoom: CreateRoomUseCase) {}

  @Post()
  @HttpCode(201)
  async createNewChat(
    @Body(new ZodValidationPipe(newChatBodySchema)) body: NewChatBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { name } = body
    const { sub } = user

    try {
      const { room } = await this.createRoom.execute({
        name,
        ownerId: sub,
      })
      return { room: RoomPresenter.toHTTP(room) }
    } catch (error) {
      console.log(error)
      throw new BadRequestException()
    }
  }
}
