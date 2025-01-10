'use client'
import ChatHeader from './chat-header';
import MessageBubble from './bubble';
import ChatInput from './message-box';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAppExit } from '@/hooks/use-app-exit';
import { useRoomDeletion } from '@/hooks/use-room-delete'
import { useMessageSubscription } from '@/hooks/use-messages';
import { useMatchmaking } from '@/hooks/use-matchmaking';
import { ChatEndedOptions } from './chat-ended';
import LoadingScreen from '@/app/chat/loading';

interface message {
    id: string
    created_at: string | null
    room_id: string
    content: string
    sender_id: string
}

interface ChatWindowProps {
    recipientName: string | undefined
    recipientProfilePic?: string
    messages: message[]
    roomId: string 
}


export default function ChatWindow({ recipientName, recipientProfilePic, messages: initialMessages, roomId }: ChatWindowProps) {
    const { messages, userId, addNewMessage, setMessages } = useMessageSubscription(roomId)
    const { isSearching, handleConnect, handleCancelSearch } = useMatchmaking()
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const [status, setStatus] = useState('active')
    const router = useRouter()

    useAppExit(roomId)
    useRoomDeletion({ roomId, setStatus })

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
                {status === 'ended' && (
                    <div className="flex justify-center mt-8">
                        <ChatEndedOptions
                            onGoHome={() => router.push('/chat')}
                            onAddFriend={() => {}}
                            onNewChat={handleConnect}
                            partnerName={recipientName}
                        />
                    </div>
                )}
                <div ref={messagesEndRef} />
            </ScrollArea>
            {status !== 'ended' && (
                <ChatInput 
                    roomId={roomId} 
                    onMessageSent={addNewMessage} 
                    recipientName={recipientName}
                />
            )}
            {isSearching && <LoadingScreen handleCancelSearch={handleCancelSearch} />}
        </div>
    )
}