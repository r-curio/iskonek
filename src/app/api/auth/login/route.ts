import { NextResponse } from "next/server";
import { loginSchema } from "@/schema";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
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
    const { error } = await supabase.auth.signIn({
        email,
        password,
    });
    
    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: "User logged in successfully" }, { status: 200 });
}