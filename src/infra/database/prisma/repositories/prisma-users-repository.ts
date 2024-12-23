import { Injectable } from '@nestjs/common'

import { UsersRepository } from '@/domain/application/repositories/users-repository'
import { User } from '@/domain/enterprise/entities/user'

import { PrismaRoomMapper } from '../mappers/prisma-room-mapper'
import { PrismaUserMapper } from '../mappers/prisma-user-mapper'
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
    const roomsThatUserAreIn = await this.prisma.room.findMany({
      where: {
        userRooms: {
          some: {
            userId,
          },
        },
      },
      include: {
        userRooms: {
          include: {
            user: true,
          },
        },
      },
    })

    if (!roomsThatUserAreIn) {
      return []
    }

    return roomsThatUserAreIn.map(PrismaRoomMapper.toDomain)
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
