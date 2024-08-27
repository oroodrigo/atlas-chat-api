import { UseCaseError } from '@/core/errors/use-case-error'

export class UserAlreadyInChatRoomError extends Error implements UseCaseError {
  constructor() {
    super('User alrealdy in this chat room.')
  }
}
