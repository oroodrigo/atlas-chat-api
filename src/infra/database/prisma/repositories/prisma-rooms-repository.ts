import { Injectable } from '@nestjs/common'

import { RoomsRepository } from '@/domain/application/repositories/rooms-repository'
import { Room } from '@/domain/enterprise/entities/room'

import { PrismaRoomMapper } from '../mappers/prisma-room-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaRoomsRepository implements RoomsRepository {
  constructor(private prisma: PrismaService) {}
  async findById(id: string) {
    const room = await this.prisma.room.findUnique({
      where: {
        id,
      },
    })

    if (!room) {
      return null
    }

    return PrismaRoomMapper.toDomain(room)
  }

  async findByRoomName(name: string) {
    const rooms = await this.prisma.room.findMany({
      where: {
        name,
      },
    })

    return rooms.map(PrismaRoomMapper.toDomain)
  }

  async findManyByUserId(userId: string) {
    const userRooms = await this.prisma.room.findMany({
      where: {
        ownerId: userId,
      },
    })

    return userRooms.map(PrismaRoomMapper.toDomain)
  }

  async create(room: Room) {
    const data = PrismaRoomMapper.toPrisma(room)

    await this.prisma.room.create({
      data,
    })
  }

  async save(room: Room) {
    const data = PrismaRoomMapper.toPrisma(room)

    await this.prisma.room.update({
      data,
      where: {
        id: data.id,
      },
    })
  }

  async delete(room: Room) {
    const data = PrismaRoomMapper.toPrisma(room)

    await this.prisma.userRoom.deleteMany({
      where: {
        roomId: data.id,
      },
    })

    await this.prisma.room.delete({
      where: {
        id: data.id,
      },
    })
  }
}
