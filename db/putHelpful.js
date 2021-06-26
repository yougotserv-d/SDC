const db = require('../db/queries.js');

const putHelpful = (req, res) => {
  let query = `UPDATE reviews SET helpfulness = helpfulness + 1 WHERE id = ${req.params.review_id}`
  db.connect()
    .then(client => {
      return client
        .query(query)
        .then(response => {
          client.release();
          // console.log('helpful updated for review #')
          res.sendStatus(204)
        })
        .catch(error => {
          client.release();
          console.log(error.stack);
          res.sendStatus(400);
        })
    })
}

module.exports = putHelpful;