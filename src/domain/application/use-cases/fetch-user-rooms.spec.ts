import { makeRoom } from 'test/factories/makeRooms'
import { makeUser } from 'test/factories/makeUser'
import { makeUserRoom } from 'test/factories/makeUserRoom'
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
    const newRoom = makeRoom({ ownerId: user.id, users: [] })
    const newRoom2 = makeRoom({ ownerId: user.id, users: [] })

    // Creating relation
    const userRoom1 = makeUserRoom({
      userId: user.id,
      user,
      roomId: newRoom.id,
      room: newRoom,
    })

    const userRoom2 = makeUserRoom({
      userId: user.id,
      user,
      roomId: newRoom2.id,
      room: newRoom2,
    })

    user.rooms.push(userRoom1, userRoom2)

    await inMemoryUsersRepository.create(user)

    const { rooms } = await sut.execute({
      userId: user.id,
    })

    expect(rooms).toHaveLength(2)
    expect(rooms).toEqual([userRoom1.room, userRoom2.room])
  })
})
