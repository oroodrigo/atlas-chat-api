export abstract class HashComparer {
  abstract compare(plainText: string, hash: string): Promise<boolean>
}
