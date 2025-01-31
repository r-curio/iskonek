'use client'
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from 'next/navigation'
import { MoreHorizontal } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from '@/hooks/use-toast'

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
  const { toast } = useToast()

  const handleContactClick = async (contact: User) => {
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
      }
    } catch (error) {
      console.error('Error fetching chat room:', error)
    }
  }

  const handleUnfriend = async (contactId: string) => {
    try {
      const response = await fetch(`/api/friend`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'type': 'unfriend'
        },
        body: JSON.stringify({ id: contactId })
      });
      
      if (!response.ok) {
        const data = await response.json()
        toast({
          title: "Failed to unfriend",
          description: data.error || "Something went wrong",
          variant: "destructive",
        });
        return;
      };

      toast({
        title: "Unfriended",
        description: "You have successfully unfriended this user",
      });
      
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to unfriend. Please try again.",
        variant: "destructive",
      });
      console.error('Error unfriending:', error);
    }
  };

  const ContactItem = ({ contact }: { contact: User }) => (
    <div className="group relative">
      <Button
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
        <span className="text-md">{contact.username}</span>
        {contact.isRandom && (
          <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
            Random
          </span>
        )}
      </Button>
      
      {!contact.isRandom && (
        <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">More options for {contact.username}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleUnfriend(contact.id)}>
                Unfriend
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );

  return (
    <nav className="space-y-1">
      {contacts.length === 0 ? (
        <p className="text-center text-muted-foreground p-4">No contacts found</p>
      ) : (
        <>
          {/* Random Chats Section */}
          {randomChats.map((contact) => (
            <ContactItem key={contact.id} contact={contact} />
          ))}

          {/* Regular Contacts Section */}
          {regularContacts.length > 0 && (
            <div className="mt-4 space-y-1">
              {regularContacts.map((contact) => (
                <ContactItem key={contact.id} contact={contact} />
              ))}
            </div>
          )}
        </>
      )}
    </nav>
  )
}

export default ContactsList;