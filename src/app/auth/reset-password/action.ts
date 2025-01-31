'use server'

import { resetPasswordSchema } from "@/schema"
import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

export async function resetPassword(formData: FormData) {
    try {
        const supabase = await createClient()

        const data = {
            newPassword: formData.get('newPassword') as string,
            confirmPassword: formData.get('confirmPassword') as string,
        }

        // Validate request body against schema
        const result = resetPasswordSchema.safeParse(data)
        if (!result.success) {
            return { error: result.error.errors[0].message }
        }

        const { newPassword, confirmPassword } = result.data

        if (newPassword !== confirmPassword) {
            return { error: 'Passwords do not match' }
        }


        const { error } = await supabase.auth.updateUser({
            password: formData.get('newPassword') as string,
        })
        
        if (error) {
            return { error: error.message }
        }
        
        revalidatePath('/', 'layout')
        return { success: true }

    } catch (error) {
        return { error }
    }
}