import { MessagesRepository } from '@/domain/application/repositories/messages-repository'
import { Message } from '@/domain/enterprise/entities/message'

export class InMemoryMessagesRepository implements MessagesRepository {
  public items: Message[] = []

  async findById(messageId: string): Promise<Message | null> {
    const message = this.items.find((item) => item.id === messageId)

    if (!message) {
      return null
    }

    return message
  }

  async findManyByRoomId(roomId: string) {
    const messages = this.items.filter((item) => item.roomId === roomId)

    return messages
  }

  async create(message: Message) {
    this.items.push(message)
  }

  async save(message: Message): Promise<void> {
    const index = this.items.findIndex((item) => item.id === message.id)

    this.items[index] = message
  }

  async delete(message: Message): Promise<void> {
    const index = this.items.findIndex((item) => item.id === message.id)

    this.items.splice(index, 1)
  }
}
