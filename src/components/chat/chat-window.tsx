'use client'
import React, { useRef, useEffect } from 'react';
import ChatHeader from './chat-header';
import MessageBubble from './bubble';
import ChatInput from './message-box';
import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import { ScrollArea } from '../ui/scroll-area';

interface ChatWindowProps {
    recipientName: string | undefined
    recipientProfilePic?: string
    messages: {
        id: string
        created_at: string | null
        room_id: string
        content: string
        sender_id: string
    }[]
    roomId: string 
}


const ChatWindow: React.FC<ChatWindowProps> = ({
    recipientName,
    recipientProfilePic,
    messages,
    onSendMessage,
}) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    id: string
    content: string
    sender_id: string
    created_at: string | null
    room_id: string
}

const ChatWindow: React.FC<ChatWindowProps> = ({ 
    recipientName, 
    recipientProfilePic, 
    messages: initialMessages,
    roomId 
}) => {
    const [messages, setMessages] = useState<Message[]>(initialMessages)
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

    return (
        <div className="flex flex-col h-screen w-full">
            <ChatHeader
                recipientName={recipientName}
                recipientProfilePic={recipientProfilePic}
            />
            <ScrollArea className="flex-1 p-4">
                {messages.map((message, index) => (
                    <MessageBubble
                        key={index}
                        text={message.text}
                        isUser={message.isUser}
                        timestamp={message.timestamp}
                    />
                ))}
                <div ref={messagesEndRef} />
            </ScrollArea>
            <ChatInput onSendMessage={onSendMessage} />
        </div>
    )
}

export default ChatWindow;