# Seed Investment Platforms Content

This script adds the **Investment Platforms** content and design into every service page.

## Data source

- **Direct (default):** Reads current `service_pages` from Supabase.
- **Backup file:** Use `--backup <path>` to read from a JSON file instead.  
  The file must look like:
  - `{ "pages": [ { "id", "title", "sections", "fields", "formStyles", ... } ] }`, or
  - `{ "content": { "pages": [ ... ] } }`

If you have `supabase/Backupinstrak20feb/` (SQL dumps), export the `site_content` row for `id = 'service_pages'` as JSON (e.g. from Supabase Dashboard → Table Editor → copy as JSON), save as e.g. `supabase/Backupinstrak20feb/service_pages.json`, then run:

```bash
node scripts/seed-investment-platforms-content.cjs --backup supabase/Backupinstrak20feb/service_pages.json --preview
```

## Content and design

- Content is defined in **`scripts/investment-platforms-content.json`** (intro + per-platform blocks).
- Design is **fixed to match the site**: dark blue backgrounds (`#1A365D`, `#0A3D62`, `#0F2942`), white text, gold accent, and layout types: `hero`, `standard`, `list`.

## Commands

```bash
# Generate SQL for Supabase SQL Editor (paste and run there)
node scripts/seed-investment-platforms-content.cjs --output-sql
# Writes scripts/seed-investment-platforms-content.sql

# Preview only (no DB write)
node scripts/seed-investment-platforms-content.cjs --preview

# Read from Supabase, apply content, save back to Supabase
node scripts/seed-investment-platforms-content.cjs --save

# Read from backup file, preview
node scripts/seed-investment-platforms-content.cjs --backup path/to/content.json --preview

# Read from backup file, then save to Supabase
node scripts/seed-investment-platforms-content.cjs --backup path/to/content.json --save
```

For `--save` you need Supabase credentials in `.env`; using `VITE_SUPABASE_SERVICE_ROLE_KEY` avoids RLS issues.

### Using the SQL script in Supabase

1. Run: `node scripts/seed-investment-platforms-content.cjs --output-sql`
2. Open **Supabase Dashboard → SQL Editor**.
3. Paste the contents of `scripts/seed-investment-platforms-content.sql` and run it.

The script replaces the full `service_pages` content with all 12 services and their Investment Platforms sections. The final `SELECT` shows the updated row and page count.

## Service mapping

Platform content is applied by service `id`:

| Service ID             | Platform content key   |
|------------------------|------------------------|
| aum                    | aum                    |
| private-wealth         | private-wealth        |
| share-financing        | share-financing        |
| equity-financing       | equity-financing       |
| real-estate-financing  | real-estate-financing  |
| merger-acquisition     | merger-acquisition     |
| gig                    | gig                    |
| virtual-cfo            | virtual-cfo            |
| asset-insurance        | asset-insurance        |
| tokenization          | tokenization           |
| reits                  | reits                  |
| ppli                   | ppli                   |

Any other service in the DB gets the shared intro (hero + introduction) only.
