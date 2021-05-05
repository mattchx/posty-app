-- Steps to create database

CREATE DATABASE pernauth;

-- set extention to create unique ids
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


-- NOT NULL - useless to save person if column is empty
CREATE TABLE users( 
    user_id uuid PRIMARY KEY DEFAULT 
    uuid_generate_v4(),
    user_name VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    user_password VARCHAR(255) NOT NULL 
);

-- insert fake users
INSERT INTO users(user_name, user_email, user_password) VALUES ('Matthew', 'matt@2go.go', 'pass');

