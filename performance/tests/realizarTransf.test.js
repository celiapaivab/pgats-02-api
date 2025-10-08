import http from 'k6/http';
import { check, sleep } from 'k6';
import { expect } from "https://jslib.k6.io/k6-testing/0.5.0/index.js";
import { obterToken } from '../helpers/autenticacao.js';
import { pegarBaseUrl } from '../utils/variaveis.js';

export const options = {
    vus: 1,
    iterations: 1
};

export default function() {
  const token = obterToken()
  const url = pegarBaseUrl() + '/transfers';

  const payload = JSON.stringify({
    "from": "maca",
    "to": "julio.lima",
    "value": 11
  });

   const params = {
        headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
    },
  };

  let res = http.post(url, payload, params)
  check(res, {
    "status is 201": (res) => res.status === 201
  });

  expect.soft(res.status).toBe(201);
  sleep(1);
}
