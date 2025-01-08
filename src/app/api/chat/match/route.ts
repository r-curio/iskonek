import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import { cookies } from 'next/headers'

export async function POST(request: Request) {
    // Get the token from the request cookies
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    // Get the user from the session
    const { user, error } = await supabase.auth.api.getUserByCookie(request)


    if (error) {
        return NextResponse.json({ error: error.message }, { status: 401 })
    }

    return NextResponse.json({
        user
    }, { status: 200 })
}