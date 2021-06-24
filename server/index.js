const express = require('express');
let db = require('../db/queries.js');
let morgan = require('morgan')
let app = express();const Pool = require('pg').Pool;
const dbconfig = require('../dbconfig.js')
const pool = new Pool(dbconfig);


app.use(express.json());
app.use(morgan('dev'));

pool.on('error', (error, client) => {
  console.error('Unexpected error on idle client', error);
  process.exit(-1);
});

app.get('/reviews', (req, res) => {
  let query = `SELECT * FROM reviews LIMIT 5`
  let data;
  pool.connect()
    .then(client => {
      return client
        .query(query)
        .then(res => {
          client.release()
          console.log(res.rows)
          data = res.rows
        })
        .catch(error => {
          client.release()
          console.log(error.stack)
        })
    })
    console.log('this is the data after connect', data)
    res.send(data)

})

let port = 3000;
app.listen(port, () => {
  console.log(`listening on port ${port}`)
});