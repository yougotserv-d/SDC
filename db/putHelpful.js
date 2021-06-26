const db = require('./queries');

const putHelpful = async (req, res) => {
  let query = `UPDATE reviews SET helpfulness = helpfulness + 1 WHERE id = ${req.params.review_id}`

  const client = await db.connect()
  try {
    await client.query(query)
    console.log('successful helpful')
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
  //         // console.log('helpful updated for review #')
  //         res.sendStatus(204)
  //       })
  //       .catch(error => {
  //         client.release();
  //         console.log(error.stack);
  //         res.sendStatus(400);
  //       })
  //   })
}

module.exports = putHelpful;