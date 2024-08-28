import { Room } from '@/domain/enterprise/entities/room'

export class RoomPresenter {
  static toHTTP(room: Room) {
    return {
      id: room.id,
      name: room.name,
      ownerId: room.ownerId,
      image_url: room.imageUrl ?? null,
      created_at: room.createdAt,
      updated_at: room.updatedAt,
    }
  }
}
