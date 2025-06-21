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
    <div className="flex items-center justify-between p-3 sm:p-4 border-b max-h-16 shadow-lg bg-white">
      <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
        <Avatar className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0">
          {recipientProfilePic ? (
            <AvatarImage src={recipientProfilePic} alt={recipientName} />
          ) : (
            <AvatarFallback className="text-sm sm:text-base">
              {recipientName?.charAt(0).toUpperCase()}
            </AvatarFallback>
          )}
        </Avatar>
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 min-w-0 flex-1">
          <h2 className="text-base sm:text-lg font-semibold truncate">{recipientName}</h2>
          {recipientDepartment && (
            <span className="text-xs sm:text-sm text-gray-500 truncate">{recipientDepartment}</span>
          )}
        </div>
      </div>
      {shouldShowTimer && (
        <div className="w-24 sm:w-48 flex-shrink-0">
          <Timer initialTime={initialTime} onTimeUp={onTimerEnd} />
        </div>
      )}
    </div>
  );
};

export default ChatHeader;
