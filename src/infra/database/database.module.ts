import { Module } from '@nestjs/common'

import { MessagesRepository } from '@/domain/application/repositories/messages-repository'
import { RoomsRepository } from '@/domain/application/repositories/rooms-repository'
import { UsersRepository } from '@/domain/application/repositories/users-repository'
import { UsersRoomsRepository } from '@/domain/application/repositories/users-rooms-repository'

import { PrismaService } from './prisma/prisma.service'
import { PrismaMessagesRepository } from './prisma/repositories/prisma-messages-repository'
import { PrismaRoomsRepository } from './prisma/repositories/prisma-rooms-repository'
import { PrismaUsersRepository } from './prisma/repositories/prisma-users-repository'
import { PrismaUsersRoomsRepository } from './prisma/repositories/prisma-users-rooms-repository'

@Module({
  providers: [
    PrismaService,
    {
      provide: UsersRepository,
      useClass: PrismaUsersRepository,
    },
    {
      provide: RoomsRepository,
      useClass: PrismaRoomsRepository,
    },
    {
      provide: UsersRoomsRepository,
      useClass: PrismaUsersRoomsRepository,
    },
    {
      provide: MessagesRepository,
      useClass: PrismaMessagesRepository,
    },
  ],
  exports: [
    PrismaService,
    UsersRepository,
    RoomsRepository,
    UsersRoomsRepository,
    MessagesRepository,
  ],
})
export class DatabaseModule {}
