import { Module } from '@nestjs/common'

import { AuthenticateUserUseCase } from '@/domain/application/use-cases/authenticate-user'
import { CreateMessageUseCase } from '@/domain/application/use-cases/create-message'
import { CreateRoomUseCase } from '@/domain/application/use-cases/create-room'
import { DeleteMessageUseCase } from '@/domain/application/use-cases/delete-message'
import { DeleteRoomUseCase } from '@/domain/application/use-cases/delete-room'
import { FetchUserRoomsUseCase } from '@/domain/application/use-cases/fetch-user-rooms'
import { GetProfileUseCase } from '@/domain/application/use-cases/get-profile'
import { GetRoomByIdUseCase } from '@/domain/application/use-cases/get-room-by-id'
import { GetRoomMessagesUseCase } from '@/domain/application/use-cases/get-room-messages'
import { JoinRoomUseCase } from '@/domain/application/use-cases/join-room'
import { RegisterUserUseCase } from '@/domain/application/use-cases/register-user'
import { SearchRoomsByNameUseCase } from '@/domain/application/use-cases/search-rooms-by-name'

import { CryptographyModule } from '../cryptography/cryptography.module'
import { DatabaseModule } from '../database/database.module'
import { ChatsController } from './controllers/chats/chats.controller'
import { SessionsController } from './controllers/sessions/sessions.controller'
import { UsersController } from './controllers/users/users.controller'
import { EventsGateway } from './websocket/events.gateway'
import { WebSocketModule } from './websocket/websocket.module'

@Module({
  imports: [DatabaseModule, CryptographyModule, WebSocketModule],
  controllers: [UsersController, ChatsController, SessionsController],
  providers: [
    RegisterUserUseCase,
    AuthenticateUserUseCase,
    GetProfileUseCase,
    CreateRoomUseCase,
    FetchUserRoomsUseCase,
    JoinRoomUseCase,
    GetRoomByIdUseCase,
    DeleteRoomUseCase,
    SearchRoomsByNameUseCase,
    CreateMessageUseCase,
    GetRoomMessagesUseCase,
    DeleteMessageUseCase,
    EventsGateway,
  ],
})
export class HttpModule {}
