'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function Home() {
  const supabase = createClientComponentClient()

  const handleSignIn = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    })
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <button 
        onClick={handleSignIn}
        className="bg-blue-500 text-white p-2 rounded"
      >
        Sign In
      </button>
    </main>
  )
}