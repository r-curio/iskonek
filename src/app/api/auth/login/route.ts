import { NextResponse } from "next/server";
import { loginSchema } from "@/schema";
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from "next/headers"

export async function POST(request: Request) {

    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    
    const body = await request.json();

    // Validate request body against schema
    const result = loginSchema.safeParse(body);
    if (!result.success) {
        return NextResponse.json({ errors: result.error.errors }, { status: 400 });
    }

    const { email, password } = result.data;

    // check if the user is signing in using the PUP Webmail Account
    const email_domain = email.split('@')[1];
    if (email_domain !== 'iskolarngbayan.pup.edu.ph') {
        return NextResponse.json({ error: 'Enter your PUP Webmail Account' }, { status: 400 });
    }

    // Sign in user
    const { data: { session }, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
    })

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (!session) {
        return NextResponse.json({ error: "Authentication failed" }, { status: 401 });
    }

    return NextResponse.json({
        message: "User logged in successfully",
        session
    }, { status: 200 });
}