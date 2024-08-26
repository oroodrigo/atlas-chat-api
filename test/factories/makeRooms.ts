import { faker } from '@faker-js/faker'
import { randomUUID } from 'crypto'

import { Room, RoomProps } from '@/domain/enterprise/entities/room'

export function makeRoom(override: Partial<RoomProps> = {}) {
  const room = Room.create({
    id: randomUUID(),
    name: faker.word.words(),
    ownerId: randomUUID(),
    ...override,
  })

  return room
}
