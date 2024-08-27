import { Room } from '@/domain/enterprise/entities/room'

export class RoomPresenter {
  static toHTTP(room: Room) {
    return {
      id: room.id.toString(),
      name: room.name,
      ownerId: room.ownerId,
      imageUrl: room.imageUrl,
      createdAt: room.createdAt,
      updatedAt: room.updatedAt,
    }
  }
}
