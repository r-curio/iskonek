import LoginForm from "@/components/auth/login-form"
import { createClient } from '@/utils/supabase/server'
import { redirect } from "next/navigation";

export default async function Login() {

    const supabase = await createClient();

    
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
        return redirect('/chat')
    }
    

    return (

        <LoginForm />
    )
}