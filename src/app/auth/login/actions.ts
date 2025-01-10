'use server'
import { loginSchema } from "@/schema";
import { createClient } from '@/utils/supabase/server'
import { redirect } from "next/navigation";
import { revalidatePath } from 'next/cache'

export async function login(formData: FormData) {

    const supabase = await createClient();

    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    // Validate request body against schema
    const result = loginSchema.safeParse(data);
    if (!result.success) {
        return { error: result.error.errors[0].message }
    }

    const { email, password } = result.data;

    // check if the user is signing in using the PUP Webmail Account
    // const email_domain = email.split('@')[1];
    // if (email_domain !== 'iskolarngbayan.pup.edu.ph') {
    //     return { error: 'Enter your PUP Webmail Account' }
    // }

    const { error } = await supabase.auth.signInWithPassword({email, password});


    if (error) {
        return { error: error.message }
      }
    
    revalidatePath('/', 'layout')
    redirect('/chat')

}