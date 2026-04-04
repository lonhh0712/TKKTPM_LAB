-- Horizontal partition examples
-- 1) LIST partition by region -> table_user01, table_user02, table_user03
-- 2) RANGE partition by date -> orders_2026_q1, orders_2026_q2

DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
    user_id       BIGINT GENERATED ALWAYS AS IDENTITY,
    full_name     TEXT NOT NULL,
    email         TEXT NOT NULL UNIQUE,
    region_code   TEXT NOT NULL,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, region_code)
) PARTITION BY LIST (region_code);

CREATE TABLE table_user01 PARTITION OF users
FOR VALUES IN ('APAC');

CREATE TABLE table_user02 PARTITION OF users
FOR VALUES IN ('EU');

CREATE TABLE table_user03 PARTITION OF users
FOR VALUES IN ('US');

CREATE TABLE table_user99 PARTITION OF users
DEFAULT;

CREATE INDEX idx_user01_created_at ON table_user01 (created_at);
CREATE INDEX idx_user02_created_at ON table_user02 (created_at);
CREATE INDEX idx_user03_created_at ON table_user03 (created_at);

INSERT INTO users (full_name, email, region_code)
VALUES
('An Nguyen', 'an@example.com', 'APAC'),
('Binh Tran', 'binh@example.com', 'EU'),
('Chris Lee', 'chris@example.com', 'US');

DROP TABLE IF EXISTS orders_by_date CASCADE;

CREATE TABLE orders_by_date (
    order_id      BIGINT GENERATED ALWAYS AS IDENTITY,
    user_id       BIGINT NOT NULL,
    total_amount  NUMERIC(12,2) NOT NULL,
    created_at    DATE NOT NULL,
    PRIMARY KEY (order_id, created_at)
) PARTITION BY RANGE (created_at);

CREATE TABLE orders_2026_q1 PARTITION OF orders_by_date
FOR VALUES FROM ('2026-01-01') TO ('2026-04-01');

CREATE TABLE orders_2026_q2 PARTITION OF orders_by_date
FOR VALUES FROM ('2026-04-01') TO ('2026-07-01');

CREATE TABLE orders_2026_rest PARTITION OF orders_by_date
DEFAULT;

INSERT INTO orders_by_date (user_id, total_amount, created_at)
VALUES
(1, 100.00, '2026-01-15'),
(2, 200.00, '2026-05-10');
