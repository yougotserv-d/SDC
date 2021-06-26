const db = require('../db/queries.js');

const putReport = (req, res) => {
  let query = `EXPLAIN ANALYZE UPDATE reviews SET reported = 'true' WHERE id = ${req.params.review_id}`
  db.connect()
    .then(client => {
      return client
        .query(query)
        .then(response => {
          client.release();
          console.log('review has been reported');
          res.sendStatus(204);
        })
        .catch(error => {
          client.release();
          console.log(error.stack);
          res.sendStatus(400);
        })
    })
}

module.exports = putReport;