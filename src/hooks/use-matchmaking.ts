'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface MatchState {
    isSearching: boolean
    handleConnect: () => Promise<void>
    handleCancelSearch: () => Promise<void>
}

export function useMatchmaking(): MatchState {
    const router = useRouter()
    const [isSearching, setIsSearching] = useState(false)
    const [matchInterval, setMatchInterval] = useState<NodeJS.Timeout | null>(null)

    const checkMatch = async () => {
        try {
            const response = await fetch('/api/chat/match', {
                method: 'POST',
            })
    
            const data = await response.json()
            console.log('Match check response:', data)
    
            if (data.status === 'matched' && data.matchedUser) {
                setIsSearching(false)
                if (matchInterval) {
                    clearInterval(matchInterval)
                    setMatchInterval(null)
                }
                router.push(`/chat/${data.room_id}?username=${data.matchedUser.username}`)
                return true
            }
    
            return false
        } catch (error) {
            console.error('Match check error:', error)
            return false
        }
    }
    
    const handleConnect = async () => {
        setIsSearching(true)
        const interval = setInterval(async () => {
            const matched = await checkMatch()
            if (matched) {
                clearInterval(interval)
                setMatchInterval(null)
            }
        }, 3000)
        setMatchInterval(interval)
    }

    const handleCancelSearch = async () => {
        setIsSearching(false)
        if (matchInterval) clearInterval(matchInterval)
        
        // Remove user from queue
        try {
            const response = await fetch('/api/chat/cancel-match', {
                method: 'POST',
            })
            const data = await response.json()
            console.log('Cancelled search:', data)
        } catch (error) {
            console.error('Error cancelling search:', error)
        }
    }

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (matchInterval) clearInterval(matchInterval)
        }
    }, [matchInterval])

    return {
        isSearching,
        handleConnect,
        handleCancelSearch
    }
}