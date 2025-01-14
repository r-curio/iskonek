'use server'
import { forgotPasswordSchema } from "@/schema"
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function forgotPassword(formData: FormData) {
    const supabase = await createClient();

    const data = {
        email: formData.get('email') as string,
    }

    // Validate request body against schema
    const result = forgotPasswordSchema.safeParse(data);
    if (!result.success) {
        return { error: result.error.errors[0].message }
    }

    const { email } = result.data;

    // check if the user is using the PUP Webmail Account
    const email_domain = email.split('@')[1];
    if (email_domain !== 'iskolarngbayan.pup.edu.ph') {
        return { error: 'Enter your PUP Webmail Account' }
    }

    try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/login`,
        });

        if (error) {
            return { error: error.message }
        }

        revalidatePath('/', 'layout')
        return { success: true }
    } catch (error) {
        return { error: 'An error occurred while resetting password' }
    }
}