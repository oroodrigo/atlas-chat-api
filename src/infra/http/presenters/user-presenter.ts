import { User } from '@/domain/enterprise/entities/user'

export class UserPresenter {
  static toHTTP(user: User) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      image_url: user.imageUrl ?? null,
      rooms: user.rooms,
      created_at: user.createdAt,
      updated_at: user.updatedAt,
    }
  }
}
