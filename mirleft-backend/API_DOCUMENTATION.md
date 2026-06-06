# Mirleft Travel API Documentation

## Public Endpoints

- `POST /api/chat` - Gemini travel assistant (`message`). Returns `{ reply, mode }` where `mode` is `gemini` or `fallback`.
- `GET /api/vacation-rentals` - Villas, guesthouses, and riads (alias of properties with type filter).
- `GET /api/faqs` - FAQ list (optional `?category=`).
- `GET /api/home` - Homepage payload (featured destinations/hotels/restaurants/activities).
- `GET /api/search?q=keyword` - Global search + autocomplete suggestions.
- `GET /api/destinations` - Destination listing with filters (`search`, `region`, `type`, `sort_by`, `page`).
- `GET /api/destinations/{slug}` - Destination detail page payload + SEO + related listings.
- `GET /api/properties` - Hotels/guest houses with filters and pagination.
- `GET /api/restaurants` - Restaurants with filters and pagination.
- `GET /api/activities` - Activities with filters and pagination.
- `GET /api/reviews` - Approved reviews with sorting (`newest`, `highest`, `lowest`).

## Authenticated Endpoints

- `POST /api/reviews` - Create review (throttled, moderated as pending).
- `PATCH /api/reviews/{id}` - Edit review.
- `DELETE /api/reviews/{id}` - Delete review.
- `POST /api/favorites/toggle` - Save/remove favorites for destinations/hotels/restaurants/activities.
- `GET /api/favorites` - User favorites grouped by content type.
- `PATCH /api/me` - Update profile (`name`, `bio`, `avatar`, `social_links`).
- `POST /api/photos` - Upload media (`file`) or URL (`url`) with Laravel storage.

## Admin Endpoints (`auth:sanctum` + `admin`)

- Dashboard & analytics:
  - `GET /api/admin/dashboard`
  - `GET /api/admin/statistics`
- Users:
  - `GET /api/admin/users`
  - `PATCH /api/admin/users/{id}`
  - `PATCH /api/admin/users/{id}/ban`
  - `PATCH /api/admin/users/{id}/unban`
  - `DELETE /api/admin/users/{id}`
- Reviews moderation:
  - `GET /api/admin/reviews`
  - `PATCH /api/admin/reviews/{id}/moderate` (`status`: `approved|rejected|pending`)
- Destinations CRUD:
  - `POST /api/destinations`
  - `PATCH /api/destinations/{id}`
  - `DELETE /api/destinations/{id}`
- Hotels/Restaurants/Activities CRUD:
  - Existing create/update/delete endpoints under `/api/properties`, `/api/restaurants`, `/api/activities`.

## Environment

- `GEMINI_API_KEY` — enables live Gemini responses for `/api/chat`.
- `ALLOWED_ORIGINS` — comma-separated CORS origins for the SPA.

## Scraper

- `php artisan mirleft:scrape` — runs `scraper/scrape_local.js` (or `scrape.js`) and imports `scraper/hotels.json`.
- `php artisan mirleft:scrape --skip-node` — import existing JSON only.

## Notes

- Run `php artisan storage:link` to serve uploaded media.
- Photo uploads require auth; only the owner or an admin may update/delete a photo.
- Review/user/content queries are optimized with eager loading and DB indexes from migrations.
- Cache is applied to `/api/home` for faster homepage responses.
