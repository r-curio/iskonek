import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { getFriendRequests, getAcceptedFriends } from "./helpers";

export async function GET(request: Request) {

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'pending'; 
    const supabase = await createClient();  
    const { data: { user }, error: UserError } = await supabase.auth.getUser();

    if (!user || UserError) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (status === 'pending') {
        const friendRequests = await getFriendRequests(supabase, user.id, status);
        return NextResponse.json({ friendRequests });
    }

    if (status === 'accepted') {
        const acceptedFriends = await getAcceptedFriends(supabase, user.id);
        return NextResponse.json({ acceptedFriends });
    }
}

export async function POST(request: Request) {
    const supabase = await createClient();
    const username = request.headers.get('username');

    const { data: { user }, error: UserError } = await supabase.auth.getUser();
    if (!user || UserError) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find the user_id of the user to be added
    const { data: recipientData, error: recipientError } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', username)
        .single();

    if (recipientError || !recipientData) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const friend_id = recipientData.id;

    // Check if friendship already exists
    const { data: existingFriendship } = await supabase
        .from('friendships')
        .select()
        .or(`and(from_user_id.eq.${user.id},to_user_id.eq.${friend_id}),and(from_user_id.eq.${friend_id},to_user_id.eq.${user.id})`)
        .single();

    if (existingFriendship) {
        return NextResponse.json({ error: 'Friendship already exists' }, { status: 400 });
    }

    // Send friend request
    const { error: friendRequestError } = await supabase
        .from('friendships')
        .insert({
            from_user_id: user.id,
            to_user_id: friend_id,
            status: 'pending',
            created_at: new Date().toISOString()
        });

    if (friendRequestError) {
        console.error('Friend request error:', friendRequestError);
        return NextResponse.json({ 
            error: 'Failed to send friend request',
            details: friendRequestError.message 
        }, { status: 500 });
    }

    return NextResponse.json({ status: 'success' });
}

export async function PUT(request: Request) {

    const supabase = await createClient();
    const { id } = await request.json();

    console.log('Accepting friend request:', id);

    const { data: { user }, error: UserError } = await supabase.auth.getUser();
    if (!user || UserError) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { error: friendRequestError } = await supabase
        .from('friendships')
        .update({ status: 'accepted' })
        .eq('from_user_id', id)
        .eq('to_user_id', user.id);

    if (friendRequestError) {
        console.error('Friend request error:', friendRequestError);
        return NextResponse.json({ 
            error: 'Failed to accept friend request',
            details: friendRequestError.message 
        }, { status: 500 });
    }

    return NextResponse.json({ status: 'success' });
}

