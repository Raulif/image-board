DROP TABLE IF EXISTS comments;

CREATE TABLE comments(
    id SERIAL PRIMARY KEY,
    image_id INTEGER NOT NULL,
    username VARCHAR(255) NOT NULL,
    comment_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO comments (image_id, username, comment_text) VALUES ('78', 'funkychicken', 'Nice bridge!');
INSERT INTO comments (image_id, username, comment_text) VALUES ('78', 'discoduck', 'Dunno, looks kinda old to me');
INSERT INTO comments (image_id, username, comment_text) VALUES ('78', 'funkychicken', 'You have no idea about history ducky!');
