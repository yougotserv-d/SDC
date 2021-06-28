const db = require('./queries');

const postReview = async (req, res) => {
  console.log(req.body);
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
//  console.log(typeof summary)
console.log(photos)

  let reviewsQuery = `INSERT INTO reviews
  (product_id, rating, date, summary, body, recommend, reviewer_name, reviewer_email)
  VALUES (${product_id}, ${rating}, ${Date.now()}, '${summary}', '${body}', ${recommend}, '${name}', '${email}') `;

  let photosQuery = ``
  let tempPhotoQuery = `INSERT INTO reviews_photos (review_id, url) VALUES `

  if (photos.length > 0) {
    for (let url of photos) {
      tempPhotoQuery = tempPhotoQuery.concat(`((SELECT id FROM reviews ORDER BY id DESC LIMIT 1), '${url}'),`)
    }
    photosQuery = tempPhotoQuery.slice(0, -1);
  }

  // let tempCharsQuery = `INSERT INTO chars (product_id, name) VALUES `;

  let tempCharsReviewsQuery = `INSERT INTO characteristics_reviews (characteristic_id, review_id, value, product_id, name) VALUES `;

  for (let key in characteristics) {
    // tempCharsQuery = tempCharsQuery.concat(`(${product_id}, (SELECT name FROM chars WHERE id = ${key})),`);
    tempCharsReviewsQuery = tempCharsReviewsQuery.concat(`(${key}, (SELECT id FROM reviews ORDER BY id DESC LIMIT 1), ${characteristics[key]}, ${product_id}, (SELECT name FROM chars WHERE id = ${key})),`)
  };

  // let charsQuery = tempCharsQuery.slice(0, -1);
  let charsReviewsQuery = tempCharsReviewsQuery.slice(0, -1);

  console.log(reviewsQuery);
  console.log(photosQuery);
  // console.log(charsQuery);
  console.log(charsReviewsQuery);

  const client = await db.connect()
  try {
    const insertReviews =  client.query(reviewsQuery);
    const insertPhotos = client.query(photosQuery);
    // const insertChars = client.query(charsQuery);
    const insertCharsReviews = client.query(charsReviewsQuery);
    const [insRev, insPho, insCharRev] = await Promise.all([insertReviews, insertPhotos, insertCharsReviews]);
    console.log(insRev);
    console.log(insPho);
    // console.log(insChar);
    console.log(insCharRev);
    res.sendStatus(204)
  } catch (error){
    console.log(error.stack)
    res.sendStatus(400)
  } finally {
    client.release()
  }


}

module.exports = postReview;

// db.connect()
// .then(client => {
//   return client
//   .query()
//   .then(response => {
//     client.release();
//     console.log('review posted');
//     res.sendStatus(201)
//   })
//   .catch(error => {
//     client.release();
//     console.log(error.stack);
//     res.sendStatus(400)
//   })
// })


// callQueryOnPhotos(await client.query)
// callQueryOnCharacteristics(await client.query)
// await client.query(query)
// console.log('successful helpful')

//   // this needs to happen for each  property on the characteristics object
// let characteristicsQuery = `INSERT INTO characteristics (product_id, name)
//   VALUES (${product_id}, (SELECT name FROM characteristics WHERE id = ${/*characteristics.property*/}`
//   `INSERT INTO characteristics_reviews (characteristic_id, review_id, value)
//     VALUES (${/*characteristics.property*/}, (SELECT id FROM reviews ORDER BY id DESC LIMIT 1), ${/*characteristics.property.value*/})`
