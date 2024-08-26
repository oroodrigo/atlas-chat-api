import { InMemoryRoomsRepository } from 'test/repositories/in-memory-rooms-repository'

import { CreateRoomUseCase } from './create-room'

let inMemoryRoomsRepository: InMemoryRoomsRepository
let sut: CreateRoomUseCase

beforeEach(() => {
  inMemoryRoomsRepository = new InMemoryRoomsRepository()
  sut = new CreateRoomUseCase(inMemoryRoomsRepository)
})

describe('Create Room', () => {
  it('should be able to create a room', async () => {
    const { room } = await sut.execute({
      name: 'new-room-1',
      ownerId: 'user-id-1',
    })

    expect(inMemoryRoomsRepository.items[0]).toEqual(room)
    expect(inMemoryRoomsRepository.items[0].id).toBeTruthy()
    expect(inMemoryRoomsRepository.items[0].ownerId).toEqual('user-id-1')
    expect(inMemoryRoomsRepository.items).toHaveLength(1)
  })
})
