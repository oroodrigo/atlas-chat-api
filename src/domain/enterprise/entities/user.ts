import { Optional } from '@/core/types/optional'

export interface UserProps {
  id: string
  name: string
  email: string
  password: string
  imageUrl?: string | null
  createdAt: Date
  updatedAt?: Date | null
}

export class User {
  private _id: string
  private _name: string
  private _email: string
  private _password: string
  private _imageUrl?: string | null
  private _createdAt: Date
  private _updatedAt?: Date

  constructor(props: UserProps) {
    this._id = props.id
    this._email = props.email
    this._name = props.name
    this._password = props.password
    this._imageUrl = props.imageUrl
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
    return this._imageUrl
  }

  get createdAt() {
    return this._createdAt
  }

  get updatedAt() {
    return this._updatedAt
  }

  private touch() {
    this._updatedAt = new Date()
  }

  static create(
    props: Optional<UserProps, 'createdAt' | 'imageUrl' | 'updatedAt'>,
  ) {
    const user = new User({
      ...props,
      createdAt: new Date(),
    })
    return user
  }
}
