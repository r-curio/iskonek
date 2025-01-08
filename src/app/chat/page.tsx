
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
'use client'
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"

export default function Chat() {
    const [isSearching, setIsSearching] = useState(false)
    const [matchInterval, setMatchInterval] = useState<NodeJS.Timeout | null>(null)
    const [matchUser, setMatchUser] = useState<string | null>(null)

    const checkMatch = async () => {
        try {
            const response = await fetch('/api/chat/match', {
                method: 'POST',
            })
    
            const data = await response.json()
            console.log('Match check response:', data)
    
            if (data.status === 'matched' && data.matchedUser) {
                setIsSearching(false)
                if (matchInterval) {
                    clearInterval(matchInterval)
                    setMatchInterval(null)
                }
                setMatchUser(data.matchedUser.username)
                return true
            }
            return false
        } catch (error) {
            console.error('Match check error:', error)
            return false
        }
    }
    
    const handleConnect = async () => {
        setIsSearching(true)
        const interval = setInterval(async () => {
            const matched = await checkMatch()
            if (matched) {
                clearInterval(interval)
                setMatchInterval(null)
            }
        }, 3000)
        setMatchInterval(interval)
    }

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (matchInterval) clearInterval(matchInterval)
        }
    }, [matchInterval])

    const handleSignOut = async () => {
        const response = await fetch('/api/auth/signout', {
            method: 'POST',
        })
        const data = await response.json()
        console.log(data)
    }

    const handleCancelSearch = async () => {
        setIsSearching(false)
        if (matchInterval) clearInterval(matchInterval)
        
        // Remove user from queue
        const response = await fetch('/api/chat/cancel-match', {
            method: 'POST',
        })
        const data = await response.json()
        console.log('Cancelled search:', data)
    }

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


