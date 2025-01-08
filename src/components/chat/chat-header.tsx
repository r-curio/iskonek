import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

interface ChatHeaderProps {
    recipientName: string;
    recipientProfilePic?: string;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ recipientName, recipientProfilePic }) => {
    return (
        <div className="flex items-center p-4 border-b max-h-16 bg-[#FAF9F6] shadow-lg">
            <Avatar className="mr-4">
                {recipientProfilePic ? (
                    <AvatarImage src={recipientProfilePic} alt={recipientName} />
                ) : (
                    <AvatarFallback>{recipientName.charAt(0).toUpperCase()}</AvatarFallback>
                )}
            </Avatar>
            <h2 className="text-lg font-semibold">{recipientName}</h2>
        </div>
    );
};

export default ChatHeader;