# Price Watch - PWA & Complete Setup Guide

## 🎉 Welcome to Price Watch

Your complete price tracking application is now ready! This guide will help you complete the setup and deployment.

---

## 📱 PWA (Progressive Web App) Setup

### What's Included

✅ **Service Worker** - Handles push notifications and offline caching
✅ **Web App Manifest** - Makes the app installable on phones and desktops
✅ **VAPID Keys** - Enables secure web push notifications
✅ **Offline Support** - Cache-first strategy for core assets
✅ **Background Sync** - Queues notifications for offline delivery

### Generate VAPID Keys

1. Open your terminal in the project directory
2. Run:

   ```bash
   npx web-push generate-vapid-keys
   ```

3. Copy the output keys to your `.env.local`:
   ```
   VAPID_PUBLIC_KEY=your-generated-public-key
   NEXT_PUBLIC_VAPID_PUBLIC_KEY=your-generated-public-key
   VAPID_PRIVATE_KEY=your-generated-private-key
   VAPID_EMAIL=your-email@example.com
   ```

### PWA Icons

Create placeholder icons or replace with your own branding:

```bash
# Create a basic 512x512 PNG icon and save it as:
public/icon-512x512.png
public/icon-192x192.png
public/icon-144x144.png
public/icon-96x96.png
public/icon-72x72.png
public/badge-72x72.png
```

The manifest file references these icons for:

- Home screen shortcuts (Android/iOS)
- Browser address bar icon
- Splash screen (iOS)
- PWA sidebar icon

### Install Locally for Testing

1. Start your Next.js development server:

   ```bash
   pnpm dev
   ```

2. Open your app in Chrome/Firefox/Edge
3. Look for "Install" button in the address bar
4. Click to install as a desktop/mobile app

---

## 🔐 Environment Variables Complete Setup

### Required Variables

```bash
# Create .env.local with:

# Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/price-watch

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=$(openssl rand -base64 32)

# Email Notifications
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=app-specific-password
EMAIL_FROM=noreply@price-watch.app

# Web Push Notifications
VAPID_PUBLIC_KEY=generated-public-key
NEXT_PUBLIC_VAPID_PUBLIC_KEY=generated-public-key
VAPID_PRIVATE_KEY=generated-private-key
VAPID_EMAIL=admin@price-watch.app

# Scheduled Jobs
CRON_SECRET=random-secret-string

# OAuth (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

---

## 📂 Project Structure Complete

```
price-watch/
├── app/
│   ├── api/
│   │   ├── products/
│   │   │   ├── preview/route.ts        # Fetch product from URL
│   │   │   └── [id]/route.ts           # Get product by ID
│   │   ├── watchlist/route.ts          # Add/Get/Remove watchlist items
│   │   ├── push/subscribe/route.ts     # Subscribe to push notifications
│   │   └── cron/daily/route.ts         # Daily price check & notify
│   ├── (authenticated)/
│   │   ├── layout.tsx                  # Authenticated routes
│   │   ├── add-product/page.tsx        # Add product page
│   │   ├── watchlist/page.tsx          # View watchlist
│   │   ├── profile/page.tsx            # User profile
│   │   └── search/page.tsx             # Search products
│   ├── (auth)/
│   │   ├── login/page.tsx              # Login page
│   │   └── signup/page.tsx             # Signup page
│   ├── layout.tsx                      # Root layout with PWA
│   └── globals.css                     # Global styles
├── components/
│   ├── pwa-initializer.tsx             # PWA setup
│   ├── email-signin-form.tsx           # Email signin
│   ├── email-signup-form.tsx           # Email signup
│   └── ui/                             # UI components
├── lib/
│   ├── db.ts                           # Singleton DB connection
│   ├── db.init.ts                      # DB initialization
│   ├── use-service-worker.ts           # Service Worker hook
│   ├── repositories/                   # Data access layer
│   │   ├── base.repository.ts
│   │   ├── product.repository.ts
│   │   ├── price-alert.repository.ts
│   │   ├── price-snapshot.repository.ts
│   │   ├── notification-queue.repository.ts
│   │   └── push-subscription.repository.ts
│   ├── services/                       # Business logic
│   │   ├── price.service.ts
│   │   ├── notification.service.ts
│   │   └── watchlist.service.ts
│   ├── fetching/
│   │   ├── strategy-factory.ts
│   │   └── strategies/
│   │       ├── base.strategy.ts
│   │       ├── outfitters.strategy.ts
│   │       ├── breakout.strategy.ts
│   │       ├── sana-safinaz.strategy.ts
│   │       └── saya.strategy.ts
│   ├── notifications/                  # Notification implementations
│   │   ├── base.notification.ts
│   │   ├── email.notification.ts
│   │   ├── push.notification.ts
│   │   ├── toast.notification.ts
│   │   └── notification.factory.ts
│   └── types/                          # TypeScript types
│       ├── product.ts
│       ├── alert.ts
│       └── notification.ts
├── public/
│   ├── service-worker.js               # Service Worker
│   ├── manifest.json                   # PWA Manifest
│   ├── icon-512x512.png                # App icons
│   └── ...other icons
├── auth.ts                             # NextAuth config
├── next.config.ts                      # Next.js config
├── tsconfig.json                       # TypeScript config
├── package.json                        # Dependencies
├── .env.example                        # Environment template
├── ARCHITECTURE.md                     # Architecture doc
├── guide.md                            # Implementation guide
└── IMPLEMENTATION_PLAN.md              # Original plan

