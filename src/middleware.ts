import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define public routes that don't require authentication
const publicRoutes = ['/auth/login', '/auth/register']

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  
  // Get session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const path = req.nextUrl.pathname
  console.log('Middleware - Path:', path, 'Session:', !!session)

  // If trying to access public route while logged in, redirect to home
  if (publicRoutes.includes(path)) {
    if (session) {
      return NextResponse.redirect(new URL('/', req.url))
    }
    return res
  }

  // For non-public routes, redirect to login if no session
  if (!session) {
    const redirectUrl = new URL('/auth/login', req.url)
    console.log('Redirecting to:', redirectUrl.toString())
    return NextResponse.redirect(redirectUrl)
  }

  return res
}

// Match all routes
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}