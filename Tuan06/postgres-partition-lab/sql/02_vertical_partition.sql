-- Vertical partition example
-- Split user table into basic columns and profile columns

DROP TABLE IF EXISTS user_profile;
DROP TABLE IF EXISTS user_basic;

CREATE TABLE user_basic (
    user_id        BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    email          TEXT NOT NULL UNIQUE,
    password_hash  TEXT NOT NULL,
    status         TEXT NOT NULL DEFAULT 'active',
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE user_profile (
    user_id        BIGINT PRIMARY KEY,
    full_name      TEXT,
    phone          TEXT,
    birth_date     DATE,
    avatar_url     TEXT,
    bio            TEXT,
    address        TEXT,
    preferences    JSONB,
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT fk_user_profile_user
        FOREIGN KEY (user_id) REFERENCES user_basic(user_id) ON DELETE CASCADE
);

CREATE INDEX idx_user_profile_full_name ON user_profile (full_name);

INSERT INTO user_basic (email, password_hash)
VALUES ('alice@example.com', 'hashed_pw_1');

INSERT INTO user_profile (user_id, full_name, bio, preferences)
VALUES (1, 'Alice', 'I love PostgreSQL', '{"lang":"en","theme":"light"}');
