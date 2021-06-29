import http from 'k6/http';
import { sleep, check } from 'k6';
export let options = {
  vus: 200,
  duration: '10s'
}

export default function () {
  // console.time('this')
  // for (var id = 1; id <= 100; id++) {
  //   http.get(`http://localhost:8080/reviews/meta/?product_id=${id}`);
  // }
  let res = http.get('http://localhost:8080/reviews/meta/?product_id=65184');
  check(res, {
    'is status 200': (r) => r.status === 200,
  })
  // console.timeEnd('this')
  sleep(1);
}