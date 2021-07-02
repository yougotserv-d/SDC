import http from 'k6/http';
import { sleep, check } from 'k6';
export let options = {
  vus: 200,
  duration: '10s'
}

export default function () {
  // console.time('this')
  // for (var id = 1; id <= 50; id++) {
  //   http.get(`http://54.149.183.238/reviews/meta/?product_id=${id}`);
  // }
  let res = http.get('http://54.245.141.38/reviews/meta/?product_id=10000');
  check(res, {
    'is status 200': (r) => r.status === 200,
  })
  // console.timeEnd('this')
  sleep(0.1);
}