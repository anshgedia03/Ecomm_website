import { NextRequest, NextResponse } from "next/server"

type TokenPayload = {
  role?: string
  exp?: number
}

function decodeTokenPayload(token: string): TokenPayload | null {
  try {
    const [, payloadPart] = token.split(".")
    if (!payloadPart) return null

    const normalized = payloadPart.replace(/-/g, "+").replace(/_/g, "/")
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=")
    const payload = JSON.parse(atob(padded)) as TokenPayload

    return payload
  } catch {
    return null
  }
}

function getTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization")
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7)
  }

  const cookieToken = request.cookies.get("token")?.value
  return cookieToken ?? null
}

function readSession(request: NextRequest) {
  const token = getTokenFromRequest(request)
  if (!token) {
    return { isAuthenticated: false as const, role: null }
  }

  const payload = decodeTokenPayload(token)
  if (!payload?.exp) {
    return { isAuthenticated: false as const, role: null }
  }

  const now = Math.floor(Date.now() / 1000)
  if (payload.exp <= now) {
    return { isAuthenticated: false as const, role: null }
  }

  return {
    isAuthenticated: true as const,
    role: payload.role === "admin" ? "admin" : "customer",
  }
}

function redirectTo(request: NextRequest, path: string) {
  return NextResponse.redirect(new URL(path, request.url))
}

function redirectToLoginWithNext(request: NextRequest) {
  const loginUrl = new URL("/login", request.url)
  const currentPath = `${request.nextUrl.pathname}${request.nextUrl.search}`
  loginUrl.searchParams.set("next", currentPath)
  return NextResponse.redirect(loginUrl)
}

function unauthorized(message: string, status = 401) {
  return NextResponse.json({ message }, { status })
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const method = request.method.toUpperCase()
  const session = readSession(request)

  const isAuthPage = pathname === "/login" || pathname === "/signup"
  const isAdminPage = pathname === "/admin" || pathname.startsWith("/admin/")
  const isCartPage = pathname === "/cart" || pathname.startsWith("/cart/")

  const isCartApi = pathname === "/api/cart" || pathname.startsWith("/api/cart/")
  const isCheckoutApi =
    pathname === "/api/checkout" || pathname.startsWith("/api/checkout/")
  const isProductsApi =
    pathname === "/api/products" || pathname.startsWith("/api/products/")
  const isProductWriteMethod = method !== "GET" && method !== "HEAD" && method !== "OPTIONS"

  // Block logged-in users from auth pages.
  if (isAuthPage && session.isAuthenticated) {
    if (session.role === "admin") {
      return redirectTo(request, "/admin")
    }
    return redirectTo(request, "/")
  }

  // Page protection.
  if (isCartPage && !session.isAuthenticated) {
    return redirectToLoginWithNext(request)
  }

  if (isAdminPage) {
    if (!session.isAuthenticated) {
      return redirectToLoginWithNext(request)
    }
    if (session.role !== "admin") {
      return redirectTo(request, "/")
    }
  }

  // API protection.
  if (isCartApi || isCheckoutApi) {
    if (!session.isAuthenticated) {
      return unauthorized("Authentication required", 401)
    }
  }

  if (isProductsApi && isProductWriteMethod) {
    if (!session.isAuthenticated) {
      return unauthorized("Authentication required", 401)
    }
    if (session.role !== "admin") {
      return unauthorized("Forbidden: Admin access required", 403)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/login",
    "/signup",
    "/admin/:path*",
    "/cart/:path*",
    "/api/cart/:path*",
    "/api/checkout/:path*",
    "/api/products/:path*",
  ],
}
