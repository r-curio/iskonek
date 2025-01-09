'use client'
import { cn } from '@/lib/utils'

interface MessageBubbleProps {
    text: string
    isUser: boolean
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ text, isUser }) => {
    return (
        <div className={cn(
            "flex my-2 max-w-[30%] rounded-lg p-2",
            isUser ? "bg-[#682A43] text-white ml-auto" : "bg-[#B7B5B5] text-gray-800 mr-auto"
        )}>
            {text}
        </div>
    )
}

export default MessageBubble