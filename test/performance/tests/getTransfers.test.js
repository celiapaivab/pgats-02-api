import http from "k6/http";
import { sleep, check } from "k6";
import { obterToken } from "../helpers/autenticacao.js";
import { pegarBaseURL } from "../utils/variaveis.js";

export const options = {
  stages: [
    { duration: "5s", target: 10 },
    { duration: "20s", target: 10 },
    { duration: "5s", target: 0 },
  ],

  thresholds: {
    http_req_duration: ["p(90)<3000", "max<5000"],
    http_req_failed: ["rate<0.01"],
  },
};

export default function () {
  const token = obterToken();
  const url = pegarBaseURL() + "/transfers";

  const params = {
    headers: {
      Authorization: "Bearer " + token,
    },
  };

  const res = http.get(url, params);

  check(res, {
    "Validate that the status is 200": (r) => r.status === 200,
  });

  sleep(1);
}
