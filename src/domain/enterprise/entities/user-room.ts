import { Optional } from '@/core/types/optional'

import { Room } from './room'
import { User } from './user'

export interface UserRoomProps {
  id: string
  userId: string
  roomId: string
  joinedAt: Date
  user: User
  room: Room
}

export class UserRoom {
  private _id: string
  private _userId: string
  private _roomId: string
  private _joinedAt: Date
  private _user: User
  private _room: Room

  constructor(props: UserRoomProps) {
    this._id = props.id
    this._userId = props.userId
    this._roomId = props.roomId
    this._joinedAt = props.joinedAt
    this._user = props.user ?? null
    this._room = props.room ?? null
  }

  get id() {
    return this._id
  }

  get userId() {
    return this._userId
  }

  get roomId() {
    return this._roomId
  }

  get joinedAt() {
    return this._joinedAt
  }

  get user() {
    return this._user
  }

  get room() {
    return this._room
  }

  set room(room: Room) {
    this._room = room
  }

  static create(props: Optional<UserRoomProps, 'joinedAt'>): UserRoom {
    return new UserRoom({
      ...props,
      joinedAt: props.joinedAt ?? new Date(),
    })
  }
}
