import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const friendId = searchParams.get("friendId");

  console.log("Friend ID:", friendId);

  const supabase = await createClient();
  const {
    data: { user },
    error: UserError,
  } = await supabase.auth.getUser();

  if (!user || UserError) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("chat_rooms")
    .select("id")
    .eq("type", "friend")
    .or(
      `and(user1_id.eq.${user.id},user2_id.eq.${friendId}),and(user1_id.eq.${friendId},user2_id.eq.${user.id})`
    )
    .single();

  console.log("Chat room:", error ? error : data);

  if (error) {
    return NextResponse.json({ error: "Chat room not found" }, { status: 404 });
  }

  return NextResponse.json({ roomId: data.id });
}
