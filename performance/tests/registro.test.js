import http from 'k6/http';
import { check, sleep } from 'k6';
import { expect } from "https://jslib.k6.io/k6-testing/0.5.0/index.js";
import { pegarBaseUrl } from '../utils/variaveis.js';

export const options = {
  iterations: 1
};

export default function() {
  //const token = obterToken()
  const url = pegarBaseUrl() + '/users/register';

  const payload = JSON.stringify({
    "username": `julio_${Date.now()}`,
    "password": "124587"
  });

   const params = {
        headers: {
        'Content-Type': 'application/json'
    },
  };

  let res = http.post(url, payload, params)

  console.log('STATUS:', res.status);
  console.log('BODY:', res.body);
  check(res, {
    "status is 201": (res) => res.status === 201
  });

  expect.soft(res.status).toBe(201);
  sleep(1);
}