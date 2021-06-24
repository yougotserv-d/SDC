// this function will make a call for reviews.
// upon recieving data it will make queries to postgres to write to starMetaData table
//



// select count(*) from reviewscsv where rating = 1 and product_id = 1;
// this query shows number of rows for all 1 star reviews on product 1;

// function takes in large data set.
// then loops through.
// for each product_id
// onestarreviews
// INSERT INTO reviews_meta_stars(product_id)
// count arrau ['one', 'two', 'three', 'four', 'five']
// while count is 1 - 5
// let starCount = SELECT COUNT(*) FROM reviewscsv WHERE rating = (count) AND product_id = product_id;
// -> INSERT INTO reviews_meta_stars (product_id, (countArray[count])_star_reviews)
// ->   VALUES (product_id, starCount)
// -> count++