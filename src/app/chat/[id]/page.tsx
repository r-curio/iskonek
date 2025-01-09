import ChatWindow from '@/components/chat/chat-window';
import { createClient } from '@/utils/supabase/server';
interface PageProps {
    params: { id?: string };
    searchParams: { username?: string };
}

export default async function ChatPage({ params, searchParams }: PageProps) {
    const supabase = await createClient();
    const { id } = params;
    const username = searchParams ? searchParams.username : null;

    // Validate `id` and `username`
    if (!id) {
        console.error('Chat room ID is missing');
        return <div>Invalid chat room ID</div>;
    }

    if (!username) {
        console.error('Recipient username is missing');
        return <div>Invalid recipient username</div>;
    }

    try {
        // Fetch messages for the chat room
        const { data: messages, error } = await supabase
            .from('messages')
            .select('*')
            .eq('room_id', id)
            .order('created_at', { ascending: true });
        
        console.log('Messages:', messages);

        if (error) {
            console.error('Error fetching messages:', error);
            return <div>Error loading messages</div>;
        }

        // Render the chat window with fetched messages
        return (
            <ChatWindow
                recipientName={username}
                recipientProfilePic=""
                messages={messages || []}
                roomId={id}
            />
        );
    } catch (err) {
        console.error('Unexpected error:', err);
        return <div>An unexpected error occurred</div>;
    }
}
