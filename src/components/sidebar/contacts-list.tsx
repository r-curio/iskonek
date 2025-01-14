import React from 'react'
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"

interface User {
  id: string
  name: string
  avatarUrl: string
}

interface ContactsListProps {
  contacts: User[]
  
  onSelectContact: (contact: User) => void
}

export function ContactsList({ contacts, onSelectContact }: ContactsListProps) {
  return (
    <ScrollArea className="flex-1 p-4">
      <nav className="">
        {contacts.map((contact) => (
          <Button
            key={contact.id}
            variant="ghost"
            className="w-full justify-start p-2 h-16 "
            onClick={() => onSelectContact(contact)}
          >
            <Avatar className="h-8 w-8 mr-2">
              <AvatarImage src={contact.avatarUrl} alt={contact.name} />
              <AvatarFallback>{contact.name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <span className="text-md">{contact.name}</span>
          </Button>
        ))}
      </nav>
    </ScrollArea>
  )
}

