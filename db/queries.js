const Pool = require('pg').Pool;
const dbconfig = require('../dbconfig.js')
const pool = new Pool(dbconfig);

pool.on('error', (error, client) => {
  console.error('Unexpected error on idle client', error);
  process.exit(-1);
});

pool.connect((error, client, done) => {
  if (error) throw error
  client.query(`SELECT * FROM products WHERE id = 1`, (error, res) => {
    done()
    if(error) {
      console.log(error.stack)
    } else {
      console.log(res.rows[0])
    }
  })
})

pool.connect()
  .then(client => {
    return client
      .query(`SELECT * FROM products WHERE id = 654654`)
      .then(res => {
        // console.log(res)
        client.release()
        console.log(res.rows[0])
      })
      .catch(error => {
        client.release()
        console.log(error.stack)
      })
      // .query('SELECT * FROM reviews LIMIT 5')
  })

  module.exports = pool;