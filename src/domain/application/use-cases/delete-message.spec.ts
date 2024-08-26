import { makeMessage } from 'test/factories/makeMessage'
import { makeRoom } from 'test/factories/makeRooms'
import { InMemoryMessagesRepository } from 'test/repositories/in-memory-messages-repository'

import { DeleteMessageUseCase } from './delete-message'

let inMemoryMessagesRepository: InMemoryMessagesRepository
let sut: DeleteMessageUseCase

beforeEach(() => {
  inMemoryMessagesRepository = new InMemoryMessagesRepository()
  sut = new DeleteMessageUseCase(inMemoryMessagesRepository)
})

describe('Delete Message', () => {
  it('should be able to delete a message', async () => {
    const room = makeRoom()
    const message = makeMessage({
      roomId: room.id,
      authorId: 'author-1',
    })

    await inMemoryMessagesRepository.create(message)

    expect(inMemoryMessagesRepository.items).toHaveLength(1)
    expect(inMemoryMessagesRepository.items[0]).toEqual(message)
    expect(inMemoryMessagesRepository.items[0].roomId).toEqual(room.id)

    await sut.execute({
      messageId: message.id,
      authorId: 'author-1',
    })

    expect(inMemoryMessagesRepository.items).toHaveLength(0)
  })

  it('should not be able to delete a message from another user', async () => {
    const room = makeRoom()
    const message = makeMessage({
      roomId: room.id,
      authorId: 'author-1',
    })

    await inMemoryMessagesRepository.create(message)

    expect(inMemoryMessagesRepository.items).toHaveLength(1)
    expect(inMemoryMessagesRepository.items[0]).toEqual(message)
    expect(inMemoryMessagesRepository.items[0].roomId).toEqual(room.id)

    expect(async () => {
      return await sut.execute({
        messageId: message.id,
        authorId: 'author-2',
      })
    }).rejects.toBeInstanceOf(Error)
    expect(inMemoryMessagesRepository.items).toHaveLength(1)
  })
})
