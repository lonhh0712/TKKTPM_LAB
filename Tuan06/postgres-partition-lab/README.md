# PostgreSQL Partition Lab

This folder contains a complete example for:

- Horizontal partition
- Vertical partition
- Functional partition
- PostgreSQL SQL scripts for each style
- Node.js query examples for each style

## Folder structure

- sql/01_horizontal_partition.sql
- sql/02_vertical_partition.sql
- sql/03_functional_partition.sql
- node/db.js
- node/horizontal.query.js
- node/vertical.query.js
- node/functional.query.js

## Quick start

1. Create a database (example: `labdb`).
2. Run SQL files in order:

```sql
\i sql/01_horizontal_partition.sql
\i sql/02_vertical_partition.sql
\i sql/03_functional_partition.sql
```

3. Install Node.js dependency in this folder:

```bash
npm init -y
npm install pg
```

4. Run Node.js examples:

```bash
node node/horizontal.query.js
node node/vertical.query.js
node node/functional.query.js
```

## Notes

- Horizontal partition uses practical keys: `region_code` and `created_at`.
- Vertical partition splits user data into `user_basic` and `user_profile`.
- Functional partition separates domains into schemas: `user_domain`, `product_domain`, `order_domain`.
