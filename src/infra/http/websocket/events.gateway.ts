import { OnModuleInit } from '@nestjs/common'
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Server } from 'socket.io'

export type EventsKind =
  | 'new_room'
  | 'user_joined'
  | 'new_message'
  | 'user_disconnected'
  | 'user_connected'
  | 'join'

type EmitEventsMap = {
  [K in EventsKind]: (data: unknown) => void
}

@WebSocketGateway({
  cors: {
    origin: true,
  },
})
export class EventsGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server<never, EmitEventsMap>

  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log(`Client connected, client id: ${socket.id}`)

      socket.broadcast.emit('user_connected', {
        userId: socket.id,
        message: `User with id ${socket.id} has connected.`,
      })

      socket.on('disconnect', (reason) => {
        console.log(
          `Client disconnected, client id: ${socket.id}, reason: ${reason}`,
        )

        socket.broadcast.emit('user_disconnected', {
          userId: socket.id,
          message: `User with id ${socket.id} has disconnected.`,
        })
      })
    })
  }
}
