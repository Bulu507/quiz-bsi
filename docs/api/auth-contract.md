# Auth API Contract

Sumber: `docs/api/colections/00 - Authorisation.postman_collection.json`, diverifikasi ke `https://test-bsi.jolly.my.id`.

## POST `/login`

Request:

```json
{
  "username": "admin",
  "password": "admin"
}
```

Response:

```json
{
  "message": "Berhasil login",
  "data": {
    "user": {
      "id": 1,
      "fb_uid": null,
      "fb_provider": null,
      "name": "Admin",
      "role": "admin",
      "username": "admin",
      "created_at": "2026-05-08T09:41:52Z",
      "updated_at": "2026-05-15T07:43:31Z",
      "last_login_at": "2026-05-15T07:43:32Z"
    },
    "token": "<jwt>"
  }
}
```

Role backend:

- `admin` -> app role `ADMIN`
- `peserta` -> app role `PESERTA`

## POST `/login/fb`

Request body kosong. Firebase ID token dikirim sebagai Bearer token:

```http
Authorization: Bearer <firebase-id-token>
```

Response mengikuti bentuk `/login`.

Catatan frontend: role Google login selalu dipaksa menjadi `PESERTA`.
