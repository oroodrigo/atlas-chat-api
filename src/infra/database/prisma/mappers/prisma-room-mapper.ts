import { Prisma, Room as PrismaRoom } from '@prisma/client'

import { Room } from '@/domain/enterprise/entities/room'

export class PrismaRoomMapper {
  static toDomain(raw: PrismaRoom): Room {
    return Room.create({
      id: raw.id,
      name: raw.name,
      ownerId: raw.ownerId,
      imageUrl: raw.imageUrl,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      users: [],
    })
  }

  static toPrisma(room: Room): Prisma.RoomUncheckedCreateInput {
    return {
      id: room.id,
      name: room.name,
      ownerId: room.ownerId,
      imageUrl: room.imageUrl,
    }
  }
}
