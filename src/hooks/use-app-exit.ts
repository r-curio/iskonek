'use client'
import { useEffect } from 'react'

export function useAppExit(roomId: string) {
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            // Send the request using sendBeacon which is designed for cleanup operations
            // during page unload
            const data = JSON.stringify({ roomId })
            navigator.sendBeacon('/api/chat/end_convo', data)
            
            // These are needed for some browsers to show a confirmation dialog
            // if you want to prevent accidental tab closure
            e.preventDefault()
            e.returnValue = ''
        }

        window.addEventListener('beforeunload', handleBeforeUnload)

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload)
        }
    }, [roomId])
}