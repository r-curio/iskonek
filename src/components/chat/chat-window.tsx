import React from 'react';
import ChatHeader from './chat-header';
import MessageBubble from './bubble';
import ChatInput from './message-box';

interface Message {
    text: string;
    isUser: boolean;
}

interface ChatWindowProps {
    recipientName: string;
    recipientProfilePic?: string;
    messages: Message[];
    onSendMessage: (message: string) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ recipientName, recipientProfilePic, messages, onSendMessage }) => {
    return (
        <div className="flex flex-col h-screen w-full">
            <ChatHeader recipientName={recipientName} recipientProfilePic={recipientProfilePic} />
            <div className="flex-1 overflow-y-auto p-4">
                {messages.map((message, index) => (
                    <MessageBubble key={index} text={message.text} isUser={message.isUser} />
                ))}
            </div>
            <ChatInput onSendMessage={onSendMessage} />
        </div>
    );
};

export default ChatWindow;
