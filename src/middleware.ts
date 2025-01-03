import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define public routes that don't require authentication
const publicRoutes = ['/auth/login', '/auth/register']

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  
  const {
      data: { session },
  } = await supabase.auth.getSession()

  const path = req.nextUrl.pathname
  console.log('Auth Check:', {
      path,
      hasSession: !!session,
      sessionData: session
  })

  if (!session && !publicRoutes.includes(path)) {
      return NextResponse.redirect(new URL('/auth/login', req.url))
  }

  if (session && publicRoutes.includes(path)) {
      return NextResponse.redirect(new URL('/chat', req.url))
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