'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Loader2 } from 'lucide-react'

export default function LoadingScreen({ handleCancelSearch} : { handleCancelSearch: () => void }) {
  const [dots, setDots] = useState('.')


  useEffect(() => {
    const dotInterval = setInterval(() => {
      setDots((prevDots) => (prevDots.length >= 3 ? '.' : prevDots + '.'))
    }, 500)

    return () => {
      clearInterval(dotInterval)
    }
  }, [])

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
      <Loader2 className="animate-spin h-12 w-12 mx-auto mb-4 text-blue-500" />
        <h2 className="text-2xl font-semibold mb-2 text-accent">Finding a chat partner{dots}</h2>
        <p className="text-gray-600 mb-4">
          We&apos;re connecting you with a random stranger. This may take a moment.
        </p>
        <Button 
          variant="outline" 
          className="mt-6"
          onClick={handleCancelSearch}
        >
          Cancel Search
        </Button>
      </div>
    </div>
  )
}

