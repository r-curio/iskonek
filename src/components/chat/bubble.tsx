'use client'
import { cn } from '@/lib/utils'

interface MessageBubbleProps {
    text: string;
    isUser: boolean;
    timestamp?: Date;
}

const formatTime = (date: Date): string => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
};

const MessageBubble: React.FC<MessageBubbleProps> = ({
    text,
    isUser,
    timestamp,
}) => {
    return (
        <div
            className={cn(
                'flex my-2 group gap-2 w-full',
                isUser ? 'flex-row-reverse' : 'flex-row'
            )}
        >
            <div
                className={cn(
                    'max-w-[85%] md:max-w-[70%] lg:max-w-[50%] rounded-2xl px-4 py-2',
                    'break-words whitespace-pre-wrap',
                    isUser
                        ? 'bg-[#682A43] text-white rounded-tr-none'
                        : 'bg-[#B7B5B5] text-gray-800 rounded-tl-none'
                )}
            >
                {text}
            </div>

            {/* Timestamp (closer to the bubble for user messages) */}
            {timestamp && (
                <span
                    className={cn(
                        'text-xs self-end opacity-0 group-hover:opacity-100 transition-opacity min-w-[45px] text-gray-500'
                    )}
                >
                    {formatTime(timestamp)}
                </span>
            )}
        </div>
    )
}

export default MessageBubble