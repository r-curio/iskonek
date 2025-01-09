import React, { useState, useRef, useEffect } from 'react';
import { BsFillSendFill } from 'react-icons/bs';
import { BsSkipEndFill } from 'react-icons/bs';
import { BsFillLightbulbFill } from 'react-icons/bs';
import { createClient } from '@/utils/supabase/client'
import { Textarea } from '../ui/textarea';
import { ActionModal } from './actionModal';

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
    recipientName?: string
}

const ChatInput: React.FC<ChatInputProps> = ({ roomId, onMessageSent, recipientName }) => {
    const [message, setMessage] = useState('')
    const [isConfirmEndOpen, setIsConfirmEndOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [userId, setUserId] = useState<string | null>(null)
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const supabase = createClient()

    const adjustHeight = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            const scrollHeight = Math.min(textarea.scrollHeight, 150);
            textarea.style.height = `${scrollHeight}px`;
        }
    };

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

        if (textareaRef.current) {
            textareaRef.current.style.height = '40px';
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

    const handleSkip = async () => {

        console.log('Skip button clicked')
        try {
            const response = await fetch('/api/chat/end_convo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ roomId })
            })

            if (!response.ok) throw new Error('Failed to end conversation')
            
        } catch (error) {
            console.error('End conversation error:', error)
        }
    }

    const handleMessageChange = (
        e: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        setMessage(e.target.value);
        adjustHeight();
    };

    return (
        <div className="flex items-end p-4 border-t min-h-[5rem] gap-2">
            <div className="flex gap-2">
                <button
                    className="bg-[#682A43] text-white rounded-md p-2 focus:outline-none"
                    onClick={() => setIsConfirmEndOpen(true)}
                >
                    <span className="flex items-center gap-x-2">
                        <BsSkipEndFill /> Skip
                    </span>
                </button>

                <button
                    className="bg-[#C6980F] text-white rounded-md p-2 focus:outline-none"
                    onClick={() => { }}
                >
                    <span className="flex items-center gap-x-2">
                        <BsFillLightbulbFill />
                        ConvoStarters
                    </span>
                </button>
            </div>

            <div className="flex-1 flex items-end">
                <Textarea
                    ref={textareaRef}
                    className="flex-1 border rounded-l-md p-2 focus:outline-none resize-none overflow-y-auto"
                    placeholder="Type a message..."
                    value={message}
                    rows={1}
                    style={{ minHeight: '40px', maxHeight: '150px' }}
                    onChange={handleMessageChange}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                        }
                    }}
                />

                <button
                    className="bg-[#682A43] text-white rounded-r-md p-3 focus:outline-none"
                    onClick={handleSendMessage}
                >
                    <BsFillSendFill />
                </button>
            </div>
            <ActionModal
                isOpen={isConfirmEndOpen}
                onClose={() => setIsConfirmEndOpen(false)}
                onEndChat={handleSkip}
                username={recipientName || ''}
            />
        </div>
    )
}

export default ChatInput