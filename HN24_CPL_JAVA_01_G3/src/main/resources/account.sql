CREATE EXTENSION unaccent;

CREATE TABLE tbl_account
(
    id        BIGSERIAL PRIMARY KEY,
    username VARCHAR,
    password VARCHAR,
    full_name VARCHAR,
    email VARCHAR,
    dob TIMESTAMP,
    address VARCHAR,
    phone_number VARCHAR,
    gender VARCHAR,
    role VARCHAR,
    department_id BIGINT,
    status VARCHAR,
    note VARCHAR,
    username_previous_gen_number VARCHAR
);