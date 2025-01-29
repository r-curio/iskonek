'use client'
import React from 'react'
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from 'next/navigation'

interface User {
  id: string
  username: string
  avatarUrl: string | undefined
  isRandom?: boolean
  department?: string
}

interface ContactsListProps {
  contacts: User[]
  onSelectContact: (contact: User) => void
  selectedContactId: string | null
}

interface SplitContacts {
  randomChats: User[];
  regularContacts: User[];
}

const splitContacts = (contacts: User[]): SplitContacts => {
  return contacts.reduce((acc: SplitContacts, contact: User) => {
    if (contact.isRandom) {
      acc.randomChats.push(contact);
    } else {
      acc.regularContacts.push(contact);
    }
    return acc;
  }, { randomChats: [], regularContacts: [] });
}

export function ContactsList({ contacts, onSelectContact, selectedContactId }: ContactsListProps) {
  const router = useRouter()
  const { randomChats, regularContacts } = splitContacts(contacts)

  const handleContactClick = async (contact: User) => {
    // Set the selected contact ID to the user's ID immediately
    onSelectContact(contact)

    if (contact.isRandom) {
      router.push(`/chat/${contact.id}?username=${contact.username}&isRandom=true`)
      return
    }

    try {
      const response = await fetch(`/api/friend/chat-room?friendId=${contact.id}`)
      const data = await response.json()
      
      if (data.roomId) {
        router.push(`/chat/${data.roomId}?username=${contact.username}&isRandom=false`)
        // Don't set selectedContactId here anymore since we want to keep the user ID selected
      }
    } catch (error) {
      console.error('Error fetching chat room:', error)
    }
  }

  return (
    <nav>
      {contacts.length === 0 ? (
        <p className="text-center text-muted-foreground p-4">No contacts found</p>
      ) : (
        <>
          {/* Random Chats Section */}
          {randomChats.map((contact) => (
            <Button
              key={contact.id}
              variant="ghost"
              className={`w-full justify-start p-2 h-10 transition-colors hover:bg-accent ${
                selectedContactId === contact.id 
                  ? 'bg-accent text-accent-foreground' 
                  : 'hover:bg-accent hover:text-accent-foreground'
              }`}
              onClick={() => handleContactClick(contact)}
            >
              <Avatar className="h-8 w-8 mr-2">
                <AvatarImage src={contact.avatarUrl} alt={contact.username} />
                <AvatarFallback>
                  {contact.username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex items-center gap-2">
                <span className="text-md">{contact.username}</span>
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                  Random
                </span>
              </div>
            </Button>
          ))}

          {/* Regular Contacts Section */}
          {regularContacts.length > 0 && (
            <div className="mt-4">
              {regularContacts.map((contact) => (
                <Button
                  key={contact.id}
                  variant="ghost"
                  className={`w-full justify-start p-2 h-10 transition-colors ${
                    selectedContactId === contact.id 
                      ? 'bg-accent text-accent-foreground' 
                      : 'hover:bg-accent hover:text-accent-foreground'
                  }`}
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
              ))}
            </div>
          )}
        </>
      )}
    </nav>
  )
}