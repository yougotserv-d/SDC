const Pool = require('pg').Pool;
const dbconfig = require('../dbconfig.js')
const pool = new Pool(dbconfig);

pool.on('error', (error, client) => {
  console.error('Unexpected error on idle client', error);
  process.exit(-1);
});



(async () => {
  const client = await pool.connect()
  try {
    const res1 = client.query(`SELECT * FROM products WHERE id = 1`)
    const res2 = client.query(`SELECT * FROM products WHERE id = 654654`)
    const [resone, restwo] = await Promise.all([res1, res2])
    console.log(resone.rows[0])
    console.log(restwo.rows[0])
  } finally {
    client.release()
  }
})().catch(error => console.log(error.stack));


// pool.connect((error, client, done) => {
//   if (error) throw error
//   client.query(`SELECT * FROM products WHERE id = 1`, (error, res) => {
//     done()
//     if(error) {
//       console.log(error.stack)
//     } else {
//       console.log(res.rows[0])
//     }
//   })
// })

// pool.connect()
//   .then(client => {
//     return client
//       .query(`SELECT * FROM products WHERE id = 654654;`)
//       .then(res => {
//         // console.log(res)
//         client.release()
//         console.log(res.rows[0])
//       })
//       .catch(error => {
//         client.release()
//         console.log(error.stack)
//       })
//       // .query('SELECT * FROM reviews LIMIT 5')
//   })

  module.exports = pool;