"use client";
import { cn } from "@/lib/utils";

interface MessageBubbleProps {
  text: string;
  isUser: boolean;
  timestamp?: Date;
  is_inappropriate?: boolean;
}

const formatTime = (date: Date): string => {
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

const MessageBubble: React.FC<MessageBubbleProps> = ({
  text,
  isUser,
  timestamp,
  is_inappropriate = false,
}) => {
  return (
    <div
      className={cn(
        "flex w-full my-2 group",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div className={cn(
        "flex flex-col max-w-[90%] sm:max-w-[85%] md:max-w-[70%] lg:max-w-[50%]",
        isUser ? "items-end" : "items-start"
      )}>
        <div
          className={cn(
            "rounded-2xl px-3 py-2 sm:px-4 sm:py-2 break-words whitespace-pre-wrap text-sm sm:text-base",
            isUser
              ? is_inappropriate
                ? "bg-red-500 text-white rounded-tr-none"
                : "bg-[#682A43] text-white rounded-tr-none"
              : "bg-[#B7B5B5] text-gray-800 rounded-tl-none"
          )}
        >
          {text}
        </div>
        {is_inappropriate && isUser && (
          <span className="text-xs text-red-500 font-medium mt-1">
            Inappropriate message
          </span>
        )}
        {timestamp && (
          <span className="text-xs text-gray-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out">
            {formatTime(timestamp)}
          </span>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
