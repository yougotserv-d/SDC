const db = require('./queries');

const getMeta = async (req, res) => {
  const product = req.query.product_id;

  let ratingReviewTable = `

    `
  let queryRatings5 = `SELECT COUNT(*) FROM reviews WHERE product_id = ${product} AND rating = 5`;
  let ratingsQuery = `SELECT json_build_object (
    '1', (SELECT COUNT(*) FROM reviews WHERE product_id = ${product} AND rating = 1),
    '2', (SELECT COUNT(*) FROM reviews WHERE product_id = ${product} AND rating = 2),
    '3', (SELECT COUNT(*) FROM reviews WHERE product_id = ${product} AND rating = 3),
    '4', (SELECT COUNT(*) FROM reviews WHERE product_id = ${product} AND rating = 4),
    '5', (${queryRatings5})
    )`;

  let recommendQuery = `SELECT json_build_object (
    'false', (SELECT COUNT(*) FROM reviews WHERE product_id = ${product} AND recommend = 'false'),
    'true', (SELECT COUNT(*) FROM reviews WHERE product_id = ${product} AND recommend = 'true')
  )`;

  let buildChars = `SELECT json_object_agg(
    (SELECT name),
    (SELECT json_build_object)
  )
  FROM
  (
    SELECT
    (SELECT name) AS name, json_build_object(
      'id', (SELECT characteristic_id),
      'value', (SELECT avg)
    )
    FROM
    (
    SELECT name, characteristic_id, AVG(value)
    FROM characteristics_reviews
    WHERE product_id = ${product}
    GROUP BY characteristic_id, name
    ) AS a
  ) AS b`;

  let concatQuery2 = `SELECT json_build_object(
    'product_id', ${product},
    'ratings', (${ratingsQuery}),
    'recommended', (${recommendQuery}),
    'characteristics', (${buildChars})
    )`;

  if (!product) {
    // console.error('Error: invalid product_id provided')
    res.writeHead(404)
    res.end('Error: invalid product_id provided')
  } else {
    const client = await db.connect()
    try {
      const response = await client.query(concatQuery2)
      // console.log(response.rows[0])
      res.send(response.rows[0].json_build_object)
    } catch (error) {
      console.log(error.stack)
      res.sendStatus(500)
    } finally {
      client.release()
    }
  }
}

module.exports = getMeta;




      // let concatQuery = `SELECT json_object_agg(key, val) FROM (
      //   VALUES
      //     ('ratings', (
      //       '1', (SELECT COUNT(*) FROM reviews WHERE product_id = ${product} AND rating = 1),
      //       '2', (SELECT COUNT(*) FROM reviews WHERE product_id = ${product} AND rating = 2),
      //       '3', (SELECT COUNT(*) FROM reviews WHERE product_id = ${product} AND rating = 3),
      //       '4', (SELECT COUNT(*) FROM reviews WHERE product_id = ${product} AND rating = 4),
      //       '5', (${queryRatings5})
      //         ))
      //     ('recommended', (
      //       'false', (SELECT COUNT(*) FROM reviews WHERE product_id = ${product} AND recommend = 'false'),
      //       'true', (SELECT COUNT(*) FROM reviews WHERE product_id = ${product} AND recommend = 'true')
      //     ))
      // ) foo(key, val)`