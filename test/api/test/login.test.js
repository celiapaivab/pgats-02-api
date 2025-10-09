const request = require('supertest')
const { expect, assert } = require('chai')
const postLogin = require('../fixtures/postLogin.json')
require('dotenv').config()

describe('Login', () => {

    async function fazerLogin(dados) {
        return await request(process.env.BASE_URL)
            .post('/users/login')
            //.set('Content-Type', 'application/json')
            .send(dados)
    }

    describe('POST/login', () => {
        let bodyLogin
        let resposta

        beforeEach(async () => {
            bodyLogin = { ...postLogin }
            resposta = await fazerLogin(bodyLogin)
        })

        it('Deve retornar 200 com uso de credenciais válidas', async () => {

            expect(resposta.status).to.be.equal(200)
        })

        it('Deve retornar: user, token na resposta', async () => {

            expect(resposta.body).to.have.property('user')
            expect(resposta.body).to.have.property('token')
        })

        it('Deve retornar um objeto no user com propriedades: username, favorecido, saldo', async () => {

            expect(resposta.body.user).to.have.property('username')
            expect(resposta.body.user).to.have.property('favorecidos')
            expect(resposta.body.user).to.have.property('saldo')
        })

        it('Deve garantir tipos corretos dos campos retornados no login', async () => {

            assert.typeOf(resposta.body.user.saldo, 'number')
            expect(resposta.body.user.username).to.be.a('string')
            expect(resposta.body.token).to.be.a('string')
            expect(resposta.body.user).to.be.a('object')
            resposta.body.user.favorecidos.forEach(fav => {
                expect(fav).to.be.a('string')
            })
        })

        it('Deve retornar 400 com usuário inválido', async () => {

            const respostaErro = await fazerLogin({ ...bodyLogin, username: 'usuarioInvalido' })
            expect(respostaErro.status).to.be.equal(400)
        })

        it('Deve retornar 400 com senha inválido', async () => {

            const respostaErro = await fazerLogin({ ...bodyLogin, password: 'senhaInvalida' })
            expect(respostaErro.status).to.be.equal(400)
        })

        it('Deve retornar erro de usuário não encontrado', async () => {

            const respostaErro = await fazerLogin({ ...bodyLogin, username: 'usuarioInvalido' })
            expect(respostaErro.body.error).to.be.equal('Usuário não encontrado')
        })

        it('Deve retornar erro de senha inválida', async () => {

            const respostaErro = await fazerLogin({ ...bodyLogin, password: 'senhaInvalida' })
            expect(respostaErro.body.error).to.be.equal('Senha inválida')
        })
    }
    )
})
