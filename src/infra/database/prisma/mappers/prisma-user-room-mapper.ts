import { Prisma, UserRoom as PrismaUserRoom } from '@prisma/client'

import { Room } from '@/domain/enterprise/entities/room'
import { User } from '@/domain/enterprise/entities/user'
import { UserRoom } from '@/domain/enterprise/entities/user-room'

export class PrismaUserRoomMapper {
  static toDomain(raw: PrismaUserRoom, user: User, room: Room): UserRoom {
    return UserRoom.create({
      id: raw.id,
      userId: user.id,
      user,
      roomId: room.id,
      room,
      joinedAt: raw.joinedAt,
    })
  }

  static toPrisma(userRoom: UserRoom): Prisma.UserRoomUncheckedCreateInput {
    return {
      id: userRoom.id,
      userId: userRoom.userId,
      roomId: userRoom.roomId,
    }
  }
}
