const db = require('../db/queries.js');

const postReview = (req, res) => {
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

  const callQueryOnPhotos = (func) => {
    for (let url of photos) {
      func(`INSERT INTO reviews_photos (review_id, url) VALUES ((SELECT id FROM reviews ORDER BY id DESC LIMIT 1), ${url})`)
    }
  }

  let reviewsQuery = `INSERT INTO reviews
    (product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email)
     VALUES (${product_id}, ${rating}, ${Date.now()}, ${summary}, ${body}, ${recommend}, ${name}, ${email}) `;

  let photosQuery = `INSERT INTO reviews_photos (review_id, url)
    VALUES ((SELECT id FROM reviews ORDER BY id DESC LIMIT 1), ${phtotos[0]})`;

  let characteristicsQuery = ``;

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
