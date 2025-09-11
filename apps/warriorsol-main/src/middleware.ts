import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { PUBLIC_ROUTES } from "@/lib/app-routes";
import type { NextApiRequest } from "next";

function isPublicRoute(pathname: string) {
  return PUBLIC_ROUTES.some((route) => {
    if (route.includes("[id]")) {
      // Convert "/products/[id]" to regex: ^/products/[^/]+$
      const regex = new RegExp("^" + route.replace("[id]", "[^/]+") + "$");
      return regex.test(pathname);
    }
    return route === pathname;
  });
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // --- Coming Soon Redirect (date-based) ---
  const targetDate = new Date("2025-11-11T11:11:00-05:00").getTime();
  const now = Date.now();

  if (pathname === "/" && now >= targetDate) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  // --- Maintenance Mode Redirect ---
  if (process.env.MAINTENANCE_MODE === "true" && pathname !== "/") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // --- Auth Token Check ---
  const token = await getToken({
    req: request as unknown as NextApiRequest,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Redirect signed-in users *away* from /login
  if (pathname.startsWith("/login") && token) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  // Allow public routes
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  if (PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  // Redirect unauthenticated users to login
  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
