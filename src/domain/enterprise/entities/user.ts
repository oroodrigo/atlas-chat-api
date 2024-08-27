import { Optional } from '@/core/types/optional'

import { UserRoom } from './user-room'

export interface UserProps {
  id: string
  name: string
  email: string
  password: string
  rooms: UserRoom[]
  imageUrl?: string | null
  createdAt: Date
  updatedAt?: Date | null
}

export class User {
  private _id: string
  private _name: string
  private _email: string
  private _password: string
  private _rooms: UserRoom[]
  private _imageUrl?: string | null
  private _createdAt: Date
  private _updatedAt?: Date

  constructor(props: UserProps) {
    this._id = props.id
    this._email = props.email
    this._name = props.name
    this._password = props.password
    this._imageUrl = props.imageUrl
    this._rooms = props.rooms
    this._createdAt = props.createdAt
  }

  get id() {
    return this._id
  }

  get email() {
    return this._email
  }

  get name() {
    return this._name
  }

  get password() {
    return this._password
  }

  get imageUrl() {
    return this._imageUrl ?? ''
  }

  get rooms() {
    return this._rooms
  }

  get createdAt() {
    return this._createdAt
  }

  get updatedAt() {
    return this._updatedAt
  }

  // Setters

  set imageUrl(newProfilePicUrl: string) {
    this._imageUrl = newProfilePicUrl
    this.touch()
  }

  private touch() {
    this._updatedAt = new Date()
  }

  static create(
    props: Optional<
      UserProps,
      'createdAt' | 'imageUrl' | 'updatedAt' | 'rooms'
    >,
  ) {
    const user = new User({
      ...props,
      createdAt: props.createdAt ?? new Date(),
      rooms: props.rooms ?? [],
    })
    return user
  }
}
