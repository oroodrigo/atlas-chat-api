import { makeRoom } from 'test/factories/makeRooms'
import { InMemoryMessagesRepository } from 'test/repositories/in-memory-messages-repository'
import { InMemoryRoomsRepository } from 'test/repositories/in-memory-rooms-repository'

import { CreateMessageUseCase } from './create-message'

let inMemoryMessagesRepository: InMemoryMessagesRepository
let inMemoryRoomsRepository: InMemoryRoomsRepository
let sut: CreateMessageUseCase

beforeEach(() => {
  inMemoryMessagesRepository = new InMemoryMessagesRepository()
  inMemoryRoomsRepository = new InMemoryRoomsRepository()
  sut = new CreateMessageUseCase(
    inMemoryMessagesRepository,
    inMemoryRoomsRepository,
  )
})

describe('Create Message', () => {
  it('should be able to create a message', async () => {
    const room = makeRoom()

    await inMemoryRoomsRepository.create(room)

    const { message } = await sut.execute({
      roomId: room.id,
      authorId: 'custom-author-1',
      content: 'new message',
    })

    expect(inMemoryMessagesRepository.items[0]).toEqual(message)
    expect(inMemoryMessagesRepository.items[0].id).toBeTruthy()
    expect(inMemoryMessagesRepository.items).toHaveLength(1)
  })
})
