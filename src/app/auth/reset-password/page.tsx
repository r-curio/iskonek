// src/app/auth/reset-password/page.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import ResetPasswordForm from "@/components/auth/reset-password-form"

export default function ResetPasswordPage() {
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkAuth = async () => {
      const { data, error } = await supabase.auth.getSession()
      
      if (!data.session?.user || error) {
        router.replace('/auth/login')
      }
    }

    checkAuth()
  }, [router, supabase])

  return <ResetPasswordForm />
}