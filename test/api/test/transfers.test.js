const request = require("supertest");
const { expect } = require("chai");
const { obterToken } = require("../helper/autenticacao.js");
const postTransferencias = require("../fixtures/postTransfers.json");
require("dotenv").config();

describe("Transfers", () => {
  let token;
  beforeEach(async () => {
    token = await obterToken("julio", 123456);
  });

  describe("POST /transfers", () => {
    it("Should return 201 success when the transfer amount is <= R$ 5,000.00 and the recipient is in the list of allowed users", async () => {
      const bodyTransferencias = { ...postTransferencias };

      const response = await request(process.env.BASE_URL)
        .post("/transfers")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send(bodyTransferencias);

      expect(response.status).to.equal(201);
    });

    it("Should return 201 success when the transfer amount is <= R$ 5,000.00 and the recipient is not in the list of allowed users", async () => {
      const bodyTransferencias = { ...postTransferencias };
      bodyTransferencias.to = "maria";

      const response = await request(process.env.BASE_URL)
        .post("/transfers")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send(bodyTransferencias);

      expect(response.status).to.equal(201);
    });

    it("Should return 201 success when the transfer amount is > R$ 5,000.00 and the recipient is in the list of allowed users", async () => {
      const bodyTransferencias = { ...postTransferencias };
      bodyTransferencias.value = 5001;

      const response = await request(process.env.BASE_URL)
        .post("/transfers")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send(bodyTransferencias);

      expect(response.status).to.equal(201);
    });

    it("Should return a valid response body when the transfer succeeds with a 201 status code", async () => {
      const bodyTransferencias = { ...postTransferencias };

      const response = await request(process.env.BASE_URL)
        .post("/transfers")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send(bodyTransferencias);

      expect(response.status).to.equal(201);
      expect(response.body).to.have.property("from");
      expect(response.body).to.have.property("to");
      expect(response.body).to.have.property("value");
      expect(response.body).to.have.property("date");
      expect(response.body.from).to.be.a("string");
      expect(response.body.to).to.be.a("string");
      expect(response.body.value).to.be.a("number");
      expect(response.body.date).to.be.a("string");
    });

    it("Should return 400 when the transfer amount is > R$ 5,000.00 and the user is not on the list of allowed recipients", async () => {
      const bodyTransferencias = { ...postTransferencias };
      bodyTransferencias.to = "maria";
      bodyTransferencias.value = 5001;

      const response = await request(process.env.BASE_URL)
        .post("/transfers")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send(bodyTransferencias);

      expect(response.status).to.equal(400);
    });

    it("Should return 400 when the transfer amount exceeds the account balance", async () => {
      const bodyTransferencias = { ...postTransferencias };
      bodyTransferencias.value = 11000;

      const response = await request(process.env.BASE_URL)
        .post("/transfers")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send(bodyTransferencias);

      expect(response.status).to.equal(400);
    });

    it("Should return 400 when the transfer amount is zero", async () => {
      const bodyTransferencias = { ...postTransferencias };
      bodyTransferencias.value = 0;

      const response = await request(process.env.BASE_URL)
        .post("/transfers")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send(bodyTransferencias);

      expect(response.status).to.equal(400);
    });

    it("Should return 400 when the transfer amount is negative", async () => {
      const bodyTransferencias = { ...postTransferencias };
      bodyTransferencias.value = -100;

      const response = await request(process.env.BASE_URL)
        .post("/transfers")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send(bodyTransferencias);

      expect(response.status).to.equal(400);
    });

    it("Should return 400 when the transfer is made to the same user", async () => {
      const bodyTransferencias = { ...postTransferencias };
      bodyTransferencias.to = "julio";

      const response = await request(process.env.BASE_URL)
        .post("/transfers")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send(bodyTransferencias);

      expect(response.status).to.equal(400);
    });

    it("Should return 400 when the transfer is made to a nonexistent user", async () => {
      const bodyTransferencias = { ...postTransferencias };
      bodyTransferencias.to = "usuarioInexistente";

      const response = await request(process.env.BASE_URL)
        .post("/transfers")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send(bodyTransferencias);

      expect(response.status).equal(400);
    });

    it("Should return 400 when the 'to' field is empty ", async () => {
      const bodyTransferencias = { ...postTransferencias };
      bodyTransferencias.to = "";

      const response = await request(process.env.BASE_URL)
        .post("/transfers")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send(bodyTransferencias);

      expect(response.status).to.equal(400);
    });

    it("Should return 400 when the 'from' field is empty", async () => {
      const bodyTransferencias = { ...postTransferencias };
      bodyTransferencias.from = "";

      const response = await request(process.env.BASE_URL)
        .post("/transfers")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send(bodyTransferencias);

      expect(response.status).to.equal(400);
    });

    it("Should return 400 when the 'value' field is empty", async () => {
      const bodyTransferencias = { ...postTransferencias };
      bodyTransferencias.value = "";

      const response = await request(process.env.BASE_URL)
        .post("/transfers")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send(bodyTransferencias);

      expect(response.status).to.equal(400);
    });

    it("Should return 400 when the 'to' field is a number", async () => {
      const bodyTransferencias = { ...postTransferencias };
      bodyTransferencias.to = 1234;

      const response = await request(process.env.BASE_URL)
        .post("/transfers")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send(bodyTransferencias);

      expect(response.status).equal(400);
    });

    it("Should return 400 when the 'to' from is a number", async () => {
      const bodyTransferencias = { ...postTransferencias };
      bodyTransferencias.from = 1234;

      const response = await request(process.env.BASE_URL)
        .post("/transfers")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send(bodyTransferencias);

      expect(response.status).to.equal(400);
    });

    it("Should return 400 when the 'value' field is a string", async () => {
      const bodyTransferencias = { ...postTransferencias };
      bodyTransferencias.value = "1000";

      const response = await request(process.env.BASE_URL)
        .post("/transfers")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send(bodyTransferencias);

      expect(response.status).to.equal(400);
    });

    it("Should return 401 when no token is provided", async () => {
      const bodyTransferencias = { ...postTransferencias };
      const tokenVazio = "";

      const response = await request(process.env.BASE_URL)
        .post("/transfers")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${tokenVazio}`)
        .send(bodyTransferencias);

      expect(response.status).to.equal(401);
    });

    it("Should return 401 when an invalid token is provided", async () => {
      const bodyTransferencias = { ...postTransferencias };
      const tokenInválido = "token_invalido";

      const response = await request(process.env.BASE_URL)
        .post("/transfers")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${tokenInválido}`)
        .send(bodyTransferencias);

      expect(response.status).to.equal(401);
    });
  });

  describe("GET /transfers", () => {
    it("Should return 200 success and an array with valid data in the response body", async () => {
      const response = await request(process.env.BASE_URL)
        .get("/transfers")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).to.equal(200);
      expect(response.body).to.be.an("array");
    });

    it("Should return 200 success and an array in the response body with required fields having valid types", async () => {
      const response = await request(process.env.BASE_URL)
        .get("/transfers")
        .set("Authorization", `Bearer ${token}`);

      response.body.forEach((item) => {
        expect(item).to.have.property("from");
        expect(item).to.have.property("to");
        expect(item).to.have.property("value");
        expect(item).to.have.property("date");
        expect(item.from).to.be.a("string");
        expect(item.to).to.be.a("string");
        expect(item.value).to.be.a("number");
        expect(item.date).to.be.a("string");
      });
    });

    it("Should return the authenticated user in the 'from' field", async () => {
      const response = await request(process.env.BASE_URL)
        .get("/transfers")
        .set("Authorization", `Bearer ${token}`);

      response.body.forEach((item) => {
        expect(item.from).to.equal("julio");
      });
    });

    it("Should return 401 when no token is provided", async () => {
      const tokenVazio = "";

      const response = await request(process.env.BASE_URL)
        .get("/transfers")
        .set("Authorization", `Bearer ${tokenVazio}`);

      expect(response.status).to.equal(401);
    });

    it("Should return 401 when an invalid token is provided", async () => {
      const tokenInválido = "token_invalido";

      const response = await request(process.env.BASE_URL)
        .get("/transfers")
        .set("Authorization", `Bearer ${tokenInválido}`);

      expect(response.status).to.equal(401);
    });
  });
});
