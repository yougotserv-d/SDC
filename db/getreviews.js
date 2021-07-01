const db = require('../db/queries.js');


const getReviews = async (req, res) => {
  // console.log('req.queries logged', req.query)
  let defaultCount = req.query.count || 5;
  let defaultPage = req.query.page || 1;
  let product = req.query.product_id;
  let sort = req.query.sort
  let reviewSetEnd = defaultCount * defaultPage;
  let reviewSetStart = reviewSetEnd - defaultCount;
  // let sortQuery = date;
  let startQuery = `OFFSET ${reviewSetStart} ROWS FETCH FIRST ${defaultCount} ROW ONLY`;
  // let startQuery = 'ORDER BY id';
  // I NEED TO ADD photos array to each object(row)
  // let query = `SELECT *,
  //   coalesce (
    //     (
      //       SELECT array_to_json(array_agg(row_to_json(x)))
      //       FROM (
        //         SELECT photo.id, photo.url
        //         FROM reviews_photos photo
        //         JOIN reviews USING (id)
        //         WHERE photo.review_id = r.id
        //       ) x
        //     ),
        //     '[]'
        //   ) AS photos
        //   FROM reviews r WHERE product_id = ${product} AND reported = 'false' ${sortQuery} ${startQuery}`;


        // let query2 =
        let query = `SELECT *,
        coalesce (
          (
            SELECT array_to_json(array_agg(row_to_json(x)))
            FROM (
              SELECT photo.id, photo.url
              FROM reviews_photos photo
              JOIN reviews USING (id)
              WHERE photo.review_id = r.id
              ) x
              ),
              '[]'
              ) AS photos
              FROM reviews r WHERE product_id = $1 AND reported = 'false' ORDER BY date DESC
              OFFSET $2 ROWS FETCH FIRST $3 ROW ONLY`;


  // let query = `SELECT json_build_object('product', $1,'page', $4,'count', $3,'results', (SELECT *,
  //   coalesce (
  //     (
  //       SELECT array_to_json(array_agg(row_to_json(x)))
  //       FROM (
  //         SELECT photo.id, photo.url
  //         FROM reviews_photos photo
  //         JOIN reviews USING (id)
  //         WHERE photo.review_id = r.id
  //         ) x
  //         ),
  //         '[]'
  //         ) AS photos
  //         FROM reviews r WHERE product_id = $1 AND reported = 'false' ORDER BY helpfulness DESC
  //         OFFSET $2 ROWS FETCH FIRST $3 ROW ONLY))`


  // if (sort ===  'newest') {
  //   sortQuery = 'ORDER BY date DESC'
  // }
  if (sort === 'helpful') {
    query = `SELECT *,
    coalesce (
      (
        SELECT array_to_json(array_agg(row_to_json(x)))
        FROM (
          SELECT photo.id, photo.url
          FROM reviews_photos photo
          JOIN reviews USING (id)
          WHERE photo.review_id = r.id
          ) x
          ),
          '[]'
          ) AS photos
          FROM reviews r WHERE product_id = $1 AND reported = 'false' ORDER BY helpfulness DESC
          OFFSET $2 ROWS FETCH FIRST $3 ROW ONLY`;
  }
  if(sort === 'relevant') {

  }
  // let photoQuery = `SELECT id, url FROM reviews_photos JOIN reviews USING (review_id) WHERE reviews_photo.review_id = reviews.review_id`
    // : `SELECT * FROM reviews WHERE reported = 'false' ${sortQuery} ${startQuery}`;

// id < ${reviewSetEnd} AND id > ${reviewSetStart} AND
  // let query = `SELECT * FROM reviews WHERE product_id = ${product}`;


  // const response = await db.query(query, [product, reviewSetStart, defaultCount, defaultPage]);
  // console.log(response)
  // // res.send(response)
  // res.status(200).send({product: product, page: defaultPage, count: defaultCount, results: response})
  if (!product) {
    // console.error('Error: invalid product_id provided')
    res.writeHead(404)
    res.end('Error: invalid product_id provided')
  } else {
    const client = await db.connect()
    try {
      const response = await client.query(query, [product, reviewSetStart, defaultCount])
      // const response2 =  await client.query(photoQuery)
      // console.log(response)
      // console.log(response.rows)
      res.send({product: product, page: defaultPage, count: defaultCount, results: response.rows})
    } catch (error){
      console.log(error.stack)
      res.sendStatus(500)
    } finally {
      client.release()
    }

  }

  // ;(async () => {
  //   const client = await db.connect()
  //   try {
  //     const response = await client.query(query)
  //     console.log(response.rows)
  //     res.send(response.rows)
  //   } finally {
  //     client.release()
  //   }
  // })().catch(error => console.log(error.stack))

  // db.connect()
  //   .then(client => {
  //     return client
  //       .query(query)
  //       .then(response => {
  //         client.release()
  //         console.log(response.rows)
  //         res.send(response.rows)
  //       })
  //       .catch(error => {
  //         client.release()
  //         console.log(error.stack)
  //         res.sendStatus(500)
  //       })
  //   })
}

module.exports =  getReviews;
