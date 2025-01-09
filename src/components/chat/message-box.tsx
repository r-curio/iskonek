'use client'
import { useState, useEffect } from 'react'
import { BsFillSendFill } from "react-icons/bs"
import { createClient } from '@/utils/supabase/client'

interface Message {
    id: string
    content: string
    created_at: string
    sender_id: string
    room_id: string
}

interface ChatInputProps {
    roomId: string
    onMessageSent: (message: Message) => void
}

const ChatInput: React.FC<ChatInputProps> = ({ roomId, onMessageSent }) => {
    const [message, setMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [userId, setUserId] = useState<string | null>(null)
    const supabase = createClient()

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) setUserId(user.id)
        }
        getUser()
    }, [])

    const handleSendMessage = async () => {
        if (!message.trim() || isLoading || !userId) return
        setIsLoading(true)

        const optimisticMessage = {
            id: Date.now().toString(),
            content: message.trim(),
            created_at: new Date().toISOString(),
            sender_id: userId,
            room_id: roomId
        }
        
        try {
            onMessageSent(optimisticMessage)
            setMessage('')
            
            const response = await fetch('/api/chat/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    content: message.trim(), 
                    roomId 
                })
            })

            if (!response.ok) throw new Error('Failed to send message')
        } catch (error) {
            console.error('Send message error:', error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex items-center p-4 border-t h-20">
            <input
                type="text"
                className="flex-1 border rounded-l-md p-2 focus:outline-none"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !isLoading) {
                        handleSendMessage()
                    }
                }}
                disabled={isLoading}
            />
            <button
                className="bg-[#682A43] text-white rounded-r-md p-3 focus:outline-none disabled:opacity-50"
                onClick={handleSendMessage}
                disabled={isLoading}
            >
                <BsFillSendFill />
            </button>
        </div>
    )
}

export default ChatInput