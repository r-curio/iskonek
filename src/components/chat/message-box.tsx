import React, { useState } from 'react';
import { BsFillSendFill } from "react-icons/bs";

interface ChatInputProps {
    onSendMessage: (message: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
    const [message, setMessage] = useState('');

    const handleSendMessage = () => {
        if (message.trim()) {
            onSendMessage(message);
            setMessage('');
        }
    };

    return (
        <div className="flex items-center p-4 border-t h-20">
            <input
                type="text"
                className="flex-1 border rounded-l-md p-2 focus:outline-none"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        handleSendMessage();
                    }
                }}
            />
            <button
                className="bg-[#682A43] text-white rounded-r-md p-3 focus:outline-none"
                onClick={handleSendMessage}
            >
                <BsFillSendFill />
            </button>
        </div>
    );
};

export default ChatInput;