```

---

## 🚀 Deployment Checklist

### Before Deploying to Production

- [ ] Generate VAPID keys with `npx web-push generate-vapid-keys`
- [ ] Create real icons (512x512, 192x192, 144x144, etc.) in `public/`
- [ ] Update manifest.json with correct app name and description
- [ ] Set up MongoDB Atlas with IP whitelist
- [ ] Configure Gmail App Password or use a service like SendGrid
- [ ] Generate secure `NEXTAUTH_SECRET` with `openssl rand -base64 32`
- [ ] Create `CRON_SECRET` for scheduled jobs
- [ ] Set `NEXTAUTH_URL` to your production domain
- [ ] Configure Google OAuth if using social login
- [ ] Test email notifications work
- [ ] Test push notifications work
- [ ] Test cron job endpoint

### Production Deployment Steps

#### 1. Vercel Deployment (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel Dashboard
# Then redeploy
vercel --prod
```

#### 2. Other Platforms (Docker/Fly.io/Railway)

```bash
# Build the app
pnpm build

# Start production server
pnpm start
```

### Setup Scheduled Cron Job

Use one of these services to call your cron endpoint daily:

**Option 1: Vercel Cron**

```typescript
// app/api/cron/daily/route.ts already configured
// Vercel automatically runs POST requests with CRON_SECRET
```

**Option 2: External Service (EasyCron, AWS EventBridge, etc.)**

```bash
curl -X POST https://your-domain.com/api/cron/daily \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

**Option 3: Self-hosted (Node.js)**

```javascript
// node-schedule setup
const schedule = require("node-schedule");

