import { Prisma, User as PrismaUser } from '@prisma/client'

import { User } from '@/domain/enterprise/entities/user'

export class PrismaUserMapper {
  static toDomain(raw: PrismaUser): User {
    return User.create({
      id: raw.id,
      name: raw.name,
      email: raw.email,
      password: raw.password,
      imageUrl: raw.imageUrl,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    })
  }

  static toPrisma(user: User): Prisma.UserUncheckedCreateInput {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
    }
  }
}
