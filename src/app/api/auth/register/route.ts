import { NextResponse } from 'next/server'
import { registerSchema } from "@/schema"
import { supabase } from "@/lib/supabase"
import { AuthResponse } from '@supabase/supabase-js'

export async function POST(request: Request) {
    const body = await request.json()

    // Validate request body against schema
    const result = registerSchema.safeParse(body)
    if (!result.success) {
        return NextResponse.json({ errors: result.error.errors }, { status: 400 })
    }

    const { email, username, password, confirmPassword } = result.data

    // check if the email already exists in profiles table
    const { data: existingUserByEmail } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .single()

    if (existingUserByEmail) {
        return NextResponse.json({ error: 'Email already taken' }, { status: 400 })
    }

    // Check if username is unique
    const { data: existingUserByUsername } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', username)
        .single()

    if (existingUserByUsername) {
        return NextResponse.json({ error: 'Username already taken' }, { status: 400 })
    }

    const email_domain = email.split('@')[1]

    // Check if email is a PUP Webmail Account
    if (email_domain !== 'iskolarngbayan.pup.edu.ph') {
        return NextResponse.json({ error: 'Enter your PUP Webmail Account' }, { status: 400 })
    }

    if (password !== confirmPassword) {
        return NextResponse.json({ error: 'Passwords do not match' }, { status: 400 })
    }

    // Create new user
    const { error }: AuthResponse = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                username: username,
            },
        },
    })

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ message: 'User registered successfully' }, { status: 201 })
}