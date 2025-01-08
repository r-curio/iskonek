import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST() {
    const supabase = await createClient();

    const { data: { user }, error: UserError } = await supabase.auth.getUser();
    if (!user || UserError) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is already matched in a chat room
    const { data: existingRoom } = await supabase
        .from('chat_rooms')
        .select('*')
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .eq('status', 'active')
        .single();

    if (existingRoom) {
        const otherUserId = existingRoom.user1_id === user.id 
            ? existingRoom.user2_id 
            : existingRoom.user1_id;

        const { data: profile } = await supabase
            .from('profiles')
            .select('username')
            .eq('id', otherUserId)
            .single();

        return NextResponse.json({
            status: 'matched',
            room_id: existingRoom.id,
            matchedUser: {
                id: otherUserId,
                username: profile?.username
            }
        });
    }

    // Check if user is already in queue
    const { data: existingQueue } = await supabase
        .from('matching_queue')
        .select('*')
        .eq('user_id', user.id)
        .single();

    if (existingQueue) {
        // Find a potential match
        const { data: matchQueue, error: matchQueueError } = await supabase
            .from('matching_queue')
            .select('user_id')
            .neq('user_id', user.id)
            .eq('status', 'waiting')
            .order('joined_at', { ascending: true })
            .limit(1)
            .single();

        if (matchQueueError || !matchQueue) {
            return NextResponse.json({ status: 'waiting' });
        }

        // Use the Postgres function to create the match
        const { data: matchResult, error: matchError } = await supabase
            .rpc('create_match', {
                user1_id: user.id,
                user2_id: matchQueue.user_id,
            });

        if (matchError) {
            console.error('Match creation error:', matchError);
            return NextResponse.json({ error: 'Failed to create match' }, { status: 500 });
        }

        // Get matched user's profile
        const { data: profile } = await supabase
            .from('profiles')
            .select('username')
            .eq('id', matchQueue.user_id)
            .single();

        return NextResponse.json({
            status: 'matched',
            room_id: matchResult[0].room_id,
            matchedUser: {
                id: matchQueue.user_id,
                username: profile?.username
            }
        });
    } else {
        // Insert user into queue
        const { error: insertError } = await supabase
            .from('matching_queue')
            .insert([{ 
                user_id: user.id,
                status: 'waiting',
                joined_at: new Date().toISOString()
            }]);

        if (insertError) {
            return NextResponse.json({ error: 'Failed to insert into queue' }, { status: 500 });
        }

        return NextResponse.json({ status: 'waiting' });
    }
}
