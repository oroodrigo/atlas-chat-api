import { UserRoom } from '@prisma/client'

export abstract class UsersRoomsRepository {
  abstract create(userRoom: UserRoom): Promise<void>
}
