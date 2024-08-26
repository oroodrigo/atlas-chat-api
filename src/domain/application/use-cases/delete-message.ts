import { MessagesRepository } from '../repositories/messages-repository'

interface DeleteMessageUseCaseRequest {
  messageId: string
  authorId: string
}

export class DeleteMessageUseCase {
  constructor(private messagesRepository: MessagesRepository) {}

  async execute({ messageId, authorId }: DeleteMessageUseCaseRequest) {
    const message = await this.messagesRepository.findById(messageId)

    if (!message) {
      throw new Error('Resource not found.')
    }

    if (message.authorId !== authorId) {
      throw new Error('Not allowed.')
    }

    await this.messagesRepository.delete(message)
  }
}
