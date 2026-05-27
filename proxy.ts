import { auth } from "@/auth";

export const proxy = auth((req) => {
  const { pathname } = req.nextUrl;

  // 🚨 PWA + public assets MUST NEVER be blocked or redirected
  if (
    pathname.startsWith("/sw.js") ||
    pathname.startsWith("/manifest.webmanifest") ||
    pathname.startsWith("/manifest.json") ||
    pathname.startsWith("/icon") ||
    pathname.startsWith("/icons") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/robots.txt") ||
    pathname.startsWith("/sitemap.xml")
  ) {
    return;
  }

  const isLoggedIn = !!req.auth;

  const isOnAuthPage =
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup");

  // If logged in, prevent going back to auth pages
  if (isLoggedIn && isOnAuthPage) {
    return Response.redirect(new URL("/", req.nextUrl));
  }

  // Protect everything except:
  // - auth pages
  // - API routes
  // - public assets (already filtered above)
  if (
    !isLoggedIn &&
    !isOnAuthPage &&
    !pathname.startsWith("/api")
  ) {
    return Response.redirect(new URL("/login", req.nextUrl));
  }
});

// IMPORTANT: exclude middleware from static + API routes
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|images|icons|favicon.ico).*)",
  ],
};