const request = require('supertest')
const { expect, assert } = require('chai')
const postLogin = require('../fixtures/postLogin.json')
require('dotenv').config()

describe('Login', () => {

    async function fazerLogin(dados) {
        return await request(process.env.BASE_URL)
            .post('/users/login')
            //.set('Content-Type', 'application/json')
            .send(dados);
    };

    describe('POST/login', () => {
        let bodyLogin;
        let response;

        beforeEach(async () => {
            bodyLogin = { ...postLogin };
            response = await fazerLogin(bodyLogin);
        });

        it('Deve retornar 200 com uso de credenciais válidas', async () => {

            expect(response.status).to.be.equal(200);
        });

        it('Deve retornar: user, token na response', async () => {

            expect(response.body).to.have.property('user');
            expect(response.body).to.have.property('token');
        });

        it('Deve retornar um objeto no user com propriedades: username, favorecido, saldo', async () => {

            expect(response.body.user).to.have.property('username');
            expect(response.body.user).to.have.property('favorecidos');
            expect(response.body.user).to.have.property('saldo');
        });

        it('Deve garantir tipos corretos dos campos retornados no login', async () => {

            assert.typeOf(response.body.user.saldo, 'number');
            expect(response.body.user.username).to.be.a('string');
            expect(response.body.token).to.be.a('string');
            expect(response.body.user).to.be.a('object');
            response.body.user.favorecidos.forEach(fav => {
                expect(fav).to.be.a('string');
            });
        })

        it('Deve retornar 400 com usuário inválido com mensagem de erro de usuário não encontrado', async () => {

            const responseErro = await fazerLogin({ ...bodyLogin, username: 'usuarioInvalido' });
            expect(responseErro.status).to.be.equal(400);
            expect(responseErro.body.error).to.be.equal('Usuário não encontrado');
        });

        it('Deve retornar 400 com senha inválido com erro de senha inválida', async () => {

            const responseErro = await fazerLogin({ ...bodyLogin, password: 'senhaInvalida' });
            expect(responseErro.status).to.be.equal(400);
            expect(responseErro.body.error).to.be.equal('Senha inválida');
        });

        it('Deve retornar 400 com senha em branco com mensagem de erro: Usuário e senha obrigatórios', async () => {

            const responseErroSenha = await fazerLogin({ ...bodyLogin, password: '' });
            expect(responseErroSenha.status).to.be.equal(400);
            expect(responseErroSenha.body.error).to.be.equal('Usuário e senha obrigatórios');

        })

        it('Deve retornar 400 com usuário em branco com mensagem de erro: Usuário e senha obrigatórios', async () => {

            const responseErroUsuario = await fazerLogin({ ...bodyLogin, username: '' });
            expect(responseErroUsuario.status).to.be.equal(400);
            expect(responseErroUsuario.body.error).to.be.equal('Usuário e senha obrigatórios');
        })
    })
})

