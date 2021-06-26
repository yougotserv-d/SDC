const db = require('../db/queries.js');


const getReviews = (req, res) => {
  // console.log('req.queries logged', req.query)
  let defaultCount = req.query.count || 5;
  let defaultPage = req.query.page || 1;
  let product = req.query.product_id;
  let sort = req.query.sort
  let reviewSetEnd = defaultCount * defaultPage;
  let reviewSetStart = reviewSetEnd - defaultCount;
  let sortQuery = 'ORDER BY id';
  let startQuery = `OFFSET ${reviewSetStart} ROWS FETCH FIRST ${defaultCount} ROW ONLY`;
  // let startQuery = 'ORDER BY id';
  if (sort ===  'newest') {
    sortQuery = 'ORDER BY date DESC'
  }
  if (sort === 'helpful') {
    sortQuery = 'ORDER BY helpfulness DESC'
  }
  if(sort === 'relevant') {

  }
  let query = product
    ? `SELECT * FROM reviews WHERE product_id = ${product} AND reported = 'false' ${sortQuery} ${startQuery}`
    : `SELECT * FROM reviews WHERE reported = 'false' ${sortQuery} ${startQuery}`;
// id < ${reviewSetEnd} AND id > ${reviewSetStart} AND
  // let query = `SELECT * FROM reviews WHERE product_id = ${product}`;

  db.connect()
    .then(client => {
      return client
        .query(query)
        .then(response => {
          client.release()
          console.log(response.rows)
          res.send(response.rows)
        })
        .catch(error => {
          client.release()
          console.log(error.stack)
          res.sendStatus(500)
        })
    })
}

module.exports =  getReviews;
