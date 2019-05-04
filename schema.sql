DROP TABLE IF EXISTS restaurantscore;

Create table restaurantscore 

(
business_zip VARCHAR(10),
inspection_Id VARCHAR(50),
inspection_date TIMESTAMP,
inspection_type VARCHAR(200), 
risk_category VARCHAR(50)
);


-- \copy restaurantscore FROM '/Users/david/Documents/HR/PriceSpot/database/scores.csv' DELIMITER ',' CSV;
