
/* meta table with characteristics as json*/

DROP TABLE IF EXISTS products;
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR
);

DROP TABLE IF EXISTS chars;
CREATE TABLE chars (
  id SERIAL PRIMARY KEY,
  product_id INT NOT NULL,
  name VARCHAR NOT NULL
);

COPY chars(id, product_id, name)
FROM '/Users/spencerasavadejkajorn/SDC/SDC/rawData/characteristics.csv'
DELIMITER ','
CSV HEADER;

INSERT INTO products (name)
SELECT name FROM productcsv;

DROP TABLE IF EXISTS reviews;
CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  product_id INT NOT NULL,
  rating SMALLINT NOT NULL,
  date BIGINT NOT NULL,
  summary VARCHAR NOT NULL,
  body VARCHAR NOT NULL,
  recommend BOOLEAN NOT NULL DEFAULT false,
  reported BOOLEAN NOT NULL DEFAULT false,
  reviewer_name VARCHAR NOT NULL,
  reviewer_email VARCHAR NOT NULL,
  response VARCHAR NOT NULL DEFAULT '',
  helpfulness INT NOT NULL DEFAULT 0
);
INSERT INTO reviews (product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness)
SELECT product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness FROM reviewscsv;

DROP TABLE IF EXISTS characteristics_reviews;
CREATE TABLE characteristics_reviews(
  id SERIAL PRIMARY KEY,
  characteristic_id INT NOT NULL,
  review_id INT NOT NULL,
  value SMALLINT NOT NULL
);

INSERT INTO characteristics_reviews (characteristic_id, review_id, value)
SELECT characteristic_id, review_id, value FROM characteristics_reviewscsv;

DROP TABLE IF EXISTS reviews_photos;
CREATE TABLE reviews_photos (
  id SERIAL PRIMARY KEY,
  review_id INT NOT NULL,
  url VARCHAR NOT NULL
);

INSERT INTO reviews_photos (review_id, url)
SELECT review_id, url FROM reviews_photoscsv;

DROP TABLE dummy, reviews_meta, reviews_meta_recommend;


SELECT name, characteristic_id, AVG(value) FROM characteristics_reviews WHERE product_id = 5642 GROUP BY characteristic_id;



ALTER TABLE characteristics_reviews
ADD COLUMN product_id INT NOT NULL DEFAULT 0;

UPDATE characteristics_reviews
SET product_id = (SELECT product_id FROM chars WHERE chars.id = characteristics_reviews.characteristic_id);

UPDATE characteristics_reviews
SET name = (SELECT name FROM chars WHERE chars.id = characteristics_reviews.characteristic_id);



SELECT json_agg(chars_array)
AS characteristics
FROM (
  SELECT json_build_object(
    (SELECT name),
    (SELECT json_build_object)
  )
  AS chars_array
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
    WHERE product_id = 5642
    GROUP BY characteristic_id, name
    ) AS a
  ) AS b
) AS c;



/*

DROP TABLE IF EXISTS
DROP TABLE IF EXISTS reviews_meta;

CREATE  TABLE reviews_meta (
	id                   SERIAL PRIMARY KEY ,
	product_id           integer   ,
	"1_star_reviews"     smallint DEFAULT 0 NOT NULL ,
	"2_start_reviews"    smallint DEFAULT 0 NOT NULL ,
	"3_star_reviews"     smallint DEFAULT 0 NOT NULL ,
	"4_star_reviews"     smallint DEFAULT 0 NOT NULL ,
	"5_star_reviews"     smallint DEFAULT 0 NOT NULL ,
	"characteristics"    json   ,
	recommend_true       integer DEFAULT 0 NOT NULL ,
	recommend_false      integer DEFAULT 0 NOT NULL ,
	average_rating       integer DEFAULT 0 NOT NULL
 );

DROP TABLE IF EXISTS reviews_meta_recommend;
CREATE TABLE reviews_meta_recommend (
  id SERIAL PRIMARY KEY,
  product_id INT NOT NULL,
  "true" INT NOT NULL DEFAULT 0,
  "false" INT NOT NULL DEFAULT 0
);

DROP TABLE IF EXISTS reviews_meta_recommend_true;
CREATE TABLE reviews_meta_recommend_true (
  id SERIAL PRIMARY KEY,
  product_id INT NOT NULL,
  "true" INT NOT NULL DEFAULT 0
);

DROP TABLE IF EXISTS reviews_meta_recommend_false;
CREATE TABLE reviews_meta_recommend_false (
  id SERIAL PRIMARY KEY,
  product_id INT NOT NULL,
  "false" INT NOT NULL DEFAULT 0
);


INSERT INTO reviews_meta_recommend_true (product_id, "true")
  SELECT product_id, COUNT(recommend)
  FROM reviewscsv
  WHERE recommend = 'true'
  GROUP BY product_id;

INSERT INTO reviews_meta_recommend_false (product_id, "false")
  SELECT product_id, COUNT(recommend)
  FROM reviewscsv
  WHERE recommend = 'false'
  GROUP BY product_id;


INSERT INTO reviews_meta_recommend (product_id, "true", "false")
SELECT reviews_meta_recommend_true.product_id, "true", "false"
FROM reviews_meta_recommend_true
INNER JOIN reviews_meta_recommend_false
ON reviews_meta_recommend_true.product_id = reviews_meta_recommend_false.product_id;
ORDER BY reviews_meta_recommend_true.product_id;

INSERT INTO reviews_meta_recommend (product_id)
SELECT id FROM products;

UPDATE reviews_meta_recommend
SET "true" = (SELECT COUNT(recommend) FROM reviewscsv WHERE recommend = 'true' LIMIT 1)
      WHERE reviews_meta_recommend.product_id = reviewscsv.product_id;
UPDATE reviews_meta_recommend
SET "false" = (SELECT COUNT(recommend) FROM reviewscsv WHERE recommend = 'false')
      WHERE product_id = (SELECT product_id FROM reviewscsv);

      */