import { makeUser } from 'test/factories/makeUser'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'

import { GetProfileUseCase } from './get-profile'

let inMemoryUsersRepository: InMemoryUsersRepository

let sut: GetProfileUseCase

describe('Get Profile', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()

    sut = new GetProfileUseCase(inMemoryUsersRepository)
  })

  it('shoud be able to get user profile', async () => {
    const newUser = makeUser({
      id: 'custom-id-1',
    })
    await inMemoryUsersRepository.create(newUser)

    const { user } = await sut.execute({
      userId: newUser.id,
    })

    expect(user.id).toBeTruthy()
    expect(user).toEqual(inMemoryUsersRepository.items[0])
  })
})
