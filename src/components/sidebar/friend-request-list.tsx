
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Check, X } from 'lucide-react'
import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'

interface User {
  id: string
  username: string
  avatarUrl: string | undefined
}

interface FriendRequestListProps {
    friendRequests: User[];
    onFriendRequestHandled?: (id: string) => void;
}

export function FriendRequestList({ friendRequests, onFriendRequestHandled }: FriendRequestListProps) {
    const [requests, setRequests] = useState<User[]>(friendRequests || [])
    const { toast } = useToast()

    const handleAccept = async (id: string) => {
        setRequests(prev => prev.filter(request => request.id !== id)); // Local update
        onFriendRequestHandled?.(id); // Notify Sidebar
        
        const response = await fetch('/api/friend', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id }),
        });
    
        if (response.ok) {
            toast({ title: "Friend Request Accepted!", description: "Friend request accepted" });
        } else {
            toast({ title: "Failed to accept friend request", description: "Try again", variant: "destructive" });
        }
    };
    
    const handleDecline = (id: string) => {
        setRequests(requests.filter(request => request.id !== id))
        
        fetch('/api/friend', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'type': 'decline'
              },
            body: JSON.stringify({ id }),
        })
    }

    return (
        <>
        {requests.length === 0 ? (
            <p className="text-center text-muted-foreground p-4">No pending friend requests</p>
            ) : (
            requests.map((request) => (
                <div key={request.id} className="flex justify-between items-center space-x-3 p-2 h-16">
                    <div className="flex items-center space-x-4">
                        <Avatar className="h-8 w-8">    
                        <AvatarImage src={request.avatarUrl} alt={request.username} />
                        <AvatarFallback>{request.username.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <span className="text-md">{request.username}</span>
                    </div>
                    <div className="flex space-x-2">
                        <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAccept(request.id)}
                        aria-label={`Accept friend request from ${request.username}`}
                        >
                        <Check className="h-4 w-4" />
                        </Button>
                        <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDecline(request.id)}
                        aria-label={`Decline friend request from ${request.username}`}
                        >
                        <X className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            ))
            )}
        </>
    )
}

