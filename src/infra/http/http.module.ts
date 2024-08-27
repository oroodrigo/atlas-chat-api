import { Module } from '@nestjs/common'

import { AuthenticateUserUseCase } from '@/domain/application/use-cases/authenticate-user'
import { CreateRoomUseCase } from '@/domain/application/use-cases/create-room'
import { FetchUserRoomsUseCase } from '@/domain/application/use-cases/fetch-user-rooms'
import { GetProfileUseCase } from '@/domain/application/use-cases/get-profile'
import { RegisterUserUseCase } from '@/domain/application/use-cases/register-user'

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
  ],
})
export class HttpModule {}
