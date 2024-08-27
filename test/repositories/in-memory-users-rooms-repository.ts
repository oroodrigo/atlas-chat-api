import { UserRoom } from '@prisma/client'

import { UsersRoomsRepository } from '@/domain/application/repositories/users-rooms-repository'

export class InMemoryUsersRoomsRepository implements UsersRoomsRepository {
  public items: UserRoom[] = []
  async create(userRoom: UserRoom) {
    this.items.push(userRoom)
  }
}
