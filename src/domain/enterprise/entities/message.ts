import { Optional } from '@/core/types/optional'

export interface MessageProps {
  id: string
  content: string
  authorId: string
  roomId: string
  timestamp: Date
}

export class Message {
  private _id: string
  private _content: string
  private _authorId: string
  private _roomId: string
  private _timestamp: Date

  constructor(props: MessageProps) {
    this._id = props.id
    this._content = props.content
    this._authorId = props.authorId
    this._roomId = props.roomId
    this._timestamp = props.timestamp
  }

  get id() {
    return this._id
  }

  get content() {
    return this._content
  }

  get authorId() {
    return this._authorId
  }

  get roomId() {
    return this._roomId
  }

  get timestamp() {
    return this._timestamp
  }

  static create(props: Optional<MessageProps, 'timestamp'>) {
    const message = new Message({
      ...props,
      timestamp: new Date(),
    })

    return message
  }
}
