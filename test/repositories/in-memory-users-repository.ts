import { UsersRepository } from '@/domain/application/repositories/users-repository'
import { User } from '@/domain/enterprise/entities/User'

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = []

  async findById(userId: string) {
    const user = this.items.find((item) => item.id === userId)

    if (!user) {
      return null
    }

    return user
  }

  async findByEmail(userEmail: string) {
    const user = this.items.find((item) => item.email === userEmail)

    if (!user) {
      return null
    }

    return user
  }

  async findByUserName(userName: string) {
    const user = this.items.filter((item) => item.name === userName)

    return user
  }

  async fetchRooms(userId: string) {
    const user = this.items.find((user) => user.id === userId)

    if (!user) {
      return []
    }

    return user.rooms
  }

  async isUserInRoom(userId: string, roomId: string) {
    const user = this.items.find((user) => user.id === userId)

    if (!user) {
      return false
    }

    return user.rooms.some((room) => room.id === roomId)
  }

  async create(user: User) {
    this.items.push(user)
  }

  async save(user: User) {
    const index = this.items.findIndex((item) => item.email === user.email)

    this.items[index] = user
  }

  async delete(user: User): Promise<void> {
    const index = this.items.findIndex((item) => item.email === user.email)

    this.items.splice(index, 1)
  }
}
