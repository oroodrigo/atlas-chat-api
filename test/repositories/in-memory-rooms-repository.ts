import { RoomsRepository } from '@/domain/application/repositories/rooms-repository'
import { Room } from '@/domain/enterprise/entities/Room'

export class InMemoryRoomsRepository implements RoomsRepository {
  public items: Room[] = []

  async findById(roomId: string) {
    const room = this.items.find((item) => item.id === roomId)

    if (!room) {
      return null
    }

    return room
  }

  async findByRoomName(roomName: string) {
    const room = this.items.filter((item) => item.name === roomName)

    return room
  }

  async findManyByUserId(userId: string) {
    const room = this.items.filter((item) => item.ownerId === userId)

    return room
  }

  async create(room: Room) {
    this.items.push(room)
  }

  async save(room: Room) {
    const index = this.items.findIndex((item) => item.id === room.id)

    this.items[index] = room
  }

  async delete(room: Room): Promise<void> {
    const index = this.items.findIndex((item) => item.id === room.id)

    this.items.splice(index, 1)
  }
}
