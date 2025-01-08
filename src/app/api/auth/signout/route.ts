import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

// Change from 'export default async function POST()' to:
export async function POST() {
    const supabase = await createClient()

    const { error } = await supabase.auth.signOut()

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'Sign out successful' }, { status: 200 })
}