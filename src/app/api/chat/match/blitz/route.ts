import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST() {
  const supabase = await createClient();

  try {
    const {
      data: { user },
      error: UserError,
    } = await supabase.auth.getUser();
    if (!user || UserError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is already matched in a chat room
    const { data: existingRoom, error: roomError } = await supabase
      .from("chat_rooms")
      .select("*")
      .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
      .eq("status", "active")
      .eq("type", "blitz")
      .single();

    if (roomError && roomError.code !== "PGRST116") {
      // Not found error code
      throw roomError;
    }

    if (existingRoom) {
      const otherUserId =
        existingRoom.user1_id === user.id
          ? existingRoom.user2_id
          : existingRoom.user1_id;

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", otherUserId)
        .single();

      if (profileError) {
        throw profileError;
      }

      return NextResponse.json({
        status: "matched",
        room_id: existingRoom.id,
        matchedUser: {
          id: otherUserId,
          username: profile?.username,
        },
      });
    }

    // Check if user is already in queue
    const { data: existingQueue, error: queueError } = await supabase
      .from("matching_queue")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (queueError && queueError.code !== "PGRST116") {
      // Not found error code
      throw queueError;
    }

    if (existingQueue) {
      //get a list of all friends
      const { data: friends, error: friendsError } = await supabase
        .from("friendships")
        .select("from_user_id,to_user_id")
        .eq("status", "accepted")
        .or(`from_user_id.eq.${user.id},to_user_id.eq.${user.id}`);

      if (friendsError) {
        throw new Error("Failed to fetch friends");
      }

      // Extract friend IDs
      const friendIds = friends.map((friend) =>
        friend.from_user_id === user.id
          ? friend.to_user_id
          : friend.from_user_id
      );

      // Build base query
      let matchQuery = supabase
        .from("matching_queue")
        .select("user_id")
        .neq("user_id", user.id)
        .eq("status", "waiting")
        .eq("chat_mode", "blitz")
        .order("joined_at", { ascending: true })
        .limit(1);

      // Add friend exclusion only if there are friends to exclude
      if (friendIds.length > 0) {
        matchQuery = matchQuery.not("user_id", "in", friendIds);
      }
      // Execute query
      const { data: matchQueue, error: matchQueueError } =
        await matchQuery.maybeSingle();

      if (matchQueueError) {
        throw new Error("Failed to find match");
      }

      if (!matchQueue) {
        return NextResponse.json({ status: "waiting" });
      }

      // Use the Postgres function to create the match
      const { data: matchResult, error: matchError } = await supabase.rpc(
        "create_blitz_match",
        {
          user1_id: user.id,
          user2_id: matchQueue.user_id,
        }
      );

      if (matchError) {
        throw matchError;
      }

      if (!matchResult?.[0]?.room_id) {
        throw new Error("Invalid match result format");
      }

      // Get matched user's profile
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", matchQueue.user_id)
        .single();

      if (profileError) {
        throw profileError;
      }

      return NextResponse.json({
        status: "matched",
        room_id: matchResult[0].room_id,
        matchedUser: {
          id: matchQueue.user_id,
          username: profile?.username,
        },
      });
    } else {
      // Insert user into queue
      const { error: insertError } = await supabase
        .from("matching_queue")
        .insert([
          {
            user_id: user.id,
            status: "waiting",
            chat_mode: "blitz",
            joined_at: new Date().toISOString(),
          },
        ]);

      if (insertError) {
        throw insertError;
      }

      return NextResponse.json({ status: "waiting" });
    }
  } catch (error) {
    console.error("Matchmaking error:", error);
    return NextResponse.json(
      { error: "An error occurred during matchmaking" },
      { status: 500 }
    );
  }
}
