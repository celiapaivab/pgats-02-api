import http from 'k6/http'
import { check, sleep } from 'k6'

export const options = {
    stages: [
        { duration: '5s', target: 10 },
        { duration: '20s', target: 10 },
        { duration: '5s', target: 0 },
    ],
    thresholds: {
        http_req_duration: ['p(90)<3000', "max<5000"],
        http_req_failed: ['rate<0.01']
    }
}


export default function () {
    const url = 'http://localhost:3000/users/'

    const params = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const res = http.get(url)

    check(res, {
        'status é 200': (r) => r.status === 200
    })
    sleep(1)


}