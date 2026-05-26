# Backend + Data Model Guide

This document captures a backend plan aligned with the current Next.js codebase and UI. The goal is to track Shopify-based product prices, allow users to set target prices, and send email + web push notifications when a target is reached.

## Goals

- Support Shopify product URLs for price checks.
- Allow users to set a target price from the Add Product page.
- Run a daily cron job to check prices and notify users.
- Product page displays only: title, price, image.

## Current Context

- NextAuth is configured with MongoDB adapter (see auth.ts).
- MongoDB client is initialized in lib/db.ts.
- Add Product UI already fetches Shopify JSON for Outfitters.

## MongoDB Data Model

The NextAuth adapter manages these collections automatically:

- users
- accounts
- sessions
- verificationTokens

Add the following collections for price tracking.

### products

Stores normalized product data from Shopify and the latest known price.

Example:

{
	_id: ObjectId,
	store: "outfitters",
	handle: "mens-pleated-trousers",
	canonicalUrl: "https://outfitters.com.pk/products/mens-pleated-trousers",
	title: "Pleated Wide-Leg Trousers",
	image: "https://...",
	currency: "PKR",
	latestPrice: 7990,
	lastCheckedAt: ISODate("2026-05-26T00:00:00Z"),
	createdAt: ISODate("2026-05-20T10:00:00Z"),
	updatedAt: ISODate("2026-05-26T00:00:00Z")
}

Indexes:

- Unique on { store, handle }
- Index on { canonicalUrl }

### price_snapshots

Stores historical price checks for tracking and analytics.

Example:

{
	_id: ObjectId,
	productId: ObjectId,
	price: 7990,
	currency: "PKR",
	checkedAt: ISODate("2026-05-26T00:00:00Z")
}

Indexes:

- Index on { productId, checkedAt: -1 }

### price_alerts

Represents a user tracking a product with a target price.

Example:

{
	_id: ObjectId,
	userId: ObjectId,
	productId: ObjectId,
	targetPrice: 6500,
	currency: "PKR",
	isActive: true,
	createdAt: ISODate("2026-05-20T10:00:00Z"),
	updatedAt: ISODate("2026-05-26T00:00:00Z"),
	lastNotifiedAt: ISODate("2026-05-25T00:00:00Z")
}

Indexes:

- Unique on { userId, productId }
- Index on { isActive, updatedAt }

### notification_queue

Stores notification events that should be delivered or have been delivered.

Example:

{
	_id: ObjectId,
	userId: ObjectId,
	productId: ObjectId,
	channel: "email" | "push",
	payload: {
		title: "Price Drop",
		body: "Pleated Wide-Leg Trousers is now PKR 6,500",
		url: "/product/123"
	},
	status: "pending" | "sent" | "failed",
	error: "...",
	createdAt: ISODate("2026-05-26T00:00:00Z"),
	sentAt: ISODate("2026-05-26T00:01:00Z")
}

Indexes:

- Index on { status, createdAt }

### push_subscriptions

Stores browser push subscriptions per user.

Example:

{
	_id: ObjectId,
	userId: ObjectId,
	endpoint: "https://fcm.googleapis.com/fcm/send/...",
	keys: { p256dh: "...", auth: "..." },
	createdAt: ISODate("2026-05-26T00:00:00Z"),
	updatedAt: ISODate("2026-05-26T00:00:00Z")
}

Indexes:

- Unique on { userId, endpoint }

## API Route Plan

Suggested Next.js app routes:

- POST /api/products/preview
	- Input: { url }
	- Output: { title, image, price, store, canonicalUrl, handle }
	- Uses Shopify JSON endpoint and normalizes data.

- POST /api/watchlist
	- Input: { url, targetPrice }
	- Flow: preview -> upsert product -> create price_alert.
	- Output: { productId, alertId }

- GET /api/products/:id
	- Output (product page needs only): { title, image, latestPrice }

- GET /api/watchlist
	- Output: list of active alerts with product basics.

- POST /api/push/subscribe
	- Input: { subscription }
	- Stores a push subscription for the user.

- POST /api/cron/daily
	- Protected with a secret header for scheduled checks.

## Cron Job Flow (Daily)

1. Load active price_alerts and join product basics.
2. For each product, fetch latest price from Shopify JSON.
3. Insert a price_snapshots record.
4. Update products.latestPrice and lastCheckedAt.
5. If latestPrice <= targetPrice and not recently notified:
	 - create notification_queue items (email + push)
	 - send notifications
	 - update price_alerts.lastNotifiedAt

## Shopify Price Fetch Notes

Most Shopify stores expose a JSON endpoint at:

- {productUrl}.json

The Add Product page already uses this pattern for Outfitters. The backend should reuse the same logic, normalize the response, and be the source of truth for prices.

## UI Data Contract

Product page displays only:

- title
- price (latestPrice)
- image

The API should return only these fields for the product detail call.

## Notifications

Email uses the existing Nodemailer setup in auth.ts. For price drops, reuse the same transport and send a dedicated template.

Web push requires:

- VAPID keys
- A service worker in the public folder
- Storing subscriptions in push_subscriptions

## Environment Variables

- MONGODB_URI
- EMAIL_SERVER_HOST
- EMAIL_SERVER_PORT
- EMAIL_SERVER_USER
- EMAIL_SERVER_PASSWORD
- EMAIL_FROM
- CRON_SECRET
- VAPID_PUBLIC_KEY
- VAPID_PRIVATE_KEY

## Open Questions

- Do we mark alerts as inactive after one notification or keep them active?
- Should we allow multiple target prices per product per user?
- Is the daily schedule fixed or configurable per user?
