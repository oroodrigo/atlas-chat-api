import { makeUser } from 'test/factories/makeUser'
import { InMemoryRoomsRepository } from 'test/repositories/in-memory-rooms-repository'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { InMemoryUsersRoomsRepository } from 'test/repositories/in-memory-users-rooms-repository'

import { CreateRoomUseCase } from './create-room'

let inMemoryRoomsRepository: InMemoryRoomsRepository
let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryUsersRoomsRepository: InMemoryUsersRoomsRepository
let sut: CreateRoomUseCase

beforeEach(() => {
  inMemoryRoomsRepository = new InMemoryRoomsRepository()
  inMemoryUsersRepository = new InMemoryUsersRepository()
  inMemoryUsersRoomsRepository = new InMemoryUsersRoomsRepository()

  sut = new CreateRoomUseCase(
    inMemoryRoomsRepository,
    inMemoryUsersRepository,
    inMemoryUsersRoomsRepository,
  )
})

describe('Create Room', () => {
  it('should be able to create a room', async () => {
    const user = makeUser({
      id: 'user-id-1',
    })

    await inMemoryUsersRepository.create(user)

    const { room } = await sut.execute({
      name: 'new-room-1',
      ownerId: user.id,
    })

    expect(inMemoryRoomsRepository.items[0]).toEqual(room)
    expect(inMemoryRoomsRepository.items[0].id).toBeTruthy()
    expect(inMemoryRoomsRepository.items[0].ownerId).toEqual('user-id-1')
    expect(inMemoryRoomsRepository.items).toHaveLength(1)
    expect(inMemoryUsersRepository.items[0].rooms[0]).toEqual(user.rooms[0])
  })
})
