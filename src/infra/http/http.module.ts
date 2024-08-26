import { Module } from '@nestjs/common'

import { AuthenticateUserUseCase } from '@/domain/application/use-cases/authenticate-user'
import { GetProfileUseCase } from '@/domain/application/use-cases/get-profile'
import { RegisterUserUseCase } from '@/domain/application/use-cases/register-user'

import { CryptographyModule } from '../cryptography/cryptography.module'
import { DatabaseModule } from '../database/database.module'
import { ChatController } from './controllers/chat.controller'
import { SessionsController } from './controllers/sessions/sessions.controller'
import { UsersController } from './controllers/users/users.controller'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [UsersController, ChatController, SessionsController],
  providers: [RegisterUserUseCase, AuthenticateUserUseCase, GetProfileUseCase],
})
export class HttpModule {}
