CREATE TABLE users (
    id int NOT NULL PRIMARY KEY AUTO INCREMENT,
    name varchar(32) NOT NULL,
    email varchar(64) NOT NULL,
    password varchar(64) NOT NULL,
    UNIQUE KEY(email)
);

CREATE TABLE tasks (
    id int NOT NULL PRIMARY KEY AUTO INCREMENT,
    description TEXT NOT NULL,
    authorId int NOT NULL,
    tags varchar(64) NULL,
    KEY(authorId)
);

