import { Injectable } from '@nestjs/common'
import { compare, hash } from 'bcryptjs'

import { HashComparer } from '@/domain/application/cryptography/hash-comparer'
import { HashGenerator } from '@/domain/application/cryptography/hash-generator'

@Injectable()
export class BcryptHasher implements HashGenerator, HashComparer {
  private HASH_SALT_LENGTH = 8

  hash(plainText: string): Promise<string> {
    return hash(plainText, this.HASH_SALT_LENGTH)
  }

  compare(plainText: string, hash: string): Promise<boolean> {
    return compare(plainText, hash)
  }
}
