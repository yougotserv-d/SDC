import http from 'k6/http';
import { sleep, check } from 'k6';
export let options = {
  vus: 100,
  duration: '30s'
}

export default function () {
  let res = http.get('http://localhost:8080/reviews/?product_id=654');
  check(res, {
    'is status 200': (r) => r.status === 200,
  })
  sleep(1);
}