const request = require("supertest");
const { expect } = require("chai");
const { obterToken } = require("../helper/autenticacao.js");
const postTransferencias = require("../fixtures/postTransfers.json");
require("dotenv").config();

describe("Transferências", () => {
  let token;
  beforeEach(async () => {
    token = await obterToken("julio", 123456);
  });

  describe("POST /transfers", () => {
    it("Deve retornar sucesso com 201 quando o valor da transferência for <= R$ 5.000,00 e usuário está na lista de favorecidos", async () => {
      const bodyTransferencias = { ...postTransferencias };

      const response = await request(process.env.BASE_URL)
        .post("/transfers")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send(bodyTransferencias);

      expect(response.status).equal(201);
    });

    it("Deve retornar sucesso com 201 quando o valor da transferência for <= R$ 5.000,00 e usuário não está na lista de favorecidos", async () => {
      const bodyTransferencias = { ...postTransferencias };
      bodyTransferencias.to = "maria";

      const response = await request(process.env.BASE_URL)
        .post("/transfers")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send(bodyTransferencias);

      expect(response.status).equal(201);
    });

    it("Deve retornar sucesso com 201 quando o valor da transferência for > R$ 5.000,00 e usuário está na lista de favorecidos", async () => {
      const bodyTransferencias = { ...postTransferencias };
      bodyTransferencias.value = 5001;

      const response = await request(process.env.BASE_URL)
        .post("/transfers")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send(bodyTransferencias);

      expect(response.status).equal(201);
    });

    it("Deve retornar um corpo de resposta válido quando a transferência tiver sucesso com código 201", async () => {
      const bodyTransferencias = { ...postTransferencias };

      const response = await request(process.env.BASE_URL)
        .post("/transfers")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send(bodyTransferencias);

      console.log(response.body);

      expect(response.status).equal(201);
      expect(response.body).to.have.property("from");
      expect(response.body).to.have.property("to");
      expect(response.body).to.have.property("value");
      expect(response.body).to.have.property("date");
    });

    it("Deve retornar 400 quando o valor da transferência for maior que R$ 5.000,00 e usuário não está na lista de favorecidos", async () => {
      const bodyTransferencias = { ...postTransferencias };
      bodyTransferencias.to = "maria";
      bodyTransferencias.value = 5001;

      const response = await request(process.env.BASE_URL)
        .post("/transfers")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send(bodyTransferencias);

      expect(response.status).equal(400);
    });

    it("Deve retornar 400 quando o valor da transferência for maior que o saldo da conta", async () => {
      const bodyTransferencias = { ...postTransferencias };
      bodyTransferencias.value = 11000;

      const response = await request(process.env.BASE_URL)
        .post("/transfers")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send(bodyTransferencias);

      expect(response.status).equal(400);
    });

    it("Deve retornar 400 quando o valor da transferência for igual a zero", async () => {
      const bodyTransferencias = { ...postTransferencias };
      bodyTransferencias.value = 0;

      const response = await request(process.env.BASE_URL)
        .post("/transfers")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send(bodyTransferencias);

      expect(response.status).equal(400);
    });

    it("Deve retornar 400 quando o valor da transferência for negativo", async () => {
      const bodyTransferencias = { ...postTransferencias };
      bodyTransferencias.value = -100;

      const response = await request(process.env.BASE_URL)
        .post("/transfers")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send(bodyTransferencias);

      expect(response.status).equal(400);
    });

    it("Deve retornar 400 quando a transferência for feita entre o mesmo usuário", async () => {
      const bodyTransferencias = { ...postTransferencias };
      bodyTransferencias.to = "julio";

      const response = await request(process.env.BASE_URL)
        .post("/transfers")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send(bodyTransferencias);

      expect(response.status).equal(400);
    });

    it("Deve retornar 400 quando a transferência for feita para usuário inexistente", async () => {
      const bodyTransferencias = { ...postTransferencias };
      bodyTransferencias.to = "usuarioInexistente";

      const response = await request(process.env.BASE_URL)
        .post("/transfers")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send(bodyTransferencias);

      expect(response.status).equal(400);
    });

    it("Deve retornar 400 quando o campo 'to' for vazio ", async () => {
      const bodyTransferencias = { ...postTransferencias };
      bodyTransferencias.to = "";

      const response = await request(process.env.BASE_URL)
        .post("/transfers")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send(bodyTransferencias);

      expect(response.status).equal(400);
    });

    it("Deve retornar 400 quando o campo 'from' for vazio ", async () => {
      const bodyTransferencias = { ...postTransferencias };
      bodyTransferencias.from = "";

      const response = await request(process.env.BASE_URL)
        .post("/transfers")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send(bodyTransferencias);

      expect(response.status).equal(400);
    });

    it("Deve retornar 400 quando o campo 'value' for vazio", async () => {
      const bodyTransferencias = { ...postTransferencias };
      bodyTransferencias.value = "";

      const response = await request(process.env.BASE_URL)
        .post("/transfers")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send(bodyTransferencias);

      expect(response.status).equal(400);
    });

    it("Deve retornar 400 quando o campo 'to' for um number", async () => {
      const bodyTransferencias = { ...postTransferencias };
      bodyTransferencias.to = 1234;

      const response = await request(process.env.BASE_URL)
        .post("/transfers")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send(bodyTransferencias);

      expect(response.status).equal(400);
    });

    it("Deve retornar 400 quando o campo 'from' for um number", async () => {
      const bodyTransferencias = { ...postTransferencias };
      bodyTransferencias.from = 1234;

      const response = await request(process.env.BASE_URL)
        .post("/transfers")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send(bodyTransferencias);

      expect(response.status).equal(400);
    });

    it("Deve retornar 400 quando o campo 'value' for uma string", async () => {
      const bodyTransferencias = { ...postTransferencias };
      bodyTransferencias.value = "1000";

      const response = await request(process.env.BASE_URL)
        .post("/transfers")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send(bodyTransferencias);

      expect(response.status).equal(400);
    });

    it("Deve retornar 401 quando token não for fornecido", async () => {
      const bodyTransferencias = { ...postTransferencias };
      const tokenVazio = "";

      const response = await request(process.env.BASE_URL)
        .post("/transfers")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${tokenVazio}`)
        .send(bodyTransferencias);

      expect(response.status).equal(401);
    });

    it("Deve retornar 401 quando token inválido for fornecido", async () => {
      const bodyTransferencias = { ...postTransferencias };
      const tokenInválido = "token_invalido";

      const response = await request(process.env.BASE_URL)
        .post("/transfers")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${tokenInválido}`)
        .send(bodyTransferencias);

      expect(response.status).equal(401);
    });
  });

  describe("GET /transfers", () => {
    it("Deve retornar sucesso com 200", async () => {
      const response = await request(process.env.BASE_URL)
      .get("/transfers")
      .set('Authorization', `Bearer ${token}`)
      
      expect(response.status).to.equal(200)
    });
  });

});
