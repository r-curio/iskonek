import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Timer } from "./timer";

interface ChatHeaderProps {
  recipientName: string | undefined;
  recipientProfilePic?: string;
  recipientDepartment?: string;
  initialTime?: number;
  onTimerEnd?: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  recipientName,
  recipientProfilePic,
  initialTime,
  recipientDepartment,
  onTimerEnd,
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
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">{recipientName}</h2>
          {recipientDepartment && (
            <span className="text-md text-gray-500">{recipientDepartment}</span>
          )}
        </div>
      </div>
      {shouldShowTimer && (
        <div className="w-48">
          <Timer initialTime={initialTime} onTimeUp={onTimerEnd} />
        </div>
      )}
    </div>
  );
};

export default ChatHeader;
