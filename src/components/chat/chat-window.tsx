'use client'
import React from 'react';
import ChatHeader from './chat-header';
import MessageBubble from './bubble';
import ChatInput from './message-box';
import { useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAppExit } from '@/hooks/use-app-exit';
import { useRoomDeletion } from '@/hooks/use-room-delete'
import { useMessageSubscription } from '@/hooks/use-messages';

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


export default function ChatWindow({ recipientName, recipientProfilePic, messages: initialMessages, roomId }: ChatWindowProps) {
    const { messages, userId, addNewMessage, setMessages } = useMessageSubscription(roomId)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    useAppExit(roomId)
    useRoomDeletion(roomId)

    // Initialize messages with initialMessages
    useEffect(() => {
        setMessages(initialMessages)
    }, [initialMessages, setMessages])

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    return (
        <div className="flex flex-col h-screen w-full">
            <ChatHeader recipientName={recipientName} recipientProfilePic={recipientProfilePic} />
            <ScrollArea className="flex-1 p-4">
                {messages.map((message, index) => (
                    <MessageBubble
                        key={index}
                        text={message.content}
                        isUser={message.sender_id === userId}
                        timestamp={message.created_at ? new Date(message.created_at) : undefined}
                    />
                ))}
                <div ref={messagesEndRef} />
            </ScrollArea>
            <ChatInput roomId={roomId} onMessageSent={addNewMessage} recipientName={recipientName}/>
        </div>
    )
}