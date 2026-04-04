# Huong dan Docker cho project Node.js

Tai lieu nay gom 3 phan:

- Build image co ban tu Dockerfile hien tai
- Build image multi-stage va build tung stage tu Dockerfile.optimized
- Quy trinh PostgreSQL: pull image -> insert data -> container -> image

## 1) Dockerfile container -> image (co ban)

Ban dang co file Dockerfile trong thu muc project.

Lenh build image:

    docker build -t node-docker-simple:basic .

Lenh run container:

    docker run -d --name node-app-basic -p 3000:3000 node-docker-simple:basic

Lenh test nhanh API:

    curl http://localhost:3000

## 2) Build multi-stage va build tung stage

Da tao file Dockerfile.optimized theo dung kieu multi-stage voi cac stage:

- base
- deps-dev
- build
- deps-prod
- runtime

### Build tung stage (de hoc va debug)

Build stage deps-dev:

    docker build -f Dockerfile.optimized --target deps-dev -t node-docker-simple:deps-dev .

Build stage build:

    docker build -f Dockerfile.optimized --target build -t node-docker-simple:build .

Build stage deps-prod:

    docker build -f Dockerfile.optimized --target deps-prod -t node-docker-simple:deps-prod .

Build stage runtime (image cuoi de run):

    docker build -f Dockerfile.optimized --target runtime -t node-docker-simple:multistage .

### Build image cuoi bang multi-stage

    docker build -f Dockerfile.optimized -t node-docker-simple:multistage .

Lenh run container:

    docker run -d --name node-app-multistage -p 3001:3000 node-docker-simple:multistage

Kiem tra kich thuoc image:

    docker images | findstr node-docker-simple

## 3) PostgreSQL: pull image -> insert data -> container -> image

### Buoc A: Pull image Postgres

    docker pull postgres:16-alpine

### Buoc B: Tao va chay container Postgres

    docker run -d --name pg-lab -e POSTGRES_PASSWORD=123456 -e POSTGRES_USER=admin -e POSTGRES_DB=labdb -p 5432:5432 postgres:16-alpine

### Buoc C: Insert data vao Postgres

Cach nhanh bang 1 lenh:

    docker exec -i pg-lab psql -U admin -d labdb -c "CREATE TABLE IF NOT EXISTS students(id SERIAL PRIMARY KEY, name VARCHAR(100)); INSERT INTO students(name) VALUES ('An'),('Binh');"

Kiem tra data:

    docker exec -it pg-lab psql -U admin -d labdb -c "SELECT * FROM students;"

### Buoc D: Dong goi container thanh image moi

Sau khi da insert data, commit container thanh image:

    docker commit pg-lab postgres-lab:seeded

Kiem tra image moi:

    docker images | findstr postgres-lab

Chay container moi tu image da seeded:

    docker run -d --name pg-lab-seeded -p 5433:5432 -e POSTGRES_PASSWORD=123456 postgres-lab:seeded

## 4) Mot so lenh quan ly nhanh

Dung container:

    docker stop node-app-basic node-app-multistage pg-lab pg-lab-seeded

Xoa container:

    docker rm node-app-basic node-app-multistage pg-lab pg-lab-seeded

Xoa image:

    docker rmi node-docker-simple:basic node-docker-simple:multistage postgres-lab:seeded

---

Neu muon, co the doi sang cach seed chuan hon bang docker-entrypoint-initdb.d (tao SQL script va mount vao luc khoi tao lan dau).
