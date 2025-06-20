import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { checkModeration } from "./helper";

export async function POST(request: Request) {
  const supabase = await createClient();

  try {
    const { content, roomId } = await request.json();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (!user || userError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("Checking moderation for:", content);

    // Check content moderation
    const startTime = Date.now();
    const moderationResult = await checkModeration(content);
    const endTime = Date.now();
    console.log(`Moderation check took ${endTime - startTime}ms`);

    if (moderationResult.flagged) {
      // Return flagged message info instead of rejecting
      return NextResponse.json({
        status: "flagged",
        message: {
          id: Date.now().toString(),
          content,
          room_id: roomId,
          sender_id: user.id,
          created_at: new Date().toISOString(),
          is_inappropriate: true,
          categories: moderationResult.categories,
        },
      });
    }

    // Message passed moderation - save to database
    const { error } = await supabase.from("messages").insert({
      content,
      room_id: roomId,
      sender_id: user.id,
    });

    if (error) {
      return NextResponse.json(
        { error: "Failed to send message" },
        { status: 500 }
      );
    }

    return NextResponse.json({ status: "success" });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
