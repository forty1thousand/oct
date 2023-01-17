CREATE TABLE users (
    username varchar(26) NOT NULL,
    password varchar NOT NULL,
    is_doctor boolean NOT NULL,
    created_at timestamp NOT NULL default current_timestamp,
    updated_at timestamp NOT NULL default current_timestamp,
    PRIMARY KEY (username)
);
