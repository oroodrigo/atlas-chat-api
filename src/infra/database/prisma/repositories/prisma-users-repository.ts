import { Injectable } from '@nestjs/common'

import { UsersRepository } from '@/domain/application/repositories/users-repository'
import { Room } from '@/domain/enterprise/entities/room'
import { User } from '@/domain/enterprise/entities/user'

import { PrismaRoomMapper } from '../mappers/prisma-room-mapper'
import { PrismaUserMapper } from '../mappers/prisma-user-mapper'
import { PrismaUserRoomMapper } from '../mappers/prisma-user-room-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaUsersRepository implements UsersRepository {
  constructor(private prisma: PrismaService) {}
  async findById(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      return null
    }

    return PrismaUserMapper.toDomain(user)
  }

  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!user) {
      return null
    }

    return PrismaUserMapper.toDomain(user)
  }

  async findByUserName(name: string) {
    const users = await this.prisma.user.findMany({
      where: {
        name,
      },
    })

    return users.map(PrismaUserMapper.toDomain)
  }

  async fetchRooms(userId: string) {
    const userWithRooms = await this.prisma.user.findFirst({
      where: {
        id: userId,
      },
      include: {
        userRooms: {
          include: {
            room: true,
          },
        },
      },
    })

    if (!userWithRooms) {
      return []
    }

    const user = PrismaUserMapper.toDomain(userWithRooms)

    return userWithRooms.userRooms.map((userRoom) => {
      const room: Room = PrismaRoomMapper.toDomain(userRoom.room)
      return PrismaUserRoomMapper.toDomain(userRoom, user, room)
    })
  }

  async isUserInRoom(userId: string, roomId: string) {
    const userRoom = await this.prisma.userRoom.findFirst({
      where: {
        userId,
        roomId,
      },
    })

    return userRoom !== null
  }

  async create(user: User) {
    const data = PrismaUserMapper.toPrisma(user)

    await this.prisma.user.create({
      data,
    })
  }

  async save(user: User) {
    const data = PrismaUserMapper.toPrisma(user)
    await this.prisma.user.update({
      data,
      where: {
        email: data.email,
      },
    })
  }

  async delete(user: User) {
    const data = PrismaUserMapper.toPrisma(user)

    await this.prisma.user.delete({
      where: {
        email: data.email,
      },
    })
  }
}
