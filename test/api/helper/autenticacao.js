const request = require('supertest')
const postLogin = require('../fixtures/postLogin.json');

const obterToken = async (username, password) => {
    const bodyLogin = { ...postLogin }
    
    const respostaLogin = await request('http://localhost:3000')
        .post('/users/login')
        .set('Content-Type', 'application/json')
        .send(bodyLogin)
    return respostaLogin.body.token 
}

module.exports = {
    obterToken
}