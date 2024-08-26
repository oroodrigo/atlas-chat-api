import { Room } from '@/domain/enterprise/entities/room'

export abstract class RoomsRepository {
  abstract findById(roomId: string): Promise<Room | null>
  abstract findByRoomName(roomName: string): Promise<Room[]>
  abstract findManyByUserId(roomName: string): Promise<Room[]>
  abstract create(room: Room): Promise<void>
  abstract save(room: Room): Promise<void>
  abstract delete(room: Room): Promise<void>
}
