# MyBDPhone CMS Dynamic Landing Update

## What changed

### Home page
- `cms_sections` no longer overwrites admin-edited Home section titles/subtitles during bootstrap.
- Built-in Home sections are linked to their CMS collections (`hero`, service cards, offerings, advantages, add-ons, FAQ), so the Pages & Landing CMS `Manage Items` action can edit them without source-file changes.
- Home Page Manager now uses the CMS Home page id when creating custom sections, so adding sections still works even when the existing section list is empty.
- Home landing headings/subtitles and hero image can respect the corresponding CMS section edits.

### Cloud PBX page
- `/cloud-pbx` is now a dedicated database-driven landing page.
- Cloud PBX is automatically created if missing and published when it is still a fresh draft.
- Existing inactive Cloud PBX pages are not re-published by the bootstrap code.
- The page contains CMS sections for hero, pricing, comparison, overview, features, benefits, consultation, documents, clients, FAQ and CTA.
- Cloud PBX content collections are fully editable from the Sections modal:
  - cloud_pbx_packages
  - cloud_pbx_features
  - cloud_pbx_benefits
  - cloud_pbx_documents
  - cloud_pbx_clients
  - cloud_pbx_faq
- Each collection supports add, edit, active/inactive, move up/down and delete.
- Section editor supports type selection, title/subtitle, image upload, buttons, phone/hours, linked collections and advanced JSON settings.

## Admin usage

1. Open `Control Room -> CMS & Site Management -> Pages & Landing CMS`.
2. Open `Sections` for `Home` or `Cloud PBX`.
3. Use the eye button for active/inactive.
4. Use pencil to edit section data.
5. Use `Manage Items` for collection-backed sections.
6. Use up/down to change live page order.
7. Use delete to remove a section.
8. Use `Add Section` to create another block.
9. Save a section/item and refresh the public page. The public page reads the latest database content.

## Deployment

### Server
Replace the server source with the updated `mybdphone-server` package. Restart Node/Passenger after upload. The CMS bootstrap will create missing Cloud PBX collections and sections automatically.

### Client
Build the client normally with the existing project scripts and deploy the generated `dist` folder.

No MongoDB changes are required. The CMS continues to use MySQL.
