import { User } from '@/domain/enterprise/entities/user'
import { UserRoom } from '@/domain/enterprise/entities/user-room'

export abstract class UsersRepository {
  abstract findById(userId: string): Promise<User | null>
  abstract findByEmail(userEmail: string): Promise<User | null>
  abstract findByUserName(userName: string): Promise<User[]>
  abstract fetchRooms(userId: string): Promise<UserRoom[]>
  abstract isUserInRoom(userId: string, roomId: string): Promise<boolean>
  abstract create(user: User): Promise<void>
  abstract save(user: User): Promise<void>
  abstract delete(user: User): Promise<void>
}
