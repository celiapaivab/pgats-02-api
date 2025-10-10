const request = require('supertest')
const { expect } = require('chai')
require('dotenv').config()

describe('Users', () => {
    describe('GET/users', () => {
        let response;

        beforeEach(async () => {

            response = await request(process.env.BASE_URL)
                .get('/users');
        });

        it('should return 200 for sucess in returning the Users list', async () => {

            expect(response.status).to.be.equal(200);
        });

        it('should have an array in the response', async () => {

            expect(response.body).to.be.an('array');
        })

        it('should have username, favorecidos (array) e saldo (number) for each User', async () => {

            response.body.forEach(user => {
                expect(user).to.have.property('username').that.is.a('string');
                expect(user).to.have.property('saldo').that.is.a('number');
                expect(user).to.have.property('favorecidos').that.is.an('array');
                user.favorecidos.forEach(favorecido => {
                    expect(favorecido).to.be.a('string');
                });
            });
        });
    });
});