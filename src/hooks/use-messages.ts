'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'

interface Message {
    id: string
    content: string
    sender_id: string
    created_at: string | null
    room_id: string
}

export function useMessageSubscription(roomId: string) {
    const [messages, setMessages] = useState<Message[]>([])
    const [userId, setUserId] = useState<string | null>(null)
    const supabase = createClient()

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) setUserId(user.id)
        }
        getUser()

        const channel = supabase.channel('messages')
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'messages',
                filter: `room_id=eq.${roomId}`
            }, (payload) => {
                // Only add messages from other users
                if (payload.new.sender_id !== userId) {
                    setMessages(prev => [...prev, payload.new as Message])
                }
            })
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [roomId, userId, supabase])

    const addNewMessage = (newMessage: Message) => {
        if (newMessage.sender_id === userId) {
            setMessages(prev => [...prev, newMessage])
        }
    }

    return {
        messages,
        userId,
        addNewMessage,
        setMessages
    }
}