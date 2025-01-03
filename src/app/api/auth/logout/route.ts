import { NextResponse } from "next/server";
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from "next/headers"

export async function POST() {
    try {
        const cookieStore = cookies()
        const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
        
        const { error } = await supabase.auth.signOut()
        
        if (error) {
            return NextResponse.json({ 
                error: error.message 
            }, { status: 400 })
        }

        return NextResponse.json({ 
            message: "Logged out successfully" 
        }, { status: 200 })
        
    } catch (error) {
        return NextResponse.json({ 
            error: error
        }, { status: 500 })
    }
}