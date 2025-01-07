'use server'

import { registerSchema } from "@/schema"
import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

export async function signup(formData: FormData) {
    try {
        const supabase = await createClient()
    
        const data = {
            email: formData.get('email') as string,
            password: formData.get('password') as string,
            username: formData.get('username') as string,
            confirmPassword: formData.get('confirmPassword') as string,
        }

        // Validate request body against schema
        const result = registerSchema.safeParse(data)
        if (!result.success) {
            return { error: result.error.errors[0].message }
        }

        const { email, username, password, confirmPassword } = result.data

        // check if the email already exists in profiles table
        const { data: existingUserByEmail } = await supabase
            .from('profiles')
            .select('id')
            .eq('email', email)
            .single()

        if (existingUserByEmail) {
            return { error: 'Email already taken' }
        }

        // Check if username is unique
        const { data: existingUserByUsername } = await supabase
            .from('profiles')
            .select('id')
            .eq('username', username)
            .single()

        if (existingUserByUsername) {
            return { error: 'Username already taken' }
        }

        const email_domain = email.split('@')[1]
        
        // Check if email is a PUP Webmail Account
        if (email_domain !== 'iskolarngbayan.pup.edu.ph') {
            return { error: 'Enter your PUP Webmail Account' }
        }

        if (password !== confirmPassword) {
            return { error: 'Passwords do not match' }
        }

        // Register user
        const { error: signUpError, data: authData } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    username
                }
            }
        })
    
        if (signUpError) {
            return { error: signUpError.message }
        }

        if (!authData.user) {
            return { error: 'Registration failed' }
        }

        revalidatePath('/', 'layout')
        
        return { data: authData }
        
    } catch (error) {
        return { error }
    }
}