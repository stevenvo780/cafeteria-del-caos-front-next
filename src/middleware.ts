import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const session = request.cookies.get('session')
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/(protected)')
  const isApiRoute = request.nextUrl.pathname.startsWith('/api')

  // Proteger rutas admin y API
  if ((isProtectedRoute || isApiRoute) && !session) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/(protected)/:path*',
    '/api/:path*',
    '/((?!_next/static|favicon.ico).*)',
  ]
}