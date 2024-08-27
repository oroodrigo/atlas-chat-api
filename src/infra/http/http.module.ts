import { Module } from '@nestjs/common'

import { AuthenticateUserUseCase } from '@/domain/application/use-cases/authenticate-user'
import { CreateRoomUseCase } from '@/domain/application/use-cases/create-room'
import { DeleteRoomUseCase } from '@/domain/application/use-cases/delete-ROOM'
import { FetchUserRoomsUseCase } from '@/domain/application/use-cases/fetch-user-rooms'
import { GetProfileUseCase } from '@/domain/application/use-cases/get-profile'
import { GetRoomByIdUseCase } from '@/domain/application/use-cases/get-room-by-id'
import { JoinRoomUseCase } from '@/domain/application/use-cases/join-room'
import { RegisterUserUseCase } from '@/domain/application/use-cases/register-user'
import { SearchRoomsByNameUseCase } from '@/domain/application/use-cases/search-rooms-by-name'

import { CryptographyModule } from '../cryptography/cryptography.module'
import { DatabaseModule } from '../database/database.module'
import { ChatsController } from './controllers/chats/chats.controller'
import { SessionsController } from './controllers/sessions/sessions.controller'
import { UsersController } from './controllers/users/users.controller'

@Module({
  imports: [DatabaseModule, CryptographyModule],
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
  ],
})
export class HttpModule {}
