import { OnModuleInit } from '@nestjs/common'
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Server } from 'socket.io'

export type EventsKind =
  | 'user_connected'
  | 'user_disconnected'
  | 'new_room'
  | 'user_joined'
  | 'delete_room'
  | 'new_message'
  | 'delete_message'

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

  // Mapa para armazenar usuários conectados por sala
  private roomUsers: Map<string, Set<string>> = new Map()

  onModuleInit() {
    this.server.on('connection', (socket) => {
      socket.on('join_room', (roomId: string) => {
        this.addUserToRoom(roomId, socket.id)
      })

      socket.on('disconnect', () => {
        this.removeUserFromRooms(socket.id)
      })
    })
  }

  public addUserToRoom(roomId: string, userId: string) {
    if (!this.roomUsers.has(roomId)) {
      this.roomUsers.set(roomId, new Set())
    }
    this.roomUsers.get(roomId)?.add(userId)
  }

  public removeUserFromRooms(userId: string) {
    for (const [roomId, users] of this.roomUsers.entries()) {
      if (users.has(userId)) {
        users.delete(userId)
        this.server.to(roomId).emit('user_disconnected', { userId })
      }
      if (users.size === 0) {
        this.roomUsers.delete(roomId)
      }
    }
  }

  public deleteRoom(roomId: string) {
    this.roomUsers.delete(roomId)
  }

  public notifyUsersInRoom(roomId: string, event: EventsKind, data: unknown) {
    const users = this.roomUsers.get(roomId)
    if (users) {
      users.forEach((userId) => {
        this.server.to(userId).emit(event, data)
      })
    }
  }
}
