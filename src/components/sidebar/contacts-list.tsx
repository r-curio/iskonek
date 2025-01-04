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
    <ScrollArea className="flex-1">
      <nav className="flex-1 px-2 py-4 space-y-1">
        {contacts.map((contact) => (
          <Button
            key={contact.id}
            variant="ghost"
            className="w-full justify-start"
            onClick={() => onSelectContact(contact)}
          >
            <Avatar className="h-6 w-6 mr-2">
              <AvatarImage src={contact.avatarUrl} alt={contact.name} />
              <AvatarFallback>{contact.name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            {contact.name}
          </Button>
        ))}
      </nav>
    </ScrollArea>
  )
}

