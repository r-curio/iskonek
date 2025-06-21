"use client";

import ChatHeader from "./chat-header";
import MessageBubble from "./bubble";
import ChatInput from "./message-box";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAppExit } from "@/hooks/use-app-exit";
import { useRoomDeletion } from "@/hooks/use-room-delete";
import { useMessageSubscription } from "@/hooks/use-messages";
import { useMatchmaking } from "@/hooks/use-matchmaking";
import { handleAddFriend } from "@/utils/actions";
import { ChatEndedOptions } from "./chat-ended";
import { useToast } from "@/hooks/use-toast";
import LoadingScreen from "@/app/chat/searching";

interface message {
  id: string;
  created_at: string | null;
  room_id: string;
  content: string;
  sender_id: string;
  is_inappropriate?: boolean;
  categories?: Record<string, boolean>;
}

interface ChatWindowProps {
  recipientName: string | undefined;
  recipientProfilePic?: string;
  recipientDepartment?: string;
  messages: message[];
  roomId: string;
  isRandom: boolean;
  isBlitz?: boolean;
  createdAt?: string;
  children?: React.ReactNode;
}

export default function ChatWindow({
  recipientName,
  recipientProfilePic,
  recipientDepartment,
  messages: initialMessages,
  roomId,
  isRandom,
  isBlitz,
  createdAt,
  children,
}: ChatWindowProps) {
  const calculateRemainingTime = () => {
    if (!createdAt) return 0;
    const createdTime = new Date(createdAt).getTime();
    const endTime = createdTime + 10 * 60 * 1000; // 10 minutes
    const remainingTime = endTime - Date.now();
    return remainingTime > 0 ? remainingTime : 0;
  };
  const { messages, userId, addNewMessage, setMessages } =
    useMessageSubscription(roomId);
  const { isSearching, handleConnect, handleCancelSearch } = useMatchmaking(
    isRandom,
    isBlitz
  );
  const { toast } = useToast();
  const [status, setStatus] = useState("active");
  const [isTimerActive, setIsTimerActive] = useState(true);
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleTimerEnd = () => {
    setIsTimerActive(false);
    setStatus("ended");
  };

  const handleFriendRequest = async () => {
    if (recipientName) {
      const result = await handleAddFriend({ recipientUsername: recipientName });
      if (result?.success) {
        toast({
          title: "Friend Request Sent!",
          description: `Your friend request to ${recipientName} has been sent.`,
        });
      } else {
        toast({
          title: "Error",
          description: String(result?.error),
          variant: "destructive",
        });
      }
    }
  };

  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages, setMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useAppExit(roomId, isRandom);
  useRoomDeletion({ roomId, setStatus, isRandom, isBlitz });

  const handleFlaggedMessage = (flaggedMessage: message) => {
    // Replace the last optimistic message with the flagged message
    setMessages((prevMessages) => {
      const newMessages = [...prevMessages];
      const index = newMessages.findIndex(
        (m) => m.id === flaggedMessage.id && m.sender_id === userId
      );
      if (index !== -1) {
        newMessages[index] = flaggedMessage;
      }
      return newMessages;
    });
  };

  return (
    <div className="flex flex-col h-screen w-full">
      <ChatHeader
        recipientName={recipientName}
        recipientProfilePic={recipientProfilePic}
        recipientDepartment={recipientDepartment}
        initialTime={
          isBlitz && isTimerActive ? calculateRemainingTime() : undefined
        }
        onTimerEnd={isBlitz ? handleTimerEnd : undefined}
      >
        {children}
      </ChatHeader>
      <ScrollArea className="flex-1 p-2 sm:p-4">
        {messages.map((message, index) => (
          <MessageBubble
            key={index}
            text={message.content}
            isUser={message.sender_id === userId}
            timestamp={
              message.created_at ? new Date(message.created_at) : undefined
            }
            is_inappropriate={message.is_inappropriate}
          />
        ))}
        {status === "ended" && (
          <div className="flex justify-center mt-8 px-4">
            <ChatEndedOptions
              onGoHome={() => router.push("/chat")}
              onAddFriend={() => handleFriendRequest()}
              onNewChat={handleConnect}
              partnerName={recipientName}
            />
          </div>
        )}
        <div ref={messagesEndRef} />
      </ScrollArea>
      {isSearching && <LoadingScreen handleCancelSearch={handleCancelSearch} />}
      {status !== "ended" && (
        <div className="p-2 sm:p-4 border-t bg-white">
          <ChatInput
            roomId={roomId}
            onMessageSent={addNewMessage}
            onFlaggedMessage={handleFlaggedMessage}
            recipientName={recipientName as string}
            isRandom={isRandom}
          />
        </div>
      )}
    </div>
  );
}
