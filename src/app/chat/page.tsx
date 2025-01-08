'use client'
import { Button } from "@/components/ui/button"



// export default function Chat() {


//     return (
//         <div className='flex'>
//             <div>
//                 <h1>Chat</h1>
//             </div>
//         </div>

//     )
// }

"use client";
import ChatWindow from '@/components/chat/chat-window';
import React, { useState } from 'react';

interface Message {
    text: string;
    isUser: boolean;
}

const ChatPage = () => {
    const [messages, setMessages] = useState<Message[]>([
        { text: 'Hello!', isUser: false },
        { text: 'Hi there!', isUser: true },
    ]);

    const handleSendMessage = (newMessage: string) => {
        setMessages([...messages, { text: newMessage, isUser: true }]);
    };

    return (
        <ChatWindow
            recipientName="John Doe"
            recipientProfilePic="https://placekitten.com/64/64"
            messages={messages}
            onSendMessage={handleSendMessage}
        />
    );
};

export default ChatPage;


