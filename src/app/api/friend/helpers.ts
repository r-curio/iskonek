import { SupabaseClient } from '@supabase/supabase-js';

export async function getFriendRequests(supabase: SupabaseClient, userId: string, status: string = 'pending') {
    const { data: friendRequests, error: friendRequestsError } = await supabase
        .from('friendships')
        .select('from_user_id')
        .eq('to_user_id', userId)
        .eq('status', status);
    
    if (friendRequestsError) {
        throw new Error('Failed to fetch friend requests');
    }

    const friendRequestUserIds = friendRequests.map((request: string) => request.from_user_id);

    const { data: friendProfiles, error: friendProfilesError } = await supabase
        .from('profiles')
        .select('id, username')
        .in('id', friendRequestUserIds);

    if (friendProfilesError) {
        throw new Error('Failed to fetch friend profiles');
    }

    return friendProfiles;
}

export async function getAcceptedFriends(supabase: SupabaseClient, userId: string) {
    // Get all accepted friendships
    const { data: friends, error: friendsError } = await supabase
        .from('friendships')
        .select('from_user_id,to_user_id')
        .eq('status', 'accepted')
        .or(`from_user_id.eq.${userId},to_user_id.eq.${userId}`);

    if (friendsError) {
        throw new Error('Failed to fetch friends');
    }

    // Extract friend IDs
    const friendIds = friends.map(friend => 
        friend.from_user_id === userId ? friend.to_user_id : friend.from_user_id
    );

    // Get friend profiles
    const { data: friendProfiles, error: friendProfilesError } = await supabase
        .from('profiles')
        .select('id,username')
        .in('id', friendIds);

    if (friendProfilesError) {
        throw new Error('Failed to fetch friend profiles');
    }

    return friendProfiles;
}
