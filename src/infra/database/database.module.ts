import { Module } from '@nestjs/common'

import { RoomsRepository } from '@/domain/application/repositories/rooms-repository'
import { UsersRepository } from '@/domain/application/repositories/users-repository'

import { PrismaService } from './prisma/prisma.service'
import { PrismaRoomsRepository } from './prisma/repositories/prisma-rooms-repository'
import { PrismaUsersRepository } from './prisma/repositories/prisma-users-repository'

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
  ],
  exports: [PrismaService, UsersRepository, RoomsRepository],
})
export class DatabaseModule {}
