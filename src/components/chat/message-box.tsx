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

interface Message {
  id: string;
  content: string;
  created_at: string;
  sender_id: string;
  room_id: string;
}

interface ChatInputProps {
  roomId: string;
  onMessageSent: (message: Message) => void;
  recipientName?: string;
}

const useChatInput = (
  roomId: string,
  onMessageSent: (message: Message) => void
) => {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
    };
    getUser();
  }, []);

  const sendMessage = async () => {
    if (!message.trim() || isLoading || !userId) return false;
    setIsLoading(true);

    const optimisticMessage = {
      id: Date.now().toString(),
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

      if (!response.ok) throw new Error("Failed to send message");
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
  recipientName,
}) => {
  const [isConfirmEndOpen, setIsConfirmEndOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { message, setMessage, sendMessage, } = useChatInput(
    roomId,
    onMessageSent
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
    <div className="flex items-end p-4 border-t min-h-[5rem] gap-2">
      <div className="flex gap-2">
        <Button
          className="bg-[#682A43] text-white rounded-md p-2 focus:outline-none"
          onClick={() => setIsConfirmEndOpen(true)}
        >
          <span className="flex items-center gap-x-2">
            <BsSkipEndFill /> Skip
          </span>
        </Button>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#C6980F] text-white rounded-md p-2 focus:outline-none">
              <span className="flex items-center gap-x-2">
                <BsFillLightbulbFill />
                ConvoStarters
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

      <div className="flex-1 flex items-end">
        <Textarea
          ref={textareaRef}
          className="flex-1 border rounded-l-md p-2 focus:outline-none resize-none overflow-y-auto"
          placeholder="Type a message..."
          value={message}
          rows={1}
          style={{ minHeight: "40px", maxHeight: "150px" }}
          onChange={handleMessageChange}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
        />

        <button
          className="bg-[#682A43] text-white rounded-r-md p-3 focus:outline-none"
          onClick={sendMessage}
        >
          <BsFillSendFill />
        </button>
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
