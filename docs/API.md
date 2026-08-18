# Konsulify API

Base URL: `http://localhost:3000/api/v1`

Semua response memakai format:

```json
{ "success": true, "message": "Data berhasil diambil.", "data": {} }
```

## Auth

| Method | Endpoint | Auth | Role | Keterangan |
| --- | --- | --- | --- | --- |
| POST | `/auth/register` | Tidak | Guest | Register user baru |
| POST | `/auth/login` | Tidak | Guest | Login dan mendapatkan JWT |
| POST | `/auth/logout` | Ya | User/Admin | Logout client-side |
| POST | `/auth/forgot-password` | Tidak | Guest | Membuat token reset |
| POST | `/auth/reset-password` | Tidak | Guest | Reset password |

## Public Catalog

| Method | Endpoint | Auth | Keterangan |
| --- | --- | --- | --- |
| GET | `/categories` | Tidak | Daftar kategori aktif |
| GET | `/consultants` | Tidak | Daftar konsultan aktif, mendukung `search`, `category`, `page`, `limit` |
| GET | `/consultants/:id` | Tidak | Detail konsultan dan layanan |
| GET | `/consultants/:id/schedules` | Tidak | Jadwal tersedia |
| GET | `/services` | Tidak | Daftar layanan aktif |
| GET | `/services/:id` | Tidak | Detail layanan |

## User

| Method | Endpoint | Auth | Keterangan |
| --- | --- | --- | --- |
| GET | `/me` | Ya | Profil login |
| PATCH | `/profile` | Ya | Ubah profil |
| PATCH | `/profile/password` | Ya | Ubah password |
| POST | `/bookings` | Ya | Buat booking |
| GET | `/bookings` | Ya | Booking milik sendiri |
| GET | `/bookings/:id` | Ya | Detail booking milik sendiri |
| PATCH | `/bookings/:id/cancel` | Ya | Batalkan booking |

## Admin

Semua endpoint admin wajib `Authorization: Bearer <token>` dengan role `admin`.

| Resource | Endpoint |
| --- | --- |
| Dashboard | `GET /admin` |
| Users | `GET /admin/users` |
| Categories | `GET/POST /admin/categories`, `GET/PATCH/DELETE /admin/categories/:id` |
| Consultants | `GET/POST /admin/consultants`, `GET/PATCH/DELETE /admin/consultants/:id` |
| Services | `GET/POST /admin/services`, `GET/PATCH/DELETE /admin/services/:id` |
| Schedules | `GET/POST /admin/schedules`, `GET/PATCH/DELETE /admin/schedules/:id` |
| Bookings | `GET /admin/bookings`, `GET /admin/bookings/:id`, `PATCH /admin/bookings/:id/status` |

Upload media memakai `multipart/form-data`:

- Category: field `image`
- Consultant: field `photo`
- Service: field `image`

Format file: JPG, PNG, WebP. Maksimal 2 MB.
