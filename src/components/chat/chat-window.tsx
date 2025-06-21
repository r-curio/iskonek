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
}: ChatWindowProps) {
  const calculateRemainingTime = () => {
    if (!createdAt) return 0;
    const createdTime = new Date(createdAt).getTime();
    const endTime = createdTime + 10 * 60 * 1;
    const remainingTime = endTime - createdTime;
    return remainingTime;
  };
  const { messages, userId, addNewMessage, setMessages } =
    useMessageSubscription(roomId);
  const { isSearching, handleConnect, handleCancelSearch } = useMatchmaking(
    isRandom,
    isBlitz
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState("active");
  const [isTimerActive, setIsTimerActive] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  useAppExit(roomId, isRandom);
  useRoomDeletion({ roomId, setStatus, isRandom, isBlitz });

  useEffect(() => {
    if (status === "ended") {
      setIsTimerActive(false);
    }
  }, [status]);

  // Initialize messages with initialMessages
  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages, setMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFriendRequest = async () => {
    try {
      await handleAddFriend({ recipientUsername: recipientName });
      toast({
        title: "Friend Request Sent!",
        description: `Friend request sent to ${recipientName}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  };

  const handleTimerEnd = async () => {
    try {
      if (status === "ended") return;

      const response = await fetch("/api/chat/end_convo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId }),
      });
      if (!response.ok) throw new Error("Failed to end conversation");
      setStatus("ended"); // This will trigger the ChatEndedOptions to appear
    } catch (error) {
      console.error("End conversation error:", error);
    }
  };

  const handleFlaggedMessage = (flaggedMessage: message) => {
    // Replace the last optimistic message with the flagged message
    setMessages((prevMessages) => {
      const newMessages = [...prevMessages];
      // Find and replace the last message from the current user
      for (let i = newMessages.length - 1; i >= 0; i--) {
        if (newMessages[i].sender_id === userId && !newMessages[i].is_inappropriate) {
          newMessages[i] = flaggedMessage;
          break;
        }
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
      />
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
      {status !== "ended" && (
        <div className="p-2 sm:p-4 border-t bg-white">
          <ChatInput
            roomId={roomId}
            onMessageSent={addNewMessage}
            onFlaggedMessage={handleFlaggedMessage}
            recipientName={recipientName}
            isRandom={isRandom}
          />
        </div>
      )}
      {isSearching && <LoadingScreen handleCancelSearch={handleCancelSearch} />}
    </div>
  );
}
