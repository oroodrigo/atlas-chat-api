import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common'

import { AuthenticateUserUseCase } from '@/domain/application/use-cases/authenticate-user'
import { WrongCredentialsError } from '@/domain/application/use-cases/errors/wrong-credentials-error'
import { Public } from '@/infra/auth/public'

import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import {
  AuthenticateBodySchema,
  authenticateBodySchema,
} from './schemas/authenticate-schema'

@Controller('/sessions')
export class SessionsController {
  constructor(private authenticateUserUseCase: AuthenticateUserUseCase) {}

  @Post()
  @Public()
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async authenticate(@Body() body: AuthenticateBodySchema) {
    const { email, password } = body

    try {
      const { accessToken } = await this.authenticateUserUseCase.execute({
        email,
        password,
      })

      return { access_token: accessToken }
    } catch (error) {
      if (error instanceof WrongCredentialsError) {
        throw new UnauthorizedException(error.message)
      }

      throw new BadRequestException()
    }
  }
}
