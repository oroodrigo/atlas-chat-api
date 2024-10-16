import {
  Prisma,
  Room as PrismaRoom,
  User as PrismaUser,
  UserRoom as PrismaUserRoom,
} from '@prisma/client'

import { Room } from '@/domain/enterprise/entities/room'
import { User } from '@/domain/enterprise/entities/user'

type PrismaRoomWithRelations = PrismaRoom & {
  userRooms?: (PrismaUserRoom & { user: PrismaUser })[]
}

export class PrismaRoomMapper {
  // Método para converter PrismaRoom (com ou sem relações) para a entidade Room no domínio
  static toDomain(raw: PrismaRoomWithRelations): Room {
    return Room.create({
      id: raw.id,
      name: raw.name,
      ownerId: raw.ownerId,
      imageUrl: raw.imageUrl,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      // Verifica se userRooms está presente e mapeia os usuários
      users: raw.userRooms
        ? raw.userRooms.map((userRoom) => {
            return User.create({
              id: userRoom.user.id,
              name: userRoom.user.name,
              email: userRoom.user.email,
              password: userRoom.user.password,
            })
          })
        : [],
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