schedule.scheduleJob("0 0 * * *", async () => {
  await fetch("https://your-domain.com/api/cron/daily", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.CRON_SECRET}`,
    },
  });
});
```

---

## 🧪 Testing & QA

### Test Product Fetching

```bash
curl -X POST http://localhost:3000/api/products/preview \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://outfitters.com.pk/products/f1931-106"
  }'
```

### Test Push Notifications Locally

1. Register service worker (automatic in PWA mode)
2. Subscribe to push:

   ```bash
   curl -X POST http://localhost:3000/api/push/subscribe \
     -H "Content-Type: application/json" \
     -d '{
       "endpoint": "test-endpoint",
       "keys": {"p256dh": "test", "auth": "test"}
     }'
   ```

3. Send test notification:
   ```bash
   npx web-push send-notification \
     --endpoint="..." \
     --p256dh="..." \
     --auth="..." \
     --payload="Test notification" \
     --vapid-subject="admin@price-watch.app" \
     --vapid-public-key="YOUR_KEY" \
     --vapid-private-key="YOUR_KEY"
   ```

### Test Cron Job

```bash
curl -X POST http://localhost:3000/api/cron/daily \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

---

## 📊 Monitoring & Logs

### CloudWatch (AWS)

- Monitor Lambda/ECS metrics
- View application logs
- Set up alarms for errors

### Application Insights (Azure)

- Application Performance Monitoring
- Dependency tracking
- Custom metrics

### Local Development

- Check browser console for SW errors
- Use `db.ts` logging for database ops
- Monitor email service logs

---

## 🔄 Database Initialization

Initialize collections and indexes on first deploy:

```typescript
// app/api/init/route.ts (only accessible with INIT_SECRET)
import { initializeDatabase } from "@/lib/db.init";

export async function POST(request: NextRequest) {
  const secret = request.headers.get("authorization");
  if (secret !== `Bearer ${process.env.INIT_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await initializeDatabase();
  return NextResponse.json({ success: true });
}
```

Call once:

```bash
curl -X POST https://your-domain.com/api/init \
  -H "Authorization: Bearer YOUR_INIT_SECRET"
```

---

## 🛠️ Common Issues & Solutions

### Issue: "Service Worker not registered"

**Solution:** Ensure HTTPS is enabled (even on localhost with ngrok)

### Issue: "Push notifications not sending"

**Solution:**

1. Verify VAPID keys in .env
2. Check push subscription in MongoDB
3. Verify browser notification permission granted

### Issue: "Emails not sending"

**Solution:**

1. Enable "Less secure apps" on Gmail or use App Password
2. Check EMAIL*SERVER*\* variables
3. Verify SMTP port (587 for TLS, 465 for SSL)

### Issue: "Prices not updating"

**Solution:**

1. Check if store URL is valid and matches strategy pattern
2. Verify internet connectivity
3. Check if Shopify JSON endpoint is accessible

### Issue: "Cron job not triggering"

**Solution:**

1. Verify CRON_SECRET is set
2. Check if scheduler service is calling endpoint
3. Look at server logs for errors

---

## 📈 Performance Optimization

### Database

- Add compound indexes for common queries
- Use pagination for large result sets
- Archive old price snapshots monthly

### API

- Add caching headers to product endpoints
- Implement rate limiting
- Use response compression (gzip)

### Frontend

- Lazy load product images
- Use web worker for heavy computations
- Implement virtual scrolling for watchlist

### Notifications

- Batch notification sending
- Implement exponential backoff for retries
- Clean up old notifications quarterly

---

## 🔐 Security Best Practices

✅ **Implemented:**

- Environment variables for secrets
- NextAuth session protection
- MongoDB adapter for secure auth storage
- Input validation on all API endpoints

✅ **Recommendations:**

- Enable MongoDB IP whitelist
- Use HTTPS in production
- Implement rate limiting on APIs
- Add CORS properly configured
- Regularly rotate VAPID keys
- Use Content Security Policy headers
- Enable CSRF protection for forms

---

## 📞 Support & Documentation

- **Architecture Guide**: See `ARCHITECTURE.md`
- **Implementation Plan**: See `IMPLEMENTATION_PLAN.md`
- **Design Patterns**: See `design-patterns.md`
- **MongoDB Schema**: See `guide.md`

---

## ✨ Features Implemented

✅ Product price tracking across 4 stores
✅ User watchlist management
✅ Email notifications (Nodemailer)
✅ Push notifications (Web Push API)
✅ Daily price checking (Cron)
✅ Historical price data (Price Snapshots)
✅ Progressive Web App (PWA)
✅ Offline support (Service Worker)
✅ Repository Pattern (Clean architecture)
✅ Strategy Pattern (Multi-store support)
✅ Factory Pattern (Notifications)
✅ Singleton Pattern (Database connection)

---

## 🎯 Next Phase Ideas

- [ ] Admin dashboard for monitoring
- [ ] Price comparison between stores
- [ ] User feedback system
- [ ] Advanced filtering and search
- [ ] Price trend charts
- [ ] Discount code integration
- [ ] Social sharing features
- [ ] Browser extension

---

**Your Price Watch application is ready for deployment! 🚀**
