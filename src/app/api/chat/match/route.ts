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
        // Find potential match
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

        // Check if a room already exists between these users
        const { data: existingRoomBetweenUsers } = await supabase
            .from('chat_rooms')
            .select('*')
            .or(`and(user1_id.eq.${user.id},user2_id.eq.${matchQueue.user_id}),and(user1_id.eq.${matchQueue.user_id},user2_id.eq.${user.id})`)
            .eq('status', 'active')
            .single();

        if (existingRoomBetweenUsers) {
            // Remove both users from queue as they're already matched
            await supabase
                .from('matching_queue')
                .delete()
                .in('user_id', [user.id, matchQueue.user_id]);

            return NextResponse.json({
                status: 'matched',
                room_id: existingRoomBetweenUsers.id,
                matchedUser: {
                    id: matchQueue.user_id
                }
            });
        }

        // Create chat room for both users
        const { data: room, error: roomError } = await supabase
            .from('chat_rooms')
            .insert({
                user1_id: user.id,
                user2_id: matchQueue.user_id,
                status: 'active'
            })
            .select()
            .single();

        if (roomError) {
            console.error('Room creation error:', roomError);
            return NextResponse.json({ error: 'Failed to create chat room' }, { status: 500 });
        }

        // Update both users' status to matched first
        const { error: updateError } = await supabase
            .from('matching_queue')
            .update({ status: 'matched' })
            .in('user_id', [user.id, matchQueue.user_id]);

        if (updateError) {
            console.error('Status update error:', updateError);
            return NextResponse.json({ error: 'Failed to update match status' }, { status: 500 });
        }

        // Then remove both users from queue
        const { error: deleteError } = await supabase
            .from('matching_queue')
            .delete()
            .in('user_id', [user.id, matchQueue.user_id])

        if (deleteError) {
            console.error('Queue deletion error:', deleteError);
            await supabase
                .from('chat_rooms')
                .delete()
                .eq('id', room.id);
            return NextResponse.json({ error: 'Failed to remove from queue' }, { status: 500 });
        }

        // Get matched user's profile
        const { data: profile } = await supabase
            .from('profiles')
            .select('username')
            .eq('id', matchQueue.user_id)
            .single();

        return NextResponse.json({
            status: 'matched',
            room_id: room.id,
            matchedUser: {
                id: matchQueue.user_id,
                username: profile?.username
            }
        });
    } else {
        // Insert new user into queue
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