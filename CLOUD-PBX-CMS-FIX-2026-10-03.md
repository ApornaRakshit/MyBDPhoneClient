# Cloud PBX CMS Fix — 2026-10-03

## Fixed
- Cloud PBX page sections are now repair-safe and database-driven.
- The backend automatically creates missing Cloud PBX sections and collections when the public page or admin Sections modal is opened.
- Existing administrator-edited sections, page status, and collection content are not overwritten.
- Cloud PBX overview now respects the section rich-text content instead of always using hard-coded body text.
- Admin Sections modal now shows loading/error/empty states instead of silently displaying a blank modal while the request fails or is still pending.
- Cloud PBX package editing has friendly controls for price, billing label, popular flag, button and features, plus the existing advanced JSON editor.

## Cloud PBX CMS sections
1. Hero
2. Pricing
3. Comparison
4. Overview
5. Features
6. Benefits
7. Consultation
8. Documents
9. Clients
10. FAQ
11. CTA

## Collections
- cloud_pbx_packages
- cloud_pbx_features
- cloud_pbx_benefits
- cloud_pbx_documents
- cloud_pbx_clients
- cloud_pbx_faq

## SQL
No new database migration is required. The existing CMS tables are reused.

## Deployment
Replace the client and server source, restart Node/Passenger, then open:
/admin/cms/pages

Open Cloud PBX -> Sections. The backend will repair missing sections automatically.
