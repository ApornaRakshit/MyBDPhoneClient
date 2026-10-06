# MyBDPhone Local Cloud PBX CMS Fix

## What was fixed

1. Local Vite now uses `http://localhost:5000/api`.
2. Production builds use `https://api.mybdphone.com/api` through `.env.production`.
3. Cloud PBX admin Sections now auto-repair if the page exists but has zero sections.
4. Added `POST /api/cms/admin/pages/:pageId/repair-cloud-pbx`.
5. Backend repairs Cloud PBX before reading the public page status.
6. Public `/cloud-pbx` never collapses to only the page title + footer when the local CMS is empty; it has a first-run visual fallback while CMS data is being initialized.
7. Existing CMS edits are preserved by the idempotent server bootstrap.

## Local run

### Server
```bash
cd mybdphone-server
npm install
npm run dev
```

Expected:
```text
API: http://localhost:5000
```

### Client
```bash
cd mybdphone-client
npm install
npm run dev
```

Expected:
```text
http://localhost:5173
```

Then open:
```text
http://localhost:5173/admin/cms/pages
```

Open `Cloud PBX` -> `Sections`.

The first request will repair/create the Cloud PBX sections automatically.

## If the Sections modal still says "No sections found"

Use the green `Repair Cloud PBX CMS` button in the modal.

The admin page uses the new repair endpoint and also has a compatibility fallback that creates the default sections through the normal CMS API.

## Optional database check

```sql
SELECT id, title, slug, status
FROM cms_pages
WHERE slug = 'cloud-pbx';

SELECT id, page_id, section_key, section_type, title, status, sort_order
FROM cms_sections
WHERE page_id = (
  SELECT id FROM cms_pages WHERE slug = 'cloud-pbx' LIMIT 1
)
ORDER BY sort_order, id;
```

You should see 11 Cloud PBX section rows.

## Optional manual SQL repair

`mybdphone-server/db-migrations/014_cloud_pbx_cms_repair.sql`

The server normally repairs this automatically, so manual SQL is not required in a correctly running local server.

## Important

Do not keep two `VITE_API_URL` values in the same `.env` file. This fix intentionally keeps:
- `.env` = localhost API
- `.env.production` = production API

After changing `.env`, completely restart Vite.
