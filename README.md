# Transfers and Users API

This repository contains the automated tests for for the PATS-02-API as part of Challenge 3, which was proposed during Julio de Lima's Software Testing Mentorship. The goal was to create:

- REST API tests using **SuperTest**
- Performance tests using **k6**

## Business Rules

- No duplicate user registrations.
- Login requires username and password.
- Transfers above R$ 5,000.00 only allowed to favored users.
- Initial balance for each user is R$ 10,000.00.

## Technologies and Tools

- **SuperTest** → REST API testing
- **K6** → Performance testing
- **Chai** → Assertions
- **Mocha** → Test runner
- **Mochawesome** → Test report generator
- **Node.js** → Runtime environment

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

## Configuration

Create a `.env` file in the root folder containing:

```sh
BASE_URL=<REST API URL>
```

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


## Tests

- REST API tests (SuperTest): validate all endpoints and business rules
- Performance tests (k6): simulate load and measure API performance for each endpoint.

---
