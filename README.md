# Pulse — Modern Web Application Dashboard

Task 6: React components, shared state, an async data service, charts, and analytics.

## Run

Use Node.js 22.12 or newer supported LTS. From this folder:

```bash
npm install
npm run dev
```

Open the URL printed by Vite. Do not open index.html directly.

## Build and present

```bash
npm run build
npm run preview
```

The production output is `dist/`. Upload its contents to a static host, or
connect the project to a host with build command `npm run build` and output
directory `dist`. This download is source code; it has not been deployed.

## Features

- Overview, Orders, and Analytics views.
- Reporting period: last 7 or 30 local calendar days, including today.
- Paid revenue, total order count, average paid order, and pending count.
- Daily revenue bars with exact values available in a data table.
- Search orders by customer/ID and filter by status.
- Add demo orders with validated amounts and statuses.
- Local browser persistence and storage-error notices.
- Responsive layout, semantic labels, keyboard access, and native dialog.

## Data and scope

The initial orders are fictional. The async service uses localStorage and
does not call a live API. Replace `loadOrders` and `saveOrders` with backend
requests to integrate a real data source. This assignment does not process
payments. If browser storage fails, changes last for the current page session.

Revenue excludes pending and cancelled orders. Money is stored in integer
paise. The reporting-period filter affects every widget. Search and status
filters affect only the orders table. Existing demo dates stay unchanged when
reloading later; older orders may fall outside the selected reporting period.

## Structure

- `src/App.jsx`: shared state and dashboard composition.
- `src/components/`: reusable cards, chart, table, and order form.
- `src/services/orders.js`: demo persistence, date helpers, and analytics.
- `src/main.jsx`: React entry point.
- `src/style.css`: dashboard and responsive styles.

## Checks before submission

Try both reporting periods, all three views, combined table filters, a valid
new order, a name containing only spaces, and an invalid amount. Confirm that
only paid orders increase revenue. Refresh to check persistence. Check the
layout at phone, tablet, and desktop widths.