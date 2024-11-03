import { NextResponse } from 'next/server'
import { registerSchema } from "@/schema"
import { supabase } from "@/lib/supabase"

export async function POST(request: Request) {
    const body = await request.json()

    // Validate request body against schema
    const result = registerSchema.safeParse(body)
    if (!result.success) {
        return NextResponse.json({ errors: result.error.errors }, { status: 400 })
    }

    const { email, username, password, confirmPassword } = result.data

    // Check if user already exists by email
    const { data: existingUserByEmail } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single()

    if (existingUserByEmail) {
        return NextResponse.json({ error: 'User already exists' }, { status: 400 })
    }

    // Check if username is unique
    const { data: existingUserByUsername } = await supabase
        .from('users')
        .select('id')
        .eq('username', username)
        .single()

    if (existingUserByUsername) {
        return NextResponse.json({ error: 'Username already taken' }, { status: 400 })
    }

    const email_domain = email.split('@')[1]

    if (email_domain !== 'iskolarngbayan.pup.edu.ph') {
        return NextResponse.json({ error: 'Enter your PUP Webmail Account' }, { status: 400 })
    }

    if (password !== confirmPassword) {
        return NextResponse.json({ error: 'Passwords do not match' }, { status: 400 })
    }

    // Create new user
    const { error } = await supabase.auth.signUp({
        email,
        password,
    }) 

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ message: 'User registered successfully' }, { status: 201 })
}