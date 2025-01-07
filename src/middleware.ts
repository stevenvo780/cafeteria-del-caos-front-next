import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { UserRole } from '@/utils/types'
import routesConfig from './config/routesConfig.json'

export function middleware(request: NextRequest) {
  const session = request.cookies.get('session')
  const path = request.nextUrl.pathname

  if (path.startsWith('/(protected)') || path.startsWith('/api')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    const tokenData = JSON.parse(atob(session.value.split('.')[1]))
    const userRole = tokenData.role as UserRole

    if (!isRouteAllowedForRole(path, userRole)) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return NextResponse.next()
}

function isRouteAllowedForRole(path: string, role: UserRole): boolean {
  const publicPaths = routesConfig.publicRoutes.map(route => route.path)
  if (publicPaths.includes(path)) return true

  const roleRoutes = routesConfig.roleRoutes[role] || []
  return roleRoutes.some(route => route.path === path)
}

export const config = {
  matcher: [
    '/(protected)/:path*',
    '/api/:path*',
    '/((?!_next/static|favicon.ico).*)',
  ]
}