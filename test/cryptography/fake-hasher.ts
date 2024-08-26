import { HashComparer } from '@/domain/application/cryptography/hash-comparer'
import { HashGenerator } from '@/domain/application/cryptography/hash-generator'

export class FakeHasher implements HashGenerator, HashComparer {
  async hash(plainText: string) {
    return plainText.concat('-hashed')
  }

  async compare(plainText: string, hash: string) {
    return plainText.concat('-hashed') === hash
  }
}
