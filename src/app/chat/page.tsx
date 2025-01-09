'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button';
import LoadingScreen from './loading';

export default function Page() {

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
                return true // Return true when matched
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

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (matchInterval) clearInterval(matchInterval)
        }
    }, [matchInterval])

    const handleCancelSearch = async () => {
        setIsSearching(false)
        if (matchInterval) clearInterval(matchInterval)
        
        // Remove user from queue
        const response = await fetch('/api/chat/cancel-match', {
            method: 'POST',
        })
        const data = await response.json()
        console.log('Cancelled search:', data)
    }

    return (
        <div>
            <h1>Chat Page</h1>
            <div>
                <Button onClick={handleConnect}>Connect</Button>
                <Button onClick={handleCancelSearch}>Cancel</Button>
                {isSearching && <LoadingScreen handleCancelSearch={handleCancelSearch}/>
            }
            </div>
        </div>
    );
}