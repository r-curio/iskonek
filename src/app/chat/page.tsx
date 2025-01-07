'use client'
import { Button } from "@/components/ui/button"


export default function Chat() {
    const handleConnect = async () => {
        
        const response = await fetch('/api/chat/match', {
            method: 'POST',
        })

        const data = await response.json()
        console.log('User:', data.user)


    }

    return (
        <div className='flex'>
            <div>
                <h1>Chat</h1>
                <Button onClick={handleConnect}>Connect</Button>
                <div>

                </div>
            </div>
        </div>
        
    )
}