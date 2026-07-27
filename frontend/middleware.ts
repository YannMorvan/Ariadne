import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value
  const { pathname } = request.nextUrl

  const isAuthPage = pathname === "/login" || pathname === "/register"

  if (!token && !isAuthPage) {
    const loginUrl = new URL("/login", request.url)
    return NextResponse.redirect(loginUrl)
  }

  //   if (token && isAuthPage) {
  //     return NextResponse.redirect(new URL("/", request.url))
  //   }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Exclure les routes internes de Next.js et les fichiers statiques :
     * - api/
     * - _next/static
     * - _next/image
     * - favicon.ico, images, etc.
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
