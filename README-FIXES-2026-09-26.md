# MyBDPhone — Final Application Fix Pack — 2026-09-26

## Fixed

1. User sidebar active state no longer highlights both `Services & Packages` and `My Subscriptions`.
   - Services & Packages: `/user/packages`
   - My Subscriptions: `/user/subscriptions`

2. Subscription checkout modal is now vertically scrollable on mobile and desktop.
   - Long voucher/manual payment forms no longer overflow the viewport.

3. Manual / Voucher package payment SQL error fixed.
   - Corrected the `orders` INSERT placeholder count in `manualCheckout`.

4. Admin order status is database-driven and transactional.
   - Pending / Processing / Active / Completed / Cancelled / Refunded are persisted.
   - Activating an unpaid package is blocked.
   - When an eligible paid package is activated from the order queue, the subscription is provisioned.
   - User receives an order-status notification.

5. Admin dashboard analytics are dynamic.
   - Revenue uses paid active/completed orders.
   - Recharge volume uses completed recharges.
   - Monthly chart uses the current month plus previous five months from MySQL.
   - Service split is calculated from active IP Phone vs AI Calling subscriptions.
   - Dashboard refreshes automatically every 60 seconds and has a manual Refresh button.

6. Support Helpdesk upgraded.
   - Search
   - Department filter
   - Priority filter
   - Status filter
   - Admin assignment
   - Priority editing
   - Department editing
   - Internal staff notes
   - Status updates notify the customer
   - Existing conversation/reply flow preserved

## Database

The server automatically attempts to add the new support fields at startup. A manual migration is also included:

`db-migrations/006_support_helpdesk_upgrade.sql`

Fields:
- `support_tickets.assigned_admin_id`
- `support_tickets.internal_notes`

## Verification performed

- Node syntax check passed for all server `.js` files.
- TypeScript JSX parser check passed for all client `.jsx` / `.js` files.

The client dependency directory in the working environment did not contain the Vite executable, so a full `vite build` could not be executed in this packaging environment. Run `npm install` then `npm run build` in the client folder locally.
