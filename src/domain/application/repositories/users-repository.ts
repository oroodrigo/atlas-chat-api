import { Room } from '@/domain/enterprise/entities/room'
import { User } from '@/domain/enterprise/entities/user'

export abstract class UsersRepository {
  abstract findById(userId: string): Promise<User | null>
  abstract findByEmail(userEmail: string): Promise<User | null>
  abstract findByUserName(userName: string): Promise<User[]>
  abstract fetchRooms(userId: string): Promise<Room[]>
  abstract create(user: User): Promise<void>
  abstract save(user: User): Promise<void>
  abstract delete(user: User): Promise<void>
}
