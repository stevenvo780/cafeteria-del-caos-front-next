import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { UserRole } from '@/utils/types'
import routesConfig from './config/routesConfig.json'

export function middleware(request: NextRequest) {
  const session = request.cookies.get('session')
  const path = request.nextUrl.pathname
  console.log('Path:', path)
  // Verificar si es una ruta protegida
  const isProtectedRoute = Object.values(routesConfig.roleRoutes)
    .flat()
    .some(route => route.protected && path.startsWith(route.path))

  if (isProtectedRoute) {
    if (!session) {
      return NextResponse.redirect(new URL('/Login', request.url))
    }

    const tokenData = JSON.parse(atob(session.value.split('.')[1]))
    const userRole = tokenData.role as UserRole
    console.log('User role:', userRole)
    if (!isRouteAllowedForRole(path, userRole)) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return NextResponse.next()
}

function isRouteAllowedForRole(path: string, role: UserRole): boolean {
  const roleRoutes = routesConfig.roleRoutes[role] || []
  return roleRoutes.some(route => path.startsWith(route.path))
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ]
}