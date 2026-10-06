# MyBDPhone Call Center CMS — 2026-10-04

## What was added

The public `/call-center` landing page is now a first-class CMS landing page based on the structure of the PBX.BD Call Center Solution page.

Included sections:
1. Hero / value proposition
2. Call-center overview
3. Flexible pricing / sales message
4. 12 individually manageable call-center features
5. Smart call operations
6. Free consultation
7. FAQ
8. Final CTA

The feature list includes:
- Multi-Level IVR
- Advanced Call Distribution
- Call Waiting
- Call Forwarding
- Queue Management
- Call Transfer
- Call Routing
- Music On Hold
- Load Balancing
- Schedule Call Back
- Conference Bridge
- Call Recording

## No-code admin management

Go to:

**Admin → CMS & Site Management → Pages & Landing CMS → Call Center Solution**

Open **Sections** on the Call Center page.

For every section the admin can:
- Add
- Edit
- Delete
- Active / inactive
- Move up / down
- Change section type
- Edit title and subtitle
- Rich-text edit content
- Choose/upload image
- Set image left/right
- Set image alignment left/center/right
- Set text alignment left/center/right
- Set CTA text and URL
- Link a CMS collection

For the feature grid, click **Manage Items** on the `call_center_features` collection.

Each feature can be:
- Added
- Edited
- Deleted
- Reordered
- Active/inactive
- Given a custom image
- Given an icon
- Given a description
- Given a badge/label

## Database

A new migration was added:

`db-migrations/014_call_center_cms.sql`

The server also bootstraps the page automatically from `cmsController.js`, so an API request after deployment can initialize the page/sections/items if the database already contains the base CMS tables.

## Frontend route

`/call-center`

The route is explicitly handled by:

`src/pages/public/CallCenter.jsx`

## Important

The PBX.BD page was used as a structural/content reference. The MyBDPhone implementation uses original MyBDPhone wording, branding and CMS-managed content rather than copying the source site's HTML/CSS.
