-- Functional partition by domain using schemas
-- user_domain, product_domain, order_domain

CREATE SCHEMA IF NOT EXISTS user_domain;
CREATE SCHEMA IF NOT EXISTS product_domain;
CREATE SCHEMA IF NOT EXISTS order_domain;

DROP TABLE IF EXISTS order_domain.orders CASCADE;
DROP TABLE IF EXISTS product_domain.products CASCADE;
DROP TABLE IF EXISTS user_domain.users CASCADE;

CREATE TABLE user_domain.users (
    user_id      BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    email        TEXT NOT NULL UNIQUE,
    full_name    TEXT NOT NULL,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE product_domain.products (
    product_id    BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    sku           TEXT NOT NULL UNIQUE,
    product_name  TEXT NOT NULL,
    price         NUMERIC(12,2) NOT NULL,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE order_domain.orders (
    order_id      BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id       BIGINT NOT NULL,
    product_id    BIGINT NOT NULL,
    quantity      INT NOT NULL CHECK (quantity > 0),
    total_amount  NUMERIC(12,2) NOT NULL,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO user_domain.users (email, full_name)
VALUES ('john@example.com', 'John Doe');

INSERT INTO product_domain.products (sku, product_name, price)
VALUES ('SKU-100', 'Keyboard', 50.00);
