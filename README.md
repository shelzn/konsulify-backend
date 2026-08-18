# Konsulify Backend

REST API untuk aplikasi mobile Konsulify, sistem katalog konsultan dan booking konsultasi online.

## Stack

- Bun + Express.js + TypeScript
- Drizzle ORM
- MySQL
- Zod validation
- JWT authentication
- bcryptjs password hashing
- Multer upload media

## Struktur

```text
src/
  config/
  db/schema/
  middleware/
  modules/
  utils/
  app.ts
  server.ts
```

## Setup

1. Salin `.env.example` menjadi `.env`.
2. Isi `DATABASE_URL` dan `JWT_SECRET`.
3. Jalankan database MySQL dan buat database `konsulify`.
4. Install dependency:

```bash
bun install
```

5. Push schema:

```bash
bun run db:push
```

6. Jalankan seeder:

```bash
bun run db:seed
```

7. Jalankan server:

```bash
bun run dev
```

API berjalan di `http://localhost:3000`.

## Docker

Build image:

```bash
docker build -t konsulify-backend .
```

Run container:

```bash
docker run --env-file .env -p 3000:3000 konsulify-backend
```

Jika database MySQL berjalan di host machine, gunakan host yang dapat diakses container, misalnya `host.docker.internal` pada `DATABASE_URL`.

## Akun Admin Development

- Email: `admin@konsulify.test`
- Password: `admin12345`

Jangan gunakan kredensial ini untuk production.

## Fitur Backend Saat Ini

- Auth register, login, logout, forgot/reset password
- Middleware authenticate dan authorize role
- CRUD admin category, consultant, service, schedule
- Upload media category, consultant, service
- Public catalog endpoint
- Booking user dengan transaksi dan pencegahan double booking
- User booking history dan ownership check
- Admin booking management dan dashboard statistik sederhana
- Seeder data awal

Dokumentasi endpoint tersedia di [docs/API.md](docs/API.md).
