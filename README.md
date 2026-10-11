# Mbare Musika Web Frontend

React + Vite marketplace frontend.

## Run locally

1. Install Node.js 20.19+ or 22.12+.
2. Run `npm install`.
3. Copy `.env.example` to `.env` and set `VITE_API_URL=http://localhost:4000/api` for local API development.
4. Run `npm run dev -- --host 0.0.0.0`.
5. Run `npm run build` to create the production build in `dist/`.

## API configuration for deployment

Set `VITE_API_URL` in your hosting provider's environment variables to the public HTTPS API base URL, ending in `/api`. A local address such as `localhost` or `192.168.x.x` is not suitable for public customers. The API must allow the website origin through CORS.

## Current frontend features

- Responsive marketplace layout adjustments for mobile screens.
- Product listing loaded from `GET /products` when the API is available; preview listings are shown as a fallback.
- Product search and category filtering.
- Persistent cart and wishlist in the browser.
- Product detail dialog, quantity controls, remove-from-cart, subtotal.
- Login and customer registration dialogs using `/auth/login` and `/auth/register`.
- Seller/rider registration forms that send role information to the API.
- Checkout sends product UUIDs, quantities, and delivery area/address to `POST /orders`.
- Order history requests `GET /orders/mine`.
- Help, delivery, contact, and about dialogs.

## Before public release

Verify the actual API request/response contract and test registration, login, product loading, checkout, and order history against the deployed backend. The current order API accepts a delivery address but does not yet persist a separate delivery-area field, and checkout does not collect payment-card details. Configure HTTPS, production CORS, real support contact information, privacy/terms pages, and Play Store/website release requirements before public launch.
