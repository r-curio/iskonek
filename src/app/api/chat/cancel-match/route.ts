import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST() {
  const supabase = await createClient();

  const {
    data: { user },
    error: UserError,
  } = await supabase.auth.getUser();
  if (!user || UserError) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Remove user from queue
  const { error: deleteError } = await supabase
    .from("matching_queue")
    .delete()
    .eq("user_id", user.id);

  if (deleteError) {
    return NextResponse.json(
      { error: "Failed to cancel search" },
      { status: 500 }
    );
  }

  return NextResponse.json({ message: "Search cancelled" });
}
