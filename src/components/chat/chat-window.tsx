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
import { handleAddFriend } from '@/utils/actions';
import { ChatEndedOptions } from './chat-ended';
import { useToast } from '@/hooks/use-toast';
import LoadingScreen from '@/app/chat/searching';

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
    recipientDepartment?: string
    messages: message[]
    roomId: string
    isRandom: boolean
    isBlitz?: boolean
}


export default function ChatWindow({ recipientName, recipientProfilePic, recipientDepartment, messages: initialMessages, roomId, isRandom, isBlitz }: ChatWindowProps) {
    const { messages, userId, addNewMessage, setMessages } = useMessageSubscription(roomId)
    const { isSearching, handleConnect, handleCancelSearch } = useMatchmaking(isRandom)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const [status, setStatus] = useState('active')
    const { toast } = useToast()
    const router = useRouter()

    useAppExit(roomId, isRandom)
    useRoomDeletion({ roomId, setStatus, isRandom })

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

    const handleFriendRequest = async () => {
        try {
            await handleAddFriend({ recipientUsername: recipientName })
            toast({
                title: "Friend Request Sent!",
                description: `Friend request sent to ${recipientName}`,
            })
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : 'An unknown error occurred',
                variant: "destructive",
            })
        }
    }

    const handleTimerEnd = async () => {
        try {
            const response = await fetch("/api/chat/end_convo", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ roomId }),
            });
            if (!response.ok) throw new Error("Failed to end conversation");
            setStatus('ended');
        } catch (error) {
            console.error("End conversation error:", error);
        }
    };

    return (
        <div className="flex flex-col h-screen w-full">
            <ChatHeader recipientName={recipientName} recipientProfilePic={recipientProfilePic} recipientDepartment={recipientDepartment} initialTime={isBlitz ? 300 : undefined} onTimerEnd={isBlitz ? handleTimerEnd : undefined} />
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
                            onAddFriend={() => handleFriendRequest()}
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
                    isRandom={isRandom}
                />
            )}
            {isSearching && <LoadingScreen handleCancelSearch={handleCancelSearch} />}
        </div>
    )
}