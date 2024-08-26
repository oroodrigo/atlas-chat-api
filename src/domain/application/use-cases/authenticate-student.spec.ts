import { FakeEncrypter } from 'test/cryptography/fake-encrypter'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { makeUser } from 'test/factories/makeUser'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'

import { AuthenticateUserUseCase } from './authenticate-user'

let inMemoryUsersRepository: InMemoryUsersRepository
let fakeHasher: FakeHasher
let fakeEncrypter: FakeEncrypter

let sut: AuthenticateUserUseCase

describe('Authenticate Student', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    fakeHasher = new FakeHasher()
    fakeEncrypter = new FakeEncrypter()

    sut = new AuthenticateUserUseCase(
      inMemoryUsersRepository,
      fakeHasher,
      fakeEncrypter,
    )
  })

  it('shoud be able to authenticate a student', async () => {
    await inMemoryUsersRepository.create(
      makeUser({
        email: 'johndoe@example.com',
        password: await fakeHasher.hash('123456'),
      }),
    )

    const { accessToken } = await sut.execute({
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(accessToken).toEqual(expect.any(String))
  })
})
