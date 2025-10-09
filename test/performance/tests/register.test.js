import http from 'k6/http';
import { check, sleep } from 'k6';
import { expect } from "https://jslib.k6.io/k6-testing/0.5.0/index.js";
import { pegarBaseURL } from "../utils/variaveis.js";

export const options = {
   stages: [
    { duration: '5s', target: 10 },
    { duration: '20s', target: 10 },
    { duration: '5s', target: 0 },
  ], 
  thresholds: {
    http_req_duration: ["p(90)<3000", "max<5000"],
    http_req_failed: ["rate<0.01"],
  },
};

export default function () {
  //const token = obterToken()
  const url = pegarBaseURL() + '/users/register';

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

  check(res, {
    "status is 201": (res) => res.status === 201
  });

  expect.soft(res.status).toBe(201);
  sleep(1);
}