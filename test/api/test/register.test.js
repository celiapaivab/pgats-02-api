const request = require('supertest');
const { expect } = require('chai')
const postUser = require('../../../fixtures/postUser.json')
const postLogin = require('../fixtures/postLogin.json')

describe('Register', () => {

    describe('POST', () => {
        it('Must register a new user', async () => {
            // Gera username único para cada teste
            const postUser = {
                "username": `julio_${Date.now()}`,
                "password": "123456"
            };
            const resposta = await request("http://localhost:3000")
                .post('/users/register')
                .set('Content-Type', 'application/json')
                .send(postUser)

            expect(resposta.status).to.equal(201);
            expect(resposta.body).to.be.a('object');
            expect(resposta.body).to.have.property('username', postUser.username);
        })

        it('Validate already registered user error', async () => {
            const login = { ...postLogin }
            const resposta = await request("http://localhost:3000")
                .post('/users/register')
                .set('Content-Type', 'application/json')
                .send(login)

            expect(resposta.status).to.equal(400);
        })

        it('Validate error without filling in password and username', async () => {
            const postUser = {
                "username": "",
                "password": ""
            };
            const resposta = await request("http://localhost:3000")
                .post('/users/register')
                .set('Content-Type', 'application/json')
                .send(postUser)

            expect(resposta.status).to.equal(400);
        })

        it('Validate error only by filling in username', async () => {
            const postUser = {
                "username": "maca",
                "password": ""
            };
            const resposta = await request("http://localhost:3000")
                .post('/users/register')
                .set('Content-Type', 'application/json')
                .send(postUser)

            expect(resposta.status).to.equal(400);
        })

        it('Validate error only by filling in password', async () => {
            const postUser = {
                "username": "",
                "password": "maca"
            };
            const resposta = await request("http://localhost:3000")
                .post('/users/register')
                .set('Content-Type', 'application/json')
                .send(postUser)

            expect(resposta.status).to.equal(400);
        })
    })
})