import { MessagesRepository } from '../repositories/messages-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { UnauthorizedError } from './errors/unauthorized-error'

interface DeleteMessageUseCaseRequest {
  messageId: string
  authorId: string
}

export class DeleteMessageUseCase {
  constructor(private messagesRepository: MessagesRepository) {}

  async execute({ messageId, authorId }: DeleteMessageUseCaseRequest) {
    const message = await this.messagesRepository.findById(messageId)

    if (!message) {
      throw new ResourceNotFoundError()
    }

    if (message.authorId !== authorId) {
      throw new UnauthorizedError()
    }

    await this.messagesRepository.delete(message)
  }
}
