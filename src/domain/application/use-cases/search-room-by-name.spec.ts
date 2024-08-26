import { makeRoom } from 'test/factories/makeRooms'
import { InMemoryRoomsRepository } from 'test/repositories/in-memory-rooms-repository'

import { SearchRoomsByNameUseCase } from './search-rooms-by-name'

let inMemoryRoomsRepository: InMemoryRoomsRepository
let sut: SearchRoomsByNameUseCase

beforeEach(() => {
  inMemoryRoomsRepository = new InMemoryRoomsRepository()

  sut = new SearchRoomsByNameUseCase(inMemoryRoomsRepository)
})

describe('Search Rooms By Name', () => {
  it('should be able to search rooms a given by name', async () => {
    await inMemoryRoomsRepository.create(
      makeRoom({ name: 'room with same name' }),
    )
    await inMemoryRoomsRepository.create(
      makeRoom({ name: 'room with same name' }),
    )

    const { rooms } = await sut.execute({
      roomName: 'room with same name',
    })

    expect(rooms).toHaveLength(2)
    expect(rooms).toEqual([
      expect.objectContaining({ _name: 'room with same name' }),
      expect.objectContaining({ _name: 'room with same name' }),
    ])
  })
})
