const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/users')
const { userOne, userOneId, setupDatabase} = require('./fixtures/db')

beforeEach(setupDatabase)

test('Should sign up a new user.', async () => {
    const response = await request(app).post('/users').send({
        name: 'Daniel Edington',
        email: 'dgedington@gmail.com',
        password: '11de784a',
        age: 52
    }).expect(201)
    
    // assert that the database was changed correctly.
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    // Assert about the response
    expect(response.body).toMatchObject({
        user: {
            name: 'Daniel Edington',
            email: 'dgedington@gmail.com'
        },
        token: user.tokens[0].token
    })
    expect(user.password).not.toBe('11de784a')
})

test('Should login existing user.', async () => {
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)

    // Assert about the response
    const user = await User.findById(userOneId)
    expect(user).not.toBeNull()

    expect(response.body.token).toBe(user.tokens[1].token)
})

test('Should not login non-existing user.', async () => {
    await request(app).post('/users/login').send({
        email: 'Jessica@example.com',
        password: 'Key3567!'
    }).expect(400)
})

test('Should get profile for user.', async () => {
    await request(app)
    .get('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
})

test('Should not get profile for unauthenticated user.', async () => {
    await request(app)
    .get('/users/me')
    .send()
    .expect(401)
})

test('Should delete profile for authenticated user.', async () => {
    await request(app)
    .delete('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)

    const user = await User.findById(userOneId)
    expect(user).toBeNull()
})

test('Should not delete profile for unauthenticated user.', async () => {
    await request(app)
    .delete('/users/me')
    .send()
    .expect(401)
})

test('Should upload image file to avatar field.', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar','tests/fixtures/profile-pic.jpg')
        .expect(200)
    
    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))    
})

test('Should update valid user name field', async () => {
    await request(app).patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
        name:'Daniel Edington',
        age:52
    })
    .expect(200)

    const user = await User.findById(userOneId)
    expect(user.name).toBe('Daniel Edington')
})

test('Should try to update invalid user field', async () => {
    await request(app).patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
        location:'Albuquerque'
    })
    .expect(400)
})