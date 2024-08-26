import { makeRoom } from 'test/factories/makeRooms'
import { makeUser } from 'test/factories/makeUser'
import { InMemoryRoomsRepository } from 'test/repositories/in-memory-rooms-repository'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'

import { FetchUserRoomsUseCase } from './fetch-user-rooms'

let inMemoryRoomsRepository: InMemoryRoomsRepository
let inMemoryUsersRepository: InMemoryUsersRepository
let sut: FetchUserRoomsUseCase

beforeEach(() => {
  inMemoryRoomsRepository = new InMemoryRoomsRepository()
  inMemoryUsersRepository = new InMemoryUsersRepository()

  sut = new FetchUserRoomsUseCase(
    inMemoryRoomsRepository,
    inMemoryUsersRepository,
  )
})

describe('Fetch User Rooms', () => {
  it('should be able to fetch user rooms', async () => {
    const user = makeUser({ id: 'custom-user-id-1' })
    const newRoom = makeRoom({ ownerId: user.id })
    const newRoom2 = makeRoom({ ownerId: user.id })

    await inMemoryUsersRepository.create(user)
    await inMemoryRoomsRepository.create(newRoom)
    await inMemoryRoomsRepository.create(newRoom2)

    const { rooms } = await sut.execute({
      userId: user.id,
    })

    expect(rooms).toHaveLength(2)
    expect(rooms).toEqual([newRoom, newRoom2])
  })
})
