import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();

  try {
    const { roomId } = await request.json();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (!user || userError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify user belongs to room
    const { data: room } = await supabase
      .from("chat_rooms")
      .select("*")
      .eq("id", roomId)
      .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
      .single();

    if (!room) {
      return NextResponse.json(
        { error: "Room not found or unauthorized" },
        { status: 404 }
      );
    }

    // Delete chat room
    const { error: deleteRoomError } = await supabase
      .from("chat_rooms")
      .delete()
      .eq("id", roomId)
      .in("type", ["random", "blitz"]);

    if (deleteRoomError) {
      return NextResponse.json(
        { error: "Failed to delete chat room" },
        { status: 500 }
      );
    }

    console.log("success");
    return NextResponse.json({
      status: "success",
      message: "Chat room deleted",
    });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
