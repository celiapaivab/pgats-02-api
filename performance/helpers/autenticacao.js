import http from 'k6/http';

export function obterToken() {
  const baseUrl = __ENV.BASE_URL || "http://localhost:3000";
  const url = `${baseUrl}/users/login`;

  const payload = JSON.stringify({
    "username": "maca",
    "password": "maca"
  });

  const params = {
    headers: { 'Content-Type': 'application/json' },
  };

  const res = http.post(url, payload, params);
  console.log('Resposta de login:', res.status, res.body);

  if (res.status !== 200 && res.status !== 201) {
    throw new Error(`Falha ao obter token. Status: ${res.status}`);
  }

  try {
    const body = JSON.parse(res.body);
    return body.token;
  } catch (e) {
    throw new Error(`Resposta não é JSON válido: ${res.body}`);
  }
}
