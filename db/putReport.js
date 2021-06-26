const db = require('./queries');

const putReport = async (req, res) => {
  let query = `EXPLAIN ANALYZE UPDATE reviews SET reported = 'true' WHERE id = ${req.params.review_id}`



  const client = await db.connect()
  try {
    await client.query(query)
    console.log('successful report')
    res.sendStatus(204)
  } catch (error){
    console.log(error.stack)
    sendStatus(400)
  } finally {
    client.release()
  }

  // db.connect()
  //   .then(client => {
  //     return client
  //       .query(query)
  //       .then(response => {
  //         client.release();
  //         console.log('review has been reported');
  //         res.sendStatus(204);
  //       })
  //       .catch(error => {
  //         client.release();
  //         console.log(error.stack);
  //         res.sendStatus(400);
  //       })
  //   })
}

module.exports = putReport;