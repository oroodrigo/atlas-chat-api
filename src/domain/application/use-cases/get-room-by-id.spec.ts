import { makeRoom } from 'test/factories/makeRooms'
import { InMemoryRoomsRepository } from 'test/repositories/in-memory-rooms-repository'

import { GetRoomByIdUseCase } from './get-room-by-id'

let inMemoryRoomsRepository: InMemoryRoomsRepository
let sut: GetRoomByIdUseCase

beforeEach(() => {
  inMemoryRoomsRepository = new InMemoryRoomsRepository()

  sut = new GetRoomByIdUseCase(inMemoryRoomsRepository)
})

describe('Get Room By Id', () => {
  it('should be able to get a room by id', async () => {
    const newRoom = makeRoom()

    await inMemoryRoomsRepository.create(newRoom)

    const { room } = await sut.execute({
      roomId: newRoom.id,
    })

    expect(room.id).toEqual(newRoom.id)
  })
})
