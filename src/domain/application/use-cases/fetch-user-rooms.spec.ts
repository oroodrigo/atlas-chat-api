import { makeRoom } from 'test/factories/makeRooms'
import { makeUser } from 'test/factories/makeUser'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'

import { FetchUserRoomsUseCase } from './fetch-user-rooms'

let inMemoryUsersRepository: InMemoryUsersRepository
let sut: FetchUserRoomsUseCase

beforeEach(() => {
  inMemoryUsersRepository = new InMemoryUsersRepository()

  sut = new FetchUserRoomsUseCase(inMemoryUsersRepository)
})

describe('Fetch User Rooms', () => {
  it('should be able to fetch user rooms', async () => {
    const user = makeUser({ id: 'custom-user-id-1' })
    const newRoom = makeRoom({ ownerId: user.id })
    const newRoom2 = makeRoom({ ownerId: user.id })

    user.rooms = [newRoom, newRoom2]

    await inMemoryUsersRepository.create(user)

    const { rooms } = await sut.execute({
      userId: user.id,
    })

    console.log(rooms)

    expect(rooms).toHaveLength(2)
    expect(rooms).toEqual([newRoom, newRoom2])
  })
})
