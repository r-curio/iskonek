import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Timer } from "./timer";

interface ChatHeaderProps {
  recipientName: string | undefined;
  recipientProfilePic?: string;
  initialTime?: number;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  recipientName,
  recipientProfilePic,
  initialTime,
}) => {
  const shouldShowTimer = initialTime !== undefined && initialTime > 0;

  return (
    <div className="flex items-center justify-between p-4 border-b max-h-16 shadow-lg">
      <div className="flex items-center gap-4">
        <Avatar>
          {recipientProfilePic ? (
            <AvatarImage src={recipientProfilePic} alt={recipientName} />
          ) : (
            <AvatarFallback>
              {recipientName?.charAt(0).toUpperCase()}
            </AvatarFallback>
          )}
        </Avatar>
        <h2 className="text-lg font-semibold">{recipientName}</h2>
      </div>
      {shouldShowTimer && (
        <div className="w-48">
          <Timer initialTime={initialTime} />
        </div>
      )}
    </div>
  );
};

export default ChatHeader;
