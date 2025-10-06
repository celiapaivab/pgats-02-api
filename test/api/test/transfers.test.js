const request = require("supertest");
const { expect } = require("chai");
const { obterToken } = require("../helper/autenticacao.js");
const postTransferencias = require("../fixtures/postTransfers.json");
require("dotenv").config();

describe("POST /transfers", () => {
  let token;
  beforeEach(async () => {
    token = await obterToken("julio", 123456);

    console.log("Token obtido:", token);
  });

  it("Deve retornar sucesso com 201 quando o valor da transferência for igual ou acima de R$ 10,00", async () => {
    const bodyTransferencias = { ...postTransferencias };

    const response = await request(process.env.BASE_URL)
      .post("/transfers")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send(bodyTransferencias);

    console.log("Response body:", response.body);
    console.log("Response status:", response.status);

    expect(response.status).equal(201);
  });
});
