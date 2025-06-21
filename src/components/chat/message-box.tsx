"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  BsFillSendFill,
  BsSkipEndFill,
  BsFillLightbulbFill,
} from "react-icons/bs";
import { createClient } from "@/utils/supabase/client";
import { Textarea } from "../ui/textarea";
import { ActionModal } from "./actionModal";
import { ConvoStarters } from "../convostarters/convostarters";
import { Button } from "../ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  content: string;
  created_at: string;
  sender_id: string;
  room_id: string;
  is_inappropriate?: boolean;
  categories?: Record<string, boolean>;
}

interface ChatInputProps {
  roomId: string;
  onMessageSent: (message: Message) => void;
  onFlaggedMessage: (flaggedMessage: Message) => void;
  recipientName?: string;
  isRandom?: boolean;
}

const useChatInput = (
  roomId: string,
  onMessageSent: (message: Message) => void,
  onFlaggedMessage: (flaggedMessage: Message) => void
) => {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const { toast } = useToast();
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
    };
    getUser();
  }, [supabase]);

  const sendMessage = async () => {
    if (!message.trim() || isLoading || !userId) return false;
    setIsLoading(true);

    const messageId = Date.now().toString();
    const optimisticMessage = {
      id: messageId,
      content: message.trim(),
      created_at: new Date().toISOString(),
      sender_id: userId,
      room_id: roomId,
    };

    try {
      onMessageSent(optimisticMessage);
      setMessage("");

      const response = await fetch("/api/chat/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: message.trim(), roomId }),
      });

      const data = await response.json();

      if (data.status === "flagged") {
        // Replace optimistic message with flagged message
        const flaggedMessage = {
          ...data.message,
          id: messageId, // Use the same ID as the optimistic message
          is_inappropriate: true,
        };
        // We need to update the message in the chat window
        // This will be handled by the chat window component
        onFlaggedMessage(flaggedMessage);
        return true;
      }

      if (!response.ok) {
        const error = await response.json();
        if (error.categories) {
          toast({
            title: "Message Not Sent",
            description: "Your message may contain inappropriate content",
            variant: "destructive",
          });
        }
        return false;
      }
      return true;
    } catch (error) {
      console.error("Send message error:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { message, setMessage, sendMessage, isLoading };
};

const ChatInput: React.FC<ChatInputProps> = ({
  roomId,
  onMessageSent,
  onFlaggedMessage,
  recipientName,
  isRandom,
}) => {
  const [isConfirmEndOpen, setIsConfirmEndOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { message, setMessage, sendMessage } = useChatInput(
    roomId,
    onMessageSent,
    onFlaggedMessage
  );

  const adjustHeight = () => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = `${Math.min(
      textareaRef.current.scrollHeight,
      150
    )}px`;
  };

  const handleSkip = async () => {
    try {
      const response = await fetch("/api/chat/end_convo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId }),
      });
      if (!response.ok) throw new Error("Failed to end conversation");
    } catch (error) {
      console.error("End conversation error:", error);
    }
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    adjustHeight();
  };

  const handleConvoStarterSelect = (question: string) => {
    setMessage(question);
    setIsDialogOpen(false);
  };

  return (
    <div className="flex flex-col sm:flex-row items-end p-2 sm:p-4 border-t min-h-[5rem] gap-2">
      <div className="flex gap-2 w-full sm:w-auto">
        {isRandom && (
          <Button
            className="bg-[#682A43] text-white rounded-md p-2 sm:p-3 focus:outline-none text-sm sm:text-base min-h-[44px]"
            onClick={() => setIsConfirmEndOpen(true)}
          >
            <span className="flex items-center gap-x-1 sm:gap-x-2">
              <BsSkipEndFill className="text-sm sm:text-base" /> 
              <span className="hidden sm:inline">Skip</span>
            </span>
          </Button>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#C6980F] text-white rounded-md p-2 sm:p-3 focus:outline-none text-sm sm:text-base min-h-[44px]">
              <span className="flex items-center gap-x-1 sm:gap-x-2">
                <BsFillLightbulbFill className="text-sm sm:text-base" />
                <span className="hidden sm:inline">ConvoStarters</span>
              </span>
            </Button>
          </DialogTrigger>
          <ConvoStarters
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            onSelect={handleConvoStarterSelect}
          />
        </Dialog>
      </div>

      <div className="flex-1 flex items-end w-full">
        <Textarea
          ref={textareaRef}
          className="flex-1 border rounded-l-md p-2 sm:p-3 focus:outline-none resize-none overflow-y-auto text-sm sm:text-base min-h-[44px]"
          placeholder="Type a message..."
          value={message}
          rows={1}
          style={{ minHeight: "44px", maxHeight: "150px" }}
          onChange={handleMessageChange}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
        />
        <Button
          className="bg-[#682A43] text-white rounded-r-md p-2 sm:p-3 focus:outline-none min-h-[44px] min-w-[44px]"
          onClick={sendMessage}
        >
          <BsFillSendFill className="text-sm sm:text-base" />
        </Button>
      </div>

      <ActionModal
        isOpen={isConfirmEndOpen}
        onClose={() => setIsConfirmEndOpen(false)}
        onEndChat={handleSkip}
        username={recipientName || ""}
      />
    </div>
  );
};

export default ChatInput;
