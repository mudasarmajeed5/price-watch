import { auth } from "@/auth"

export const proxy = auth((req) => {
  const isLoggedIn = !!req.auth;
  const isOnAuthPage = req.nextUrl.pathname.startsWith('/login') || req.nextUrl.pathname.startsWith('/signup');

  if (isLoggedIn && isOnAuthPage) {
    return Response.redirect(new URL('/', req.nextUrl));
  }

  if (!isLoggedIn && !isOnAuthPage && !req.nextUrl.pathname.startsWith('/api')) {
    // You can also add more public routes like /otp if they shouldn't require auth
    return Response.redirect(new URL('/login', req.nextUrl));
  }
})

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|images|favicon.ico).*)"],
}