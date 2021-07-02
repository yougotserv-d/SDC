require('newrelic');
const express = require('express');
const getReviews = require('../db/getreviews');
const putHelpful = require('../db/putHelpful');
const putReport = require('../db/putReport');
const getMeta = require('../db/getMeta');
const postReview = require('../db/postReview');
const db = require('../db/queries.js');
const morgan = require('morgan')
const app = express();
const port = 8080;

app.use(express.json());
app.use(morgan('dev'));

// db.on('error', (error, client) => {
//   console.error('Unexpected error on idle client', error);
//   process.exit(-1);
// });

app.get('/loaderio-28016b04fdb0ed4ea066ecec5a19c1ad.txt', (req, res) => {
  res.send('loaderio-28016b04fdb0ed4ea066ecec5a19c1ad')
})

app.get('/reviews/', getReviews);

app.get('/reviews/meta/', getMeta);

app.post('/reviews/', postReview);

app.put('/reviews/:review_id/helpful', putHelpful);

app.put('/reviews/:review_id/report', putReport);

app.listen(port, () => {
  console.log(`listening on port ${port}`)
});




// app.get('/reviews/', (req, res) => {
//   console.log('req.queries logged', req.query)
//   let defaultCount = req.query.count || 5;
//   let defaultPage = req.query.page || 1;
//   let product = req.query.product_id;
//   let sort = req.query.sort
//   let reviewSetEnd = defaultCount * defaultPage;
//   let reviewSetStart = reviewSetEnd - defaultCount;
//   let query = product ? `SELECT * FROM reviews WHERE product_id = ${product}`: `SELECT * FROM reviews
//     WHERE id < ${reviewSetEnd} AND id > ${reviewSetStart} AND reported = 'false'`
//   db.connect()
//     .then(client => {
//       return client
//         .query(query)
//         .then(response => {
//           client.release()
//           console.log(response.rows)
//           res.send(response.rows)
//         })
//         .catch(error => {
//           client.release()
//           console.log(error.stack)
//           res.sendStatus(500)
//         })
//     })
// })