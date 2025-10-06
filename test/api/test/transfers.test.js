const request = require("supertest");
const { expect } = require("chai");
const { obterToken } = require("../helper/autenticacao.js");
const postTransferencias = require("../fixtures/postTransfers.json");
require("dotenv").config();

describe("POST /transfers", () => {
  let token;
  beforeEach(async () => {
    token = await obterToken("julio", 123456);
  });

  it("Deve retornar sucesso com 201 quando o valor da transferência for igual ou menor a R$ 5.000,00 e usuário está na lista de favorecidos", async () => {
    const bodyTransferencias = { ...postTransferencias };

    const response = await request(process.env.BASE_URL)
      .post("/transfers")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send(bodyTransferencias);

    expect(response.status).equal(201);
  });

  it("Deve retornar sucesso com 201 quando o valor da transferência for igual ou menor a R$ 5.000,00 e usuário não está na lista de favorecidos", async () => {
    const bodyTransferencias = { ...postTransferencias };
    bodyTransferencias.to = "maria";

    const response = await request(process.env.BASE_URL)
      .post("/transfers")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send(bodyTransferencias);

    expect(response.status).equal(201);
  });

  it("Deve retornar sucesso com 201 quando o valor da transferência for maior que R$ 5.000,00 e usuário está na lista de favorecidos", async () => {
    const bodyTransferencias = { ...postTransferencias };
    bodyTransferencias.value = 5001;

    const response = await request(process.env.BASE_URL)
      .post("/transfers")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send(bodyTransferencias);

    expect(response.status).equal(201);
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

    it("Deve retornar 400 quando o valor da transferência for inválido", async () => {
    const bodyTransferencias = { ...postTransferencias };
    bodyTransferencias.value = -100;

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
});
