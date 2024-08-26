import { makeMessage } from 'test/factories/makeMessage'
import { makeRoom } from 'test/factories/makeRooms'
import { InMemoryMessagesRepository } from 'test/repositories/in-memory-messages-repository'
import { InMemoryRoomsRepository } from 'test/repositories/in-memory-rooms-repository'

import { GetRoomMessagesUseCase } from './get-room-messages'

let inMemoryMessagesRepository: InMemoryMessagesRepository
let inMemoryRoomsRepository: InMemoryRoomsRepository
let sut: GetRoomMessagesUseCase

beforeEach(() => {
  inMemoryMessagesRepository = new InMemoryMessagesRepository()
  inMemoryRoomsRepository = new InMemoryRoomsRepository()
  sut = new GetRoomMessagesUseCase(
    inMemoryMessagesRepository,
    inMemoryRoomsRepository,
  )
})

describe('Get Room Messages', () => {
  it('should be able to get messages from a room', async () => {
    await inMemoryRoomsRepository.create(makeRoom({ id: 'room-1' }))

    await inMemoryMessagesRepository.create(
      makeMessage({
        id: 'message-1',
        roomId: 'room-1',
      }),
    )

    await inMemoryMessagesRepository.create(
      makeMessage({
        id: 'message-2',
        roomId: 'room-1',
      }),
    )

    const { messages } = await sut.execute({
      roomId: 'room-1',
    })

    expect(messages).toHaveLength(2)
    expect(messages).toEqual([
      expect.objectContaining({ _id: 'message-1' }),
      expect.objectContaining({ _id: 'message-2' }),
    ])
  })
})
