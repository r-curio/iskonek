import ChatWindow from '@/components/chat/chat-window';
import { createClient } from '@/utils/supabase/server';
import { createAvatar } from '@dicebear/core';
import { funEmoji } from '@dicebear/collection';

export const dynamic = 'force-dynamic'; // Ensure dynamic rendering

interface PageProps {
    params: { id?: string };
    searchParams: { 
        username?: string;
        isRandom?: string;
        isBlitz?: string;
    };
}

export default async function ChatPage({ params, searchParams }: PageProps) {
    const supabase = await createClient();
    const { id } = params;
    const { username, isRandom, isBlitz } = searchParams;

    if (!id) return <div>Invalid chat room ID</div>;
    if (!username) return <div>Invalid recipient username</div>;

    try {
        const { data: messages, error } = await supabase
            .from('messages')
            .select('*')
            .eq('room_id', id)
            .order('created_at', { ascending: true });

        if (error) throw error;

        const { data: user, error: userError } = await supabase
            .from('profiles')
            .select('avatar, department')
            .ilike('username', username) // Case-insensitive search
            .single();

        if (userError) throw userError;

        const avatar = createAvatar(funEmoji, {
            seed: user.avatar || username || 'Adrian', // Fallback seed
        });

        const profile = avatar.toDataUri();

        return (
            <ChatWindow
                recipientName={username}
                recipientProfilePic={profile}
                recipientDepartment={user.department ?? undefined}
                messages={messages || []}
                roomId={id}
                isRandom={isRandom === 'true'}
                isBlitz={isBlitz === 'true'}
            />
        );
    } catch (err) {
        console.error('Error:', err);
        return <div>An error occurred. Please try again.</div>;
    }
}