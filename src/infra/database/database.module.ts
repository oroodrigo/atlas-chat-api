import { Module } from '@nestjs/common'

import { RoomsRepository } from '@/domain/application/repositories/rooms-repository'
import { UsersRepository } from '@/domain/application/repositories/users-repository'
import { UsersRoomsRepository } from '@/domain/application/repositories/users-rooms-repository'

import { PrismaService } from './prisma/prisma.service'
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
  ],
  exports: [
    PrismaService,
    UsersRepository,
    RoomsRepository,
    UsersRoomsRepository,
  ],
})
export class DatabaseModule {}
