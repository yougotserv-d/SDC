const db = require('../db/queries.js');

const postReview = async (req, res) => {
  const {
    product_id,
    rating,
    summary,
    body,
    recommend,
    name,
    email,
    photos,
    characteristics
  } = req.body


  let reviewsQuery = `INSERT INTO reviews
  (product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email)
  VALUES (${product_id}, ${rating}, ${Date.now()}, ${summary}, ${body}, ${recommend}, ${name}, ${email}) `;

  const callQueryOnPhotos = (func) => {
    for (let url of photos) {
      func(`INSERT INTO reviews_photos (review_id, url) VALUES ((SELECT id FROM reviews ORDER BY id DESC LIMIT 1), ${url})`)
    }
  }

  let photosQuery = `INSERT INTO reviews_photos (review_id, url)
    VALUES ((SELECT id FROM reviews ORDER BY id DESC LIMIT 1), ${phtotos[0]})`;

    const callQueryOnCharacteristics= (func) => {
      for (let key in characteristics) {
        func(
          `INSERT INTO characteristics (product_id, name)
          VALUES (${product_id}, (SELECT name FROM characteristics WHERE id = ${key}`
          `INSERT INTO characteristics_reviews (characteristic_id, review_id, value)
          VALUES (${key}, (SELECT id FROM reviews ORDER BY id DESC LIMIT 1), ${characteristics[key]})`
        )
      }
    }

    // this needs to happen for each  property on the characteristics object
  let characteristicsQuery = `INSERT INTO characteristics (product_id, name)
    VALUES (${product_id}, (SELECT name FROM characteristics WHERE id = ${/*characteristics.property*/}`
    `INSERT INTO characteristics_reviews (characteristic_id, review_id, value)
      VALUES (${/*characteristics.property*/}, (SELECT id FROM reviews ORDER BY id DESC LIMIT 1), ${/*characteristics.property.value*/})`

  const client = await db.connect()
  try {
    await client.query(reviewsQuery)
    callQueryOnPhotos(await client.query)
    callQueryOnCharacteristics(await client.query)
    // await client.query(query)
    // console.log('successful helpful')
    // res.sendStatus(204)
  } catch (error){
    console.log(error.stack)
    // sendStatus(400)
  } finally {
    client.release()
  }


  db.connect()
    .then(client => {
      return client
        .query()
        .then(response => {
          client.release();
          console.log('review posted');
          res.sendStatus(201)
        })
        .catch(error => {
          client.release();
          console.log(error.stack);
          res.sendStatus(400)
        })
    })
}
