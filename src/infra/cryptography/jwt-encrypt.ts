import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { Encrypter } from '@/domain/application/cryptography/encrypter'

@Injectable()
export class JwtEncrypter implements Encrypter {
  constructor(private JwtService: JwtService) {}

  encrypt(payload: Record<string, unknown>): Promise<string> {
    return this.JwtService.signAsync(payload, { expiresIn: '7d' })
  }
}
