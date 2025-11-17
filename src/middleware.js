// import { NextResponse } from "next/server";

// const locales = ["en", "ar"];
// const defaultLocale = "en";

// export function middleware(request) {
//   const pathname = request.nextUrl.pathname;

//   // Skip if it's an API route, static file, or _next
//   if (
//     pathname.startsWith("/api") ||
//     pathname.startsWith("/_next") ||
//     pathname.startsWith("/favicon.ico") ||
//     /\.(png|jpg|jpeg|gif|svg|webp|ico|css|js)$/.test(pathname)
//   ) {
//     return NextResponse.next();
//   }

//   // Check if pathname already has a locale
//   const pathnameHasLocale = locales.some(
//     (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
//   );

//   // If no locale in pathname, check cookie or accept-language header
//   if (!pathnameHasLocale) {
//     let locale = defaultLocale;

//     // Check cookie first
//     const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;
//     if (cookieLocale && locales.includes(cookieLocale)) {
//       locale = cookieLocale;
//     } else {
//       // Check Accept-Language header
//       const acceptLanguage = request.headers.get("accept-language");
//       if (acceptLanguage?.includes("ar")) {
//         locale = "ar";
//       }
//     }

//     // Only redirect to /ar for Arabic, keep English as default without prefix
//     if (locale === "ar") {
//       const url = new URL(`/ar${pathname}`, request.url);
//       const response = NextResponse.redirect(url);
//       response.cookies.set("NEXT_LOCALE", locale, { path: "/" });
//       return response;
//     }
//   }

//   // Set cookie based on current URL locale
//   const currentLocale = pathname.startsWith("/ar") ? "ar" : "en";
//   const response = NextResponse.next();

//   const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;
//   if (cookieLocale !== currentLocale) {
//     response.cookies.set("NEXT_LOCALE", currentLocale, { path: "/" });
//   }

//   return response;
// }

// export const config = {
//   matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|_next).*)"],
// };
