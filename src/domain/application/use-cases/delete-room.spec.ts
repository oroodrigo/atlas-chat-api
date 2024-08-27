import { makeRoom } from 'test/factories/makeRooms'
import { InMemoryRoomsRepository } from 'test/repositories/in-memory-rooms-repository'

import { DeleteRoomUseCase } from './delete-ROOM'
import { UnauthorizedError } from './errors/unauthorized-error'

let inMemoryRoomsRepository: InMemoryRoomsRepository
let sut: DeleteRoomUseCase

beforeEach(() => {
  inMemoryRoomsRepository = new InMemoryRoomsRepository()
  sut = new DeleteRoomUseCase(inMemoryRoomsRepository)
})

describe('Delete Room', () => {
  it('should be able to delete a room', async () => {
    const room = makeRoom({
      ownerId: 'user-id-1',
    })

    await inMemoryRoomsRepository.create(room)

    expect(inMemoryRoomsRepository.items).toHaveLength(1)
    expect(inMemoryRoomsRepository.items[0].id).toBeTruthy()

    await sut.execute({
      roomId: room.id,
      ownerId: 'user-id-1',
    })

    expect(inMemoryRoomsRepository.items).toHaveLength(0)
  })

  it('should not be able to delete a room from another user', async () => {
    const room = makeRoom({
      ownerId: 'user-id-1',
    })

    await inMemoryRoomsRepository.create(room)

    expect(inMemoryRoomsRepository.items).toHaveLength(1)
    expect(inMemoryRoomsRepository.items[0].id).toBeTruthy()

    expect(async () => {
      return await sut.execute({
        roomId: room.id,
        ownerId: 'user-id-2',
      })
    }).rejects.toBeInstanceOf(UnauthorizedError)
  })
})
