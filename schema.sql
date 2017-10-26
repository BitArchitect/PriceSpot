DROP TABLE IF EXISTS restaurantscore;

Create table restaurantscore 

(
business_zip VARCHAR(10),
inspection_Id VARCHAR(50),
inspection_date TIMESTAMP,
inspection_type VARCHAR(100), 
risk_category VARCHAR(50)
);

