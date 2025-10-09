const request = require('supertest')
const { expect } = require('chai')
require('dotenv').config()

describe('Users', () => {
    describe('GET/users', () => {
        let resposta

        beforeEach(async () => {

            resposta = await request(process.env.BASE_URL)
                .get('/users')
        })

        it('Deve retornar 200 para sucesso na listagem de usuários', async () => {

            expect(resposta.status).to.be.equal(200)
        })

        it('Deve retornar um array na resposta', async () => {

            expect(resposta.body).to.be.an('array')
        })

        it('Cada usuário deve ter username, favorecidos (array) e saldo (number)', async () => {

            resposta.body.forEach(user => {
                expect(user).to.have.property('username').that.is.a('string')
                expect(user).to.have.property('saldo').that.is.a('number')
                expect(user).to.have.property('favorecidos').that.is.an('array')
                user.favorecidos.forEach(favorecido => {
                    expect(favorecido).to.be.a('string')
                })
            })
        })


    }
    )
})