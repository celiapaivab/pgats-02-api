# Transfers and Users API

This repository contains the automated tests for for the PATS-02-API as part of Challenge 3, which was proposed during Julio de Lima's Software Testing Mentorship. The goal was to create:

- REST API tests using **SuperTest**
- Performance tests using **k6**

---

## Business Rules

- No duplicate user registrations.
- Login requires username and password.
- Transfers above R$ 5,000.00 only allowed to favored users.
- Initial balance for each user is R$ 10,000.00.

---

## Technologies and Tools

- **SuperTest** → REST API testing
- **K6** → Performance testing
- **Chai** → Assertions
- **Mocha** → Test runner
- **Mochawesome** → Test report generator
- **Node.js** → Runtime environment

---

## Installation

1. Clone the repository:
```sh
git clone <repo-url>
cd pgats-02-api
```
2. Install dependencies:
```sh
npm install express swagger-ui-express bcryptjs
```
---

## Configuration

Create a `.env` file in the root folder containing:

```sh
BASE_URL=<REST API URL>
```

---

## How to Run

1. Starting the server:
```sh
node server.js
```
- The API will be available at `http://localhost:3000`
- Swagger documentation will be available at `http://localhost:3000/api-docs`

2. Running API tests:
```sh
npm run test-api
```
- The report will be generated in the `mochawesome-report` folder.

3. Running performance tests:
```sh
K6_WEB_DASHBOARD=true K6_WEB_DASHBOARD_EXPORT=html-report.html k6 run test/performance/tests/<test-file>.test.js
```
- The HTML report will be generated as `html-report.html`.

---

## Endpoints

### User Registration

- `POST /users/register`
  - Body: `{ "username": "string", "password": "string", "favorecidos": ["string"] }`

### Login

- `POST /users/login`
  - Body: `{ "username": "string", "password": "string" }`

### List Users

- `GET /users`

### Transfers

- `POST /transfers`
  - Body: `{ "from": "string", "to": "string", "value": number }`
- `GET /transfers`

---

## Tests

### API Tests

The API tests were designed using **Equivalence Partitioning (EP)** and **Boundary Value Analysis (BVA)** to ensure coverage of valid, invalid, and edge-case scenarios across all endpoints.

1. User Registration (`POST /users/register`)
- Register a new user → `201 Created`
- Register duplicate user → `400 Bad Request`

---

### Login (`POST /users/login`)
- Valid credentials → `200 OK`, returns `user` and `token`
- Invalid username or password → `400 Bad Request`
- Response validation → correct field types for `username`, `favorecidos`, `saldo`

---

### List Users (`GET /users`)
- Valid request → `200 OK`, returns an array of registered users  
- Response validation → each user object includes fields: `username`, `favorecidos`, and `saldo`  

---

### Transfers (`POST /transfers` and `GET /transfers`)
Tests cover all **business rules**, including authorization and transfer limits.

- Valid transfer ≤ R$5,000 → `201`
- Valid transfer > R$5,000 to favored user → `201`
- Transfer > R$5,000 to non-favored user → `400`
- Transfer > balance → `400`
- Invalid fields, empty/incorrect types → `400`
- Missing or invalid token → `401`

**GET /transfers:**  
- Valid token → returns array with valid data  
- Missing or invalid token → `401`

---

### Performance Tests

Performance testing was carried out using **k6** to simulate load and measure API performance for each endpoint.

Distinct tests were executed for each endpoint (`/users/register`, `/users/login`, `/users`, `/transfers`) using the **same load stages** and **thresholds**, ensuring consistent performance criteria across the entire API.

**Load Stages:**
- Ramp-up: 10 users within 5 seconds  
- Constant load: 10 users for 20 seconds  
- Ramp-down: 0 users within 5 seconds

**Thresholds:**
- 90% of requests completed in less than **3,000 ms**  
- Maximum response time below **5,000 ms**  
- Error rate below **1%**

**Validation Check:**
Each test included a check to confirm the expected **status code** (e.g., `200 OK` or `201 Created`).

**Example k6 snippet:**
```js
check(res, {
  "Validate that the status is 200": (r) => r.status === 200,
});

---
