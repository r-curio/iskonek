import React, { useState, useRef, useEffect } from 'react';
import { BsFillSendFill } from 'react-icons/bs';
import { BsSkipEndFill } from 'react-icons/bs';
import { BsFillLightbulbFill } from 'react-icons/bs';

interface ChatInputProps {
    onSendMessage: (message: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
    const [message, setMessage] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const adjustHeight = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            const scrollHeight = Math.min(textarea.scrollHeight, 150);
            textarea.style.height = `${scrollHeight}px`;
        }
    };

    const handleSendMessage = () => {
        if (message.trim()) {
            onSendMessage(message);
            setMessage('');
            // Reset height after sending
            if (textareaRef.current) {
                textareaRef.current.style.height = '40px';
            }
        }
    };

    const handleMessageChange = (
        e: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        setMessage(e.target.value);
        adjustHeight();
    };

    return (
        <div className="flex items-end p-4 border-t min-h-[5rem] gap-2">
            <div className="flex gap-2">
                <button
                    className="bg-[#682A43] text-white rounded-md p-2 focus:outline-none"
                    onClick={() => { }}
                >
                    <span className="flex items-center gap-x-2">
                        <BsSkipEndFill /> Skip
                    </span>
                </button>

                <button
                    className="bg-[#C6980F] text-white rounded-md p-2 focus:outline-none"
                    onClick={() => { }}
                >
                    <span className="flex items-center gap-x-2">
                        <BsFillLightbulbFill />
                        ConvoStarters
                    </span>
                </button>
            </div>

            <div className="flex-1 flex items-end">
                <textarea
                    ref={textareaRef}
                    className="flex-1 border rounded-l-md p-2 focus:outline-none resize-none overflow-y-auto"
                    placeholder="Type a message..."
                    value={message}
                    rows={1}
                    style={{ minHeight: '40px', maxHeight: '150px' }}
                    onChange={handleMessageChange}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
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
        </div>
    );
};

export default ChatInput;
