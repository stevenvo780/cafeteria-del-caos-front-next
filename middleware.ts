import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { UserRole } from '@/utils/types'
import routesConfig from '@/config/routesConfig.json'

export function middleware(request: NextRequest) {
  console.log('Middleware executing...');
  const session = request.cookies.get('session')
  const path = request.nextUrl.pathname
  console.log('Current path:', path);

  // Verificar si es una ruta protegida
  const isProtectedRoute = Object.values(routesConfig.roleRoutes)
    .flat()
    .some(route => route.protected && path.startsWith(route.path))

  console.log('Is protected route:', isProtectedRoute);

  if (isProtectedRoute) {
    if (!session) {
      console.log('No session found, redirecting to login');
      return NextResponse.redirect(new URL('/login', request.url))
    }

    try {
      const tokenData = JSON.parse(atob(session.value.split('.')[1]))
      const userRole = tokenData.role as UserRole
      console.log('User role:', userRole);

      if (!isRouteAllowedForRole(path, userRole)) {
        console.log('Route not allowed for role, redirecting to home');
        return NextResponse.redirect(new URL('/', request.url))
      }
    } catch (error) {
      console.error('Error parsing session:', error);
      return NextResponse.redirect(new URL('/login', request.url))
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
  ],
}
