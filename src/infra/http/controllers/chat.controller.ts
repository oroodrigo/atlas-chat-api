import { Controller, Get } from '@nestjs/common'

@Controller('/chat')
export class ChatController {
  @Get('/hello')
  hello() {
    return 'hello'
  }
}
