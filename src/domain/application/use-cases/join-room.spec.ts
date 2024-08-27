import { makeRoom } from 'test/factories/makeRooms'
import { makeUser } from 'test/factories/makeUser'
import { makeUserRoom } from 'test/factories/makeUserRoom'
import { InMemoryRoomsRepository } from 'test/repositories/in-memory-rooms-repository'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { InMemoryUsersRoomsRepository } from 'test/repositories/in-memory-users-rooms-repository'

import { JoinRoomUseCase } from './join-room'

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryRoomsRepository: InMemoryRoomsRepository
let inMemoryUsersRoomsRepository: InMemoryUsersRoomsRepository
let sut: JoinRoomUseCase

beforeEach(() => {
  inMemoryUsersRepository = new InMemoryUsersRepository()
  inMemoryRoomsRepository = new InMemoryRoomsRepository()
  inMemoryUsersRoomsRepository = new InMemoryUsersRoomsRepository()

  sut = new JoinRoomUseCase(
    inMemoryUsersRepository,
    inMemoryRoomsRepository,
    inMemoryUsersRoomsRepository,
  )
})

describe('Join Room', () => {
  it('should be able to add new room to user rooms list', async () => {
    const user = makeUser({ id: 'custom-user-id-1' })
    const newRoom = makeRoom({ ownerId: user.id, users: [] })
    const newRoom2 = makeRoom({ ownerId: 'some-other-user', users: [] })

    await inMemoryRoomsRepository.create(newRoom)
    await inMemoryRoomsRepository.create(newRoom2)

    // Creating relation
    const previewsRelation = makeUserRoom({
      userId: user.id,
      user,
      roomId: newRoom.id,
      room: newRoom,
    })

    user.rooms.push(previewsRelation)

    expect(user.rooms).toHaveLength(1)

    await inMemoryUsersRepository.create(user)

    const { userRoom } = await sut.execute({
      userId: user.id,
      roomId: newRoom2.id,
    })

    expect(user.rooms).toHaveLength(2)
    expect(user.rooms).toEqual([
      expect.objectContaining(previewsRelation),
      expect.objectContaining(userRoom),
    ])
  })
})
