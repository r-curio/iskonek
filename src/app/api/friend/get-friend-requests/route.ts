import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {

    const supabase = await createClient();  
    const { data: { user }, error: UserError } = await supabase.auth.getUser();

    if (!user || UserError) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: friendRequests, error: friendRequestsError } = await supabase
        .from('friendships')
        .select('from_user_id')
        .eq('to_user_id', user.id)
        .eq('status', 'pending');
    
    if (friendRequestsError) {
        return NextResponse.json({ error: 'Failed to fetch friend requests' }, { status: 500 });
    }

    const friendRequestUserIds = friendRequests.map((request: string) => request.from_user_id);

    const { data: friendProfiles, error: friendProfilesError } = await supabase
        .from('profiles')
        .select('id, username')
        .in('id', friendRequestUserIds);

    if (friendProfilesError) {
        return NextResponse.json({ error: 'Failed to fetch friend profiles' }, { status: 500 });
    }

    console.log(friendProfiles);

    return NextResponse.json({ friendProfiles });

}