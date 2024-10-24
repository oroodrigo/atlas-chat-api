import { makeRoom } from 'test/factories/makeRooms'
import { makeUser } from 'test/factories/makeUser'
import { InMemoryMessagesRepository } from 'test/repositories/in-memory-messages-repository'
import { InMemoryRoomsRepository } from 'test/repositories/in-memory-rooms-repository'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'

import { CreateMessageUseCase } from './create-message'

let inMemoryMessagesRepository: InMemoryMessagesRepository
let inMemoryRoomsRepository: InMemoryRoomsRepository
let inMemoryUsersRepository: InMemoryUsersRepository
let sut: CreateMessageUseCase

beforeEach(() => {
  inMemoryMessagesRepository = new InMemoryMessagesRepository()
  inMemoryRoomsRepository = new InMemoryRoomsRepository()
  inMemoryUsersRepository = new InMemoryUsersRepository()

  sut = new CreateMessageUseCase(
    inMemoryMessagesRepository,
    inMemoryUsersRepository,
    inMemoryRoomsRepository,
  )
})

describe('Create Message', () => {
  it('should be able to create a message', async () => {
    const user = makeUser()
    const room = makeRoom()

    await inMemoryUsersRepository.create(user)
    await inMemoryRoomsRepository.create(room)

    const { message } = await sut.execute({
      roomId: room.id,
      authorId: user.id,
      content: 'new message',
    })

    expect(inMemoryMessagesRepository.items[0]).toEqual(message)
    expect(inMemoryMessagesRepository.items[0].id).toBeTruthy()
    expect(inMemoryMessagesRepository.items).toHaveLength(1)
  })
})
