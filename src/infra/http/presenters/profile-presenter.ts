import { User } from '@/domain/enterprise/entities/user'

export class ProfilePresenter {
  static toHTTP(user: User) {
    return {
      id: user.id.toString(),
      name: user.name,
      email: user.email,
      imageUrl: user.imageUrl ?? null,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }
  }
}
