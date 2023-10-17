
-- Active: 1697472045781@@127.0.0.1@3306@nodelogin

CREATE DATABASE IF NOT EXISTS nodelogin;
USE nodelogin;
CREATE TABLE IF NOT EXISTS users (
    email varchar(100) NOT NULL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL
)