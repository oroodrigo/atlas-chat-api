import { faker } from '@faker-js/faker'
import { randomUUID } from 'crypto'

import { User, UserProps } from '@/domain/enterprise/entities/user'

export function makeUser(override: Partial<UserProps> = {}) {
  const user = User.create({
    id: randomUUID(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    ...override,
  })

  return user
}
