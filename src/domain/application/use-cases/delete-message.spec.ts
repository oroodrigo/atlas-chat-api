import { makeMessage } from 'test/factories/makeMessage'
import { makeRoom } from 'test/factories/makeRooms'
import { InMemoryMessagesRepository } from 'test/repositories/in-memory-messages-repository'
import { InMemoryRoomsRepository } from 'test/repositories/in-memory-rooms-repository'

import { DeleteMessageUseCase } from './delete-message'
import { UnauthorizedError } from './errors/unauthorized-error'

let inMemoryMessagesRepository: InMemoryMessagesRepository
let inMemoryRoomsRepository: InMemoryRoomsRepository
let sut: DeleteMessageUseCase

beforeEach(() => {
  inMemoryMessagesRepository = new InMemoryMessagesRepository()
  inMemoryRoomsRepository = new InMemoryRoomsRepository()
  sut = new DeleteMessageUseCase(
    inMemoryMessagesRepository,
    inMemoryRoomsRepository,
  )
})

describe('Delete Message', () => {
  it('should be able to delete a message', async () => {
    const room = makeRoom()
    const message = makeMessage({
      roomId: room.id,
      authorId: 'author-1',
    })

    await inMemoryRoomsRepository.create(room)
    await inMemoryMessagesRepository.create(message)

    expect(inMemoryMessagesRepository.items).toHaveLength(1)
    expect(inMemoryMessagesRepository.items[0]).toEqual(message)
    expect(inMemoryMessagesRepository.items[0].roomId).toEqual(room.id)

    await sut.execute({
      messageId: message.id,
      authorId: 'author-1',
      roomId: room.id,
    })

    expect(inMemoryMessagesRepository.items).toHaveLength(0)
  })

  it('should not be able to delete a message from another user', async () => {
    const room = makeRoom()
    const message = makeMessage({
      roomId: room.id,
      authorId: 'author-1',
    })

    await inMemoryRoomsRepository.create(room)
    await inMemoryMessagesRepository.create(message)

    expect(inMemoryMessagesRepository.items).toHaveLength(1)
    expect(inMemoryMessagesRepository.items[0]).toEqual(message)
    expect(inMemoryMessagesRepository.items[0].roomId).toEqual(room.id)

    expect(async () => {
      return await sut.execute({
        messageId: message.id,
        authorId: 'author-2',
        roomId: room.id,
      })
    }).rejects.toBeInstanceOf(UnauthorizedError)
    expect(inMemoryMessagesRepository.items).toHaveLength(1)
  })
})
