import { Injectable } from '@nestjs/common'

import { UsersRoomsRepository } from '@/domain/application/repositories/users-rooms-repository'
import { UserRoom } from '@/domain/enterprise/entities/user-room'

import { PrismaUserRoomMapper } from '../mappers/prisma-user-room-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaUsersRoomsRepository implements UsersRoomsRepository {
  constructor(private prisma: PrismaService) {}
  async create(userRoom: UserRoom): Promise<void> {
    const data = PrismaUserRoomMapper.toPrisma(userRoom)

    await this.prisma.userRoom.create({
      data,
    })
  }
}
