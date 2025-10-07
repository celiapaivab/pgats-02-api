import http from "k6/http";
import { sleep, check } from "k6";
import { obterToken } from "../helpers/autenticacao.js";
import { pegarBaseURL } from "../utils/variaveis.js";
const postTransfer = JSON.parse(open("../fixtures/postTransfers.json"));

export const options = {
  iterations: 50,

  thresholds: {
    http_req_duration: ["p(90)<100", "max<1000"],
    http_req_failed: ["rate<0.01"],
  },
};

export default function () {
  const token = obterToken();
  const url = pegarBaseURL() + "/transfers";
  const payload = JSON.stringify(postTransfer);

  const params = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  };

  const res = http.post(url, payload, params);

  check(res, {
    "Validar que o status é 201": (r) => r.status === 201,
  });

  sleep(1);
}
