import { faker } from '@faker-js/faker'
import { randomUUID } from 'crypto'

import { Message, MessageProps } from '@/domain/enterprise/entities/message'

export function makeMessage(override: Partial<MessageProps> = {}) {
  const message = Message.create({
    id: randomUUID(),
    authorId: randomUUID(),
    roomId: randomUUID(),
    content: faker.lorem.text(),
    ...override,
  })

  return message
}
