'use client'
import React from 'react'
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from 'next/navigation'

interface User {
  id: string
  username: string
  avatarUrl: string | undefined
}

interface ContactsListProps {
  contacts: User[]
  onSelectContact: (contact: User) => void
}

export function ContactsList({ contacts, onSelectContact }: ContactsListProps) {

  const router = useRouter()

  const handleContactClick = async (contact: User) => {

    onSelectContact(contact)

    try {
      const response = await fetch(`/api/friend/chat-room?friendId=${contact.id}`)
      const data = await response.json()
      
      if (data.roomId) {
        router.push(`/chat/${data.roomId}?username=${contact.username}&isRandom=false`)
      }
    } catch (error) {
      console.error('Error fetching chat room:', error)
    }
  }

  return (
    <>
      <nav>
        {contacts.length === 0 ? (
          <p className="text-center text-muted-foreground p-4">
            No contacts found
          </p>
        ) : (
          contacts.map((contact) => (
            <Button
              key={contact.id}
              variant="ghost"
              className="w-full justify-start p-2 h-16"
              onClick={() => handleContactClick(contact)}
            >
              <Avatar className="h-8 w-8 mr-2">
                <AvatarImage src={contact.avatarUrl} alt={contact.username} />
                <AvatarFallback>
                  {contact.username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-md">{contact.username}</span>
            </Button>
          ))
        )}
      </nav>
    </>
  )
}