import { Optional } from '@/core/types/optional'

export interface RoomProps {
  id: string
  name: string
  ownerId: string
  imageUrl?: string | null
  createdAt: Date
  updatedAt?: Date | null
}

export class Room {
  private _id: string
  private _name: string
  private _ownerId: string
  private _imageUrl?: string | null
  private _createdAt: Date
  private _updatedAt?: Date

  constructor(props: RoomProps) {
    this._id = props.id
    this._name = props.name
    this._imageUrl = props.imageUrl
    this._createdAt = props.createdAt
    this._ownerId = props.ownerId
  }

  get id() {
    return this._id
  }

  get name() {
    return this._name
  }

  get ownerId() {
    return this._ownerId
  }

  get imageUrl(): string | null | undefined {
    return this._imageUrl
  }

  get createdAt() {
    return this._createdAt
  }

  get updatedAt() {
    return this._updatedAt
  }

  // Setters

  set name(newName: string) {
    this._name = newName
    this.touch()
  }

  set imageUrl(newImageUrl: string) {
    this._imageUrl = newImageUrl
    this.touch()
  }

  private touch() {
    this._updatedAt = new Date()
  }

  static create(props: Optional<RoomProps, 'createdAt'>) {
    const room = new Room({ ...props, createdAt: new Date() })

    return room
  }
}
