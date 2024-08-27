import { randomUUID } from 'crypto'

import { UserRoom, UserRoomProps } from '@/domain/enterprise/entities/user-room'

import { makeRoom } from './makeRooms'
import { makeUser } from './makeUser'

export function makeUserRoom(override: Partial<UserRoomProps> = {}) {
  const userRoom = UserRoom.create({
    id: randomUUID(),
    userId: 'standard-user-01',
    roomId: 'standard-room-01',
    room: makeRoom({ id: 'standard-room-01' }),
    user: makeUser({ id: 'standard-user-01' }),
    ...override,
  })

  return userRoom
}
