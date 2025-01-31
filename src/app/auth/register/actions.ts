'use server'

import { registerSchema } from "@/schema"
import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

type SignupResponse = {
  data?: unknown;
  error?: string;
}

export async function signup(formData: FormData): Promise<SignupResponse> {
    const supabase = await createClient()

    try {
        const data = {
            email: formData.get('email') as string,
            password: formData.get('password') as string,
            username: formData.get('username') as string,
            department: formData.get('department') as string,
            confirmPassword: formData.get('confirmPassword') as string,
        }

        console.log('Signup data:', data)

        // Validate request body
        const result = registerSchema.safeParse(data)
        if (!result.success) {
            return { error: result.error.errors[0].message }
        }

        const { email, username, password, confirmPassword, department } = result.data

        // Validate email domain
        if (!email.endsWith('@iskolarngbayan.pup.edu.ph')) {
            return { error: 'Please use your PUP Webmail Account' }
        }

        // Start transaction
        const { data: existingUser, error: checkError } = await supabase
            .from('profiles')
            .select('id')
            .or(`email.eq.${email},username.eq.${username}`)
            .single()

        if (checkError && checkError.code !== 'PGRST116') {
            return { error: 'Error checking existing user' }
        }

        if (existingUser) {
            return { error: 'Email or username already taken' }
        }

        if (password !== confirmPassword) {
            return { error: 'Passwords do not match' }
        }

        // Create auth user
        const { data: authData, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    username,
                    department,
                    avatar: 'Adrian' // Initial avatar seed
                }
            }
        })

        if (signUpError) {
            console.log('Signup error:', signUpError)
            return { error: signUpError.message }
        }

        if (!authData.user) {
            return { error: 'Registration failed' }
        }

        revalidatePath('/', 'layout')
        return { data: authData }

    } catch (error) {
        console.error('Registration error:', error)
        return { 
            error: error instanceof Error ? error.message : 'An unexpected error occurred' 
        }
    }
}