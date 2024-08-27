import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { User } from '@prisma/client'
import request from 'supertest'

import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('Chats Controller (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let user: User
  let accessToken: string

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    await app.init()

    user = await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: '123456',
      },
    })

    accessToken = jwt.sign({ sub: user.id })
  })

  let createdRoomId: string

  test('[POST] /chats', async () => {
    const response = await request(app.getHttpServer())
      .post('/chats')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'New Test Room',
      })

    createdRoomId = response.body.room.id

    expect(response.statusCode).toBe(201)
    expect(response.body).toMatchObject({
      room: expect.objectContaining({
        name: 'New Test Room',
        ownerId: user.id,
      }),
    })
  })

  test('[POST] /chats/:roomId/join', async () => {
    const user2 = await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'johndoe2@example.com',
        password: '123456',
      },
    })

    const accessToken = jwt.sign({ sub: user2.id })

    const response = await request(app.getHttpServer())
      .post(`/chats/${createdRoomId}/join`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(201)
  })

  test('[GET] /chats/:roomId', async () => {
    const response = await request(app.getHttpServer())
      .get(`/chats/${createdRoomId}`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(200)
    expect(response.body).toMatchObject({
      room: expect.objectContaining({
        name: 'New Test Room',
        id: createdRoomId,
      }),
    })
  })

  test('[GET] /chats?name=room%to%search', async () => {
    const response = await request(app.getHttpServer())
      .get(`/chats`)
      .query({ name: 'New Test Room' })
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(200)
    expect(response.body).toMatchObject({
      rooms: [expect.objectContaining({ name: 'New Test Room' })],
    })
  })

  test('[DELETE] /chats/:roomId', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/chats/${createdRoomId}`)
      .set('Authorization', `Bearer ${accessToken}`)

    const roomOnDatabase = await prisma.room.findUnique({
      where: {
        id: createdRoomId,
      },
    })

    expect(response.statusCode).toBe(200)
    expect(roomOnDatabase).toBe(null)
  })
})
