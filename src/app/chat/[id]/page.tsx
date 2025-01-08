
"use client";
import ChatWindow from '@/components/chat/chat-window';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation'


interface Message {
    text: string;
    isUser: boolean;
}


const ChatPage = () => {
    const [messages, setMessages] = useState<Message[]>([
        { text: 'Hello!', isUser: false },
        { text: 'Hi there!', isUser: true },
        
    ]);

    const searchParams = useSearchParams()
    const recipientName = searchParams.get('username') || 'User';



    const handleSendMessage = (newMessage: string) => {
        setMessages([...messages, { text: newMessage, isUser: true }]);
    };

    return (
        <ChatWindow
            recipientName={recipientName}
            recipientProfilePic="https://placekitten.com/64/64"
            messages={messages}
            onSendMessage={handleSendMessage}
        />
    );
};

export default ChatPage;


